import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { searchAirports, findAirport } from "../../data/airports";

export function AirportCombobox({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string;
  onChange: (code: string) => void;
  label: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = findAirport(value);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = searchAirports(query);

  return (
    <div ref={ref} className="relative min-w-0">
      <label className="mb-1 block text-xs font-medium text-muted">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border-2 border-border-strong bg-white px-3 text-left"
      >
        <span className="min-w-0">
          <span className={`block truncate text-sm font-medium ${selected ? "text-text" : "text-muted"}`}>
            {selected ? `${selected.city} (${selected.code})` : placeholder || "Select airport"}
          </span>
          <span className="block truncate text-[11px] text-muted">
            {selected ? selected.name : "City or airport code"}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border-2 border-border-strong bg-white shadow-lg">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or code…"
            className="w-full border-b-2 border-border px-3 py-2 text-sm outline-none"
          />
          <ul className="max-h-64 overflow-auto py-1">
            {results.map((a) => (
              <li key={a.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(a.code);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-bg"
                >
                  <span>
                    <span className="font-medium">{a.city}</span>
                    <span className="ml-2 text-xs text-muted">{a.name}</span>
                  </span>
                  <span className="font-mono text-xs font-semibold text-primary">{a.code}</span>
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted">No airports found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}




