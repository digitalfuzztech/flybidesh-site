import { useLocation, Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Mail, MessageCircle, Plane } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import type { FlightItinerary, SearchCriteria, ContactDetails, BookingPassenger } from "../types";
import { formatCurrency } from "../lib/formatting";

export default function RequestSuccessPage() {
  const state = useLocation().state as {
    reference: string; flight: FlightItinerary; criteria: SearchCriteria;
    contact: ContactDetails; passengers: BookingPassenger[]; demo: boolean;
  } | null;

  if (!state) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-muted">No request found.</p>
          <Link to="/" className="mt-4 inline-block font-medium text-sky">Go home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const masked = state.contact.whatsapp.replace(/.(?=.{3})/g, "*");

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-success/20 bg-success/10">
              <CheckCircle2 className="h-9 w-9 text-success" />
            </div>
            <h1 className="mt-5 text-3xl font-bold text-midnight">Your flight request is in.</h1>
            <p className="mx-auto mt-3 max-w-lg text-muted">
              We've received your request. Our team will review your flight details and contact you to confirm availability and the applicable fare.
            </p>
          </div>

          {state.demo && (
            <div className="mt-5 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
              Demonstration mode — this is a simulated request reference. No email or WhatsApp message was sent.
            </div>
          )}

          <div className="mt-8 card overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-border bg-bg/60 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Request reference</p>
                <p className="mt-0.5 font-mono text-lg font-bold text-midnight">{state.reference}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted">Demo</span>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Route</p>
                <p className="mt-1 flex items-center gap-2 font-semibold text-midnight">
                  {state.criteria.origin} <ArrowRight className="h-4 w-4 text-sky" /> {state.criteria.destination}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Travel date</p>
                <p className="mt-1 font-semibold text-midnight">{state.criteria.departureDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Travellers</p>
                <p className="mt-1 font-semibold text-midnight">{state.passengers.length}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Displayed fare</p>
                <p className="mt-1 font-semibold text-midnight">{formatCurrency(state.flight.price, state.flight.currency)} <span className="text-xs font-normal text-muted">sample</span></p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Contact</p>
                <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-midnight">
                  <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4 text-sky" /> {state.contact.email}</span>
                  <span className="inline-flex items-center gap-1.5"><MessageCircle className="h-4 w-4 text-sky" /> {state.contact.callingCode}{masked}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 card p-6">
            <h2 className="flex items-center gap-2 font-semibold text-midnight"><Plane className="h-4 w-4 text-sky" /> Next steps</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-midnight text-[10px] font-bold text-white">1</span>Our team reviews the selected flight and verifies availability and fare.</li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-midnight text-[10px] font-bold text-white">2</span>We contact you using the email and WhatsApp details provided.</li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-midnight text-[10px] font-bold text-white">3</span>You receive confirmation and any further travel requirements from the team.</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-primary">Return home</Link>
            <Link to="/flights" className="btn-secondary">Explore flights</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
