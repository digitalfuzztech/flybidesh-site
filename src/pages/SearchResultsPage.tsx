import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { SearchForm } from "../components/search/SearchForm";
import { generateMockFlights } from "../data/mock-flights";
import { findAirport } from "../data/airports";
import type { FlightItinerary, SearchCriteria } from "../types";
import { formatCurrency, formatDuration, formatTime } from "../lib/formatting";

function parseCriteria(sp: URLSearchParams): SearchCriteria {
  return {
    tripType: (sp.get("tripType") as SearchCriteria["tripType"]) || "round-trip",
    origin: sp.get("origin") || "KTM",
    destination: sp.get("destination") || "DEL",
    departureDate: sp.get("departureDate") || new Date().toISOString().slice(0, 10),
    returnDate: sp.get("returnDate") || undefined,
    adults: Number(sp.get("adults") || 1),
    children: Number(sp.get("children") || 0),
    infants: Number(sp.get("infants") || 0),
    cabin: (sp.get("cabin") as SearchCriteria["cabin"]) || "economy",
  };
}

export default function SearchResultsPage() {
  const [sp] = useSearchParams();
  const criteria = useMemo(() => parseCriteria(sp), [sp]);
  const origin = findAirport(criteria.origin);
  const dest = findAirport(criteria.destination);

  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<FlightItinerary[]>([]);
  const [sort, setSort] = useState("recommended");
  const [airlineFilter, setAirlineFilter] = useState("");
  const [stopsFilter, setStopsFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setFlights(generateMockFlights(criteria));
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, [criteria]);

  const airlines = useMemo(() => Array.from(new Set(flights.map((f) => f.segments[0].airline))), [flights]);

  const filtered = useMemo(() => {
    let list = [...flights];
    if (airlineFilter) list = list.filter((f) => f.segments[0].airline === airlineFilter);
    if (stopsFilter !== "") list = list.filter((f) => f.stops === Number(stopsFilter));
    if (maxPrice !== null) list = list.filter((f) => f.price <= maxPrice);
    switch (sort) {
      case "cheapest":
        list.sort((a, b) => a.price - b.price);
        break;
      case "fastest":
        list.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
        break;
      case "earliest":
        list.sort((a, b) => new Date(a.segments[0].departureTime).getTime() - new Date(b.segments[0].departureTime).getTime());
        break;
      default:
        break;
    }
    return list;
  }, [flights, sort, airlineFilter, stopsFilter, maxPrice]);

  const resetFilters = () => {
    setAirlineFilter("");
    setStopsFilter("");
    setMaxPrice(null);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-page py-8">
        {/* Demo banner */}
        <div className="mb-4 rounded-xl border border-warning/30 bg-warning/10 px-4 py-2 text-sm text-warning">
          Demonstration data — these are sample flights, not live airline results.
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-midnight sm:text-2xl">
              {origin?.city} ({criteria.origin}) → {dest?.city} ({criteria.destination})
            </h1>
            <p className="text-sm text-muted">
              {criteria.departureDate} {criteria.returnDate ? `· return ${criteria.returnDate}` : ""} · {criteria.adults + criteria.children + criteria.infants} traveller(s) · {criteria.cabin.replace("_", " ")}
            </p>
          </div>
          <button onClick={() => setEditOpen((o) => !o)} className="rounded-xl border-2 border-border-strong bg-white px-4 py-2 text-sm font-medium">
            Edit Search
          </button>
        </div>

        {editOpen && (
          <div className="mt-4 rounded-2xl border-2 border-border-strong bg-white p-5">
            <SearchForm initial={criteria} />
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border-2 border-border-strong bg-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={resetFilters} className="text-xs text-primary">Reset</button>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted">Airline</label>
                  <select value={airlineFilter} onChange={(e) => setAirlineFilter(e.target.value)} className="mt-1 w-full rounded-lg border-2 border-border-strong px-2 py-2 text-sm">
                    <option value="">All</option>
                    {airlines.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted">Stops</label>
                  <select value={stopsFilter} onChange={(e) => setStopsFilter(e.target.value)} className="mt-1 w-full rounded-lg border-2 border-border-strong px-2 py-2 text-sm">
                    <option value="">Any</option>
                    <option value="0">Non-stop</option>
                    <option value="1">1 stop</option>
                    <option value="2">2 stops</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted">Max price (USD)</label>
                  <input type="number" value={maxPrice ?? ""} onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)} className="mt-1 w-full rounded-lg border-2 border-border-strong px-2 py-2 text-sm" />
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted">{filtered.length} results</p>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border-2 border-border-strong bg-white px-3 py-2 text-sm">
                <option value="recommended">Recommended</option>
                <option value="cheapest">Cheapest</option>
                <option value="fastest">Fastest</option>
                <option value="earliest">Earliest departure</option>
              </select>
            </div>

            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-36 animate-pulse rounded-2xl bg-white" />
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="rounded-2xl border-2 border-border-strong bg-white p-10 text-center">
                <p className="font-medium">No flights match your filters.</p>
                <button onClick={resetFilters} className="mt-3 text-sm text-primary">Reset filters</button>
              </div>
            )}

            <div className="space-y-4">
              {filtered.map((f) => {
                const first = f.segments[0];
                const last = f.segments[f.segments.length - 1];
                return (
                  <div key={f.id} className="card card-hover overflow-hidden">
                    <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-3 lg:w-48">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-bg text-sm font-bold text-primary">
                          {first.airlineCode}
                        </div>
                        <div>
                          <p className="font-semibold text-midnight">{first.airline}</p>
                          <p className="text-xs text-muted">{f.segments.map((s) => s.flightNumber).join(" · ")}</p>
                        </div>
                      </div>

                      <div className="flex flex-1 items-center justify-between gap-3 sm:gap-5">
                        <div className="min-w-16">
                          <p className="text-xl font-bold tabular text-midnight">{formatTime(first.departureTime)}</p>
                          <p className="text-xs font-medium text-muted">{first.origin}</p>
                        </div>
                        <div className="flex flex-1 flex-col items-center">
                          <p className="text-xs font-medium text-muted">{formatDuration(f.totalDurationMinutes)}</p>
                          <div className="relative my-1.5 h-px w-full max-w-36 bg-border">
                            <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-primary bg-white" />
                            <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-primary bg-white" />
                          </div>
                          <p className="text-xs font-medium text-sky">{f.stops === 0 ? "Non-stop" : `${f.stops} stop${f.stops > 1 ? "s" : ""}`}</p>
                        </div>
                        <div className="min-w-16 text-right">
                          <p className="text-xl font-bold tabular text-midnight">{formatTime(last.arrivalTime)}</p>
                          <p className="text-xs font-medium text-muted">{last.destination}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-border pt-4 lg:w-44 lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
                        <div className="lg:text-right">
                          <p className="text-[11px] uppercase tracking-wide text-muted">Sample fare</p>
                          <p className="text-2xl font-bold tabular text-midnight">{formatCurrency(f.price, f.currency)}</p>
                          <p className="text-[11px] text-muted">{f.baggage}</p>
                        </div>
                        <Link to={`/flights/${f.id}`} state={{ flight: f, criteria }} className="text-sm font-medium text-sky hover:underline lg:hidden">
                          Details
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-bg/60 px-5 py-3">
                      <span className="text-xs text-muted">{f.fareType} · demonstration data</span>
                      <div className="flex gap-2">
                        <Link to={`/flights/${f.id}`} state={{ flight: f, criteria }} className="btn-secondary !px-4 !py-2 !text-xs">View Details</Link>
                        <Link to="/booking-request" state={{ flight: f, criteria }} className="btn-primary !px-4 !py-2 !text-xs">Request to Book</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}





