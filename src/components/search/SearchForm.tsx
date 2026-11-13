import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import { AirportCombobox } from "./AirportCombobox";
import type { SearchCriteria, TripType, CabinClass } from "../../types";

const today = new Date().toISOString().slice(0, 10);

function addDays(d: string, n: number): string {
  const dt = new Date(d + "T00:00:00");
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
}

export function SearchForm({ initial }: { initial?: Partial<SearchCriteria> }) {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<TripType>(initial?.tripType || "round-trip");
  const [origin, setOrigin] = useState(initial?.origin || "KTM");
  const [destination, setDestination] = useState(initial?.destination || "DEL");
  const [departureDate, setDepartureDate] = useState(initial?.departureDate || addDays(today, 7));
  const [returnDate, setReturnDate] = useState(initial?.returnDate || addDays(today, 14));
  const [adults, setAdults] = useState(initial?.adults ?? 1);
  const [children, setChildren] = useState(initial?.children ?? 0);
  const [infants, setInfants] = useState(initial?.infants ?? 0);
  const [cabin, setCabin] = useState<CabinClass>(initial?.cabin || "economy");
  const [error, setError] = useState("");

  const swap = () => { setOrigin(destination); setDestination(origin); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (origin === destination) { setError("Origin and destination must be different."); return; }
    if (departureDate < today) { setError("Departure date cannot be in the past."); return; }
    if (tripType === "round-trip" && returnDate < departureDate) { setError("Return date must be after departure date."); return; }
    if (adults < 1) { setError("At least one adult passenger is required."); return; }
    if (infants > adults) { setError("Number of infants cannot exceed adults."); return; }
    const params = new URLSearchParams({ tripType, origin, destination, departureDate, adults: String(adults), children: String(children), infants: String(infants), cabin });
    if (tripType === "round-trip") params.set("returnDate", returnDate);
    navigate(`/flights?${params.toString()}`);
  };

  const stepper = (label: string, value: number, set: (n: number) => void, min = 0, max = 9) => (
    <div>
      <p className="mb-1 text-[11px] font-medium text-muted">{label}</p>
      <div className="flex h-10 items-center justify-between rounded-lg border border-border-strong bg-white px-2">
        <button type="button" aria-label={`Decrease ${label}`} onClick={() => set(Math.max(min, value - 1))} className="flex h-6 w-6 items-center justify-center rounded border border-border-strong text-xs text-midnight transition hover:bg-neutral-100">−</button>
        <span className="w-6 text-center text-sm font-medium tabular text-midnight">{value}</span>
        <button type="button" aria-label={`Increase ${label}`} onClick={() => set(Math.min(max, value + 1))} className="flex h-6 w-6 items-center justify-center rounded border border-border-strong text-xs text-midnight transition hover:bg-neutral-100">+</button>
      </div>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["round-trip", "one-way"] as TripType[]).map((t) => (
          <button key={t} type="button" onClick={() => setTripType(t)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${tripType === t ? "bg-crimson text-white" : "border border-border-strong bg-white text-muted hover:text-midnight"}`}>
            {t === "one-way" ? "One-way" : "Round-trip"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-2">
        <AirportCombobox label="From" value={origin} onChange={setOrigin} />
        <button type="button" onClick={swap} aria-label="Swap origin and destination"
          className="mb-0 flex h-12 w-10 items-center justify-center rounded-xl border-2 border-border-strong bg-white text-primary transition hover:bg-neutral-50">
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <AirportCombobox label="To" value={destination} onChange={setDestination} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted">Departure</label>
          <input type="date" value={departureDate} min={today} onChange={(e) => setDepartureDate(e.target.value)} className="h-12 w-full rounded-xl border-2 border-border-strong bg-white px-3 text-sm text-midnight" />
        </div>
        {tripType === "round-trip" && (
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted">Return</label>
            <input type="date" value={returnDate} min={departureDate} onChange={(e) => setReturnDate(e.target.value)} className="h-12 w-full rounded-xl border-2 border-border-strong bg-white px-3 text-sm text-midnight" />
          </div>
        )}
        <div className={tripType === "one-way" ? "sm:col-span-2" : ""}>
          <label className="mb-1 block text-[11px] font-medium text-muted">Cabin class</label>
          <select value={cabin} onChange={(e) => setCabin(e.target.value as CabinClass)} className="h-12 w-full rounded-xl border-2 border-border-strong bg-white px-3 text-sm text-midnight">
            <option value="economy">Economy</option>
            <option value="premium_economy">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl bg-neutral-50 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Travellers</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {stepper("Adults", adults, setAdults, 1, 9)}
          {stepper("Children", children, setChildren, 0, 8)}
          {stepper("Infants", infants, setInfants, 0, 4)}
        </div>
      </div>

      {error && <p role="alert" className="rounded-lg border border-border-strong bg-neutral-50 px-3 py-2 text-sm text-midnight">{error}</p>}

      <button type="submit" className="h-12 w-full rounded-xl bg-crimson text-sm font-semibold text-white transition hover:bg-crimson-hover">
        Search Flights
      </button>
    </form>
  );
}