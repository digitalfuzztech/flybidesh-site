import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock3, Plane, ShieldCheck } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import type { FlightItinerary, SearchCriteria } from "../types";
import { formatCurrency, formatDuration, formatTime, formatDate } from "../lib/formatting";

export default function FlightDetailsPage() {
  const loc = useLocation();
  const navigate = useNavigate();
  const flight = (loc.state as { flight?: FlightItinerary })?.flight;
  const criteria = (loc.state as { criteria?: SearchCriteria })?.criteria;

  if (!flight) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-muted">Flight details unavailable. Please search again.</p>
          <Link to="/" className="mt-4 inline-block font-medium text-sky">Go home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const first = flight.segments[0];
  const last = flight.segments[flight.segments.length - 1];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-page py-8">
        <Link to="/flights" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-midnight">
          <ArrowLeft className="h-4 w-4" /> Back to results
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky">Itinerary</p>
            <h1 className="mt-1 text-2xl font-bold text-midnight sm:text-3xl">Flight details</h1>
            <p className="mt-1 text-sm text-muted">Demonstration data — sample itinerary.</p>
          </div>
          <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted">Sample fare</span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg text-sm font-bold text-primary">
                  {first.airlineCode}
                </div>
                <div>
                  <p className="font-semibold text-midnight">{first.airline}</p>
                  <p className="text-xs text-muted">{flight.segments.map((s) => s.flightNumber).join(" · ")}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-bg p-4">
                <div>
                  <p className="text-2xl font-bold tabular text-midnight">{formatTime(first.departureTime)}</p>
                  <p className="text-sm font-medium text-midnight">{first.origin}</p>
                  <p className="text-xs text-muted">{formatDate(first.departureTime.slice(0, 10))}</p>
                </div>
                <div className="flex flex-1 flex-col items-center">
                  <p className="text-xs font-medium text-muted">{formatDuration(flight.totalDurationMinutes)}</p>
                  <div className="relative my-2 h-px w-full max-w-44 bg-border-strong">
                    <Plane className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-90 bg-bg px-0.5 text-primary" />
                  </div>
                  <p className="text-xs font-medium text-sky">{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold tabular text-midnight">{formatTime(last.arrivalTime)}</p>
                  <p className="text-sm font-medium text-midnight">{last.destination}</p>
                  <p className="text-xs text-muted">{formatDate(last.arrivalTime.slice(0, 10))}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {flight.segments.map((s, i) => (
                  <div key={i} className="rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-midnight text-[10px] font-bold text-white">{i + 1}</span>
                        <p className="font-medium text-midnight">{s.origin} → {s.destination}</p>
                      </div>
                      <p className="text-xs text-muted">{s.airline} {s.flightNumber}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted">Departure</p>
                        <p className="font-semibold text-midnight">{formatTime(s.departureTime)}</p>
                        <p className="text-xs text-muted">{formatDate(s.departureTime.slice(0, 10))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Arrival</p>
                        <p className="font-semibold text-midnight">{formatTime(s.arrivalTime)}</p>
                        <p className="text-xs text-muted">{formatDate(s.arrivalTime.slice(0, 10))}</p>
                      </div>
                    </div>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted">
                      <Clock3 className="h-3.5 w-3.5" /> {formatDuration(s.durationMinutes)} in the air
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Baggage</p>
                <p className="mt-1 font-medium text-midnight">{flight.baggage || "Not specified"}</p>
              </div>
              <div className="card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Fare type</p>
                <p className="mt-1 font-medium text-midnight">{flight.fareType || "Not specified"}</p>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Total sample fare</p>
              <p className="mt-1 text-3xl font-bold tabular text-midnight">{formatCurrency(flight.price, flight.currency)}</p>
              <p className="mt-1 text-xs text-muted">Fare and availability require verification.</p>
              <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <p className="flex justify-between gap-2"><span className="text-muted">Route</span><span className="font-medium">{first.origin} → {last.destination}</span></p>
                <p className="flex justify-between gap-2"><span className="text-muted">Travel date</span><span className="font-medium">{formatDate(first.departureTime.slice(0, 10))}</span></p>
                <p className="flex justify-between gap-2"><span className="text-muted">Travellers</span><span className="font-medium">{criteria ? criteria.adults + criteria.children + criteria.infants : 1}</span></p>
              </div>
              <button
                onClick={() => navigate("/booking-request", { state: { flight, criteria } })}
                className="btn-primary mt-5 w-full"
              >
                Continue to Passenger Details
              </button>
              <p className="mt-3 flex items-start gap-2 text-xs text-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
                This is a booking request, not a confirmed ticket.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
