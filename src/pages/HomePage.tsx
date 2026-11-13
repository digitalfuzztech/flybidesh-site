import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ClipboardList,
  ListChecks,
  MessageSquare,
  Plane,
  Search,
} from "lucide-react";
import { SearchForm } from "../components/search/SearchForm";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Reveal } from "../components/ui/Reveal";

const tomorrow = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
const nextWeek = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

const routes = [
  { from: "KTM", to: "DXB", fromCity: "Kathmandu", toCity: "Dubai", type: "International", featured: true },
  { from: "KTM", to: "PKR", fromCity: "Kathmandu", toCity: "Pokhara", type: "Domestic Nepal", featured: false },
  { from: "KTM", to: "DEL", fromCity: "Kathmandu", toCity: "Delhi", type: "International", featured: false },
  { from: "KTM", to: "BKK", fromCity: "Kathmandu", toCity: "Bangkok", type: "International", featured: false },
  { from: "KTM", to: "DOH", fromCity: "Kathmandu", toCity: "Doha", type: "International", featured: false },
];

const destinations = [
  { city: "Dubai", code: "DXB", origin: "KTM", country: "United Arab Emirates", img: "/dest-dubai.jpg", span: "lg:col-span-2 lg:row-span-2" },
  { city: "Pokhara", code: "PKR", origin: "KTM", country: "Nepal", img: "/dest-pokhara.jpg", span: "" },
  { city: "Kathmandu", code: "KTM", origin: "PKR", country: "Nepal", img: "/hero-himalayas.jpg", span: "" },
  { city: "Singapore", code: "SIN", origin: "KTM", country: "Singapore", img: "/route-singapore.jpg", span: "" },
  { city: "Delhi", code: "DEL", origin: "KTM", country: "India", img: "https://images.unsplash.com/photo-1587474260608-2bfa5c1c8e3a?w=900&q=80", span: "" },
];

const journey = [
  { title: "Search", text: "Choose a route and travel dates.", icon: Search },
  { title: "Choose", text: "Review the available flight options.", icon: ListChecks },
  { title: "Request", text: "Submit traveller and required details.", icon: ClipboardList },
  { title: "Confirm", text: "Our team follows up before anything is confirmed.", icon: BadgeCheck },
];

const benefits = [
  { title: "Explore in one place", text: "Search domestic and international flight options from a single starting point.", icon: Search },
  { title: "Clear itinerary details", text: "Review flight times, stops, duration, and sample fare information where provided.", icon: ListChecks },
  { title: "Simple request flow", text: "Submit passenger and contact details through a guided booking request.", icon: ClipboardList },
  { title: "Personal follow-up", text: "Our team reviews the request and follows up about availability and fare.", icon: MessageSquare },
];

const faqs = [
  {
    q: "How do I search for a flight?",
    a: "Use the flight search panel at the top of the homepage. Choose your trip type, origin, destination, travel dates, and travellers, then select Search Flights to see the available sample options.",
  },
  {
    q: "What happens after I submit a booking request?",
    a: "You receive a request reference. Our team reviews the selected flight and verifies availability and fare, then follows up using the email and WhatsApp details you provided.",
  },
  {
    q: "Does submitting a request confirm my ticket?",
    a: "No. A booking request is not a confirmed ticket. Confirmation happens only after our team verifies availability and fare and contacts you.",
  },
  {
    q: "What passenger details or documents may be required?",
    a: "The booking form asks for traveller and contact details. International routes generally require passport information and a passport upload. Eligible Nepal–India routes may accept citizenship or Aadhaar documentation where the configured route policy allows it.",
  },
  {
    q: "How will FlyBidesh follow up?",
    a: "The booking request form collects an email address and WhatsApp number. Our team uses those details to follow up about the request. This demo does not send real email or WhatsApp messages.",
  },
  {
    q: "Can I request a domestic Nepal flight?",
    a: "Yes. Domestic Nepal routes are supported in the search experience, including Kathmandu to Pokhara.",
  },
];

function routeLink(from: string, to: string) {
  return `/flights?tripType=round-trip&origin=${from}&destination=${to}&departureDate=${tomorrow}&returnDate=${nextWeek}&adults=1&children=0&infants=0&cabin=economy`;
}

function fallbackImage(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (!img.src.endsWith("/travel-clouds.jpg")) img.src = "/travel-clouds.jpg";
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-midnight text-white">
          <img src="/hero-himalayas.jpg" alt="Himalayan landscape" className="hero-image absolute inset-0 h-full w-full object-cover opacity-45" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight/90 via-midnight/70 to-midnight/30" />
          <div className="container-page relative grid gap-8 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-20">
            <div className="hero-copy">
              <p className="eyebrow text-neutral-200">YOUR JOURNEY, MADE SIMPLE</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Somewhere amazing is <span className="relative inline-block">waiting.<span className="absolute bottom-1 left-0 h-1 w-full rounded-full bg-crimson" /></span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-neutral-200 sm:text-lg">
                Discover flights around the world. Compare options, request your ticket, and let our team help with the next step.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-neutral-300">
                <span className="rounded-full bg-white/10 px-3 py-1">Domestic & international routes</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Personal assistance</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Clear flight details</span>
              </div>
            </div>
            <div id="flight-search" className="hero-panel card scroll-mt-24 p-5 sm:p-6">
              <SearchForm />
            </div>
          </div>
        </section>

        {/* Popular flight routes */}
        <section id="popular-routes" className="border-y border-border bg-neutral-50 py-16 sm:py-20">
          <div className="container-page">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">Route discovery</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-midnight sm:text-4xl">Popular flight routes</h2>
              <p className="mt-3 text-muted">
                Start with a route from Kathmandu, then search for the dates that suit your journey.
              </p>
            </Reveal>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {routes.map((r, i) => (
                <Reveal key={`${r.from}${r.to}`} delay={i * 60} className={`h-full ${r.featured ? "sm:col-span-2 lg:col-span-2" : ""}`}>
                  <Link
                    to={routeLink(r.from, r.to)}
                    className={`group relative flex h-full min-h-[210px] flex-col justify-between overflow-hidden rounded-2xl border-2 p-6 transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson ${
                      r.featured
                        ? "border-midnight bg-midnight text-white"
                        : "border-border bg-white text-midnight hover:-translate-y-0.5 hover:border-crimson hover:shadow-md"
                    }`}
                    aria-label={`Explore flights from ${r.fromCity} to ${r.toCity}`}
                  >
                    {r.featured && (
                      <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
                    )}
                    <div className="relative flex items-start justify-between gap-4">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                          r.featured ? "bg-crimson text-white" : "border border-border bg-neutral-50 text-muted"
                        }`}
                      >
                        {r.type}
                      </span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
                          r.featured
                            ? "border-white/25 text-white group-hover:border-white/60 group-hover:bg-white/10"
                            : "border-border text-crimson group-hover:border-crimson group-hover:bg-crimson group-hover:text-white"
                        }`}
                      >
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="relative mt-8">
                      <div className="flex items-center gap-3">
                        <span className={`text-3xl font-extrabold tracking-tight ${r.featured ? "text-white" : "text-midnight"}`}>{r.from}</span>
                        <span className="flex flex-1 items-center gap-2" aria-hidden="true">
                          <span className="h-px flex-1 bg-crimson" />
                          <Plane className="h-4 w-4 text-crimson" />
                          <span className="h-px w-6 bg-crimson" />
                        </span>
                        <span className={`text-3xl font-extrabold tracking-tight ${r.featured ? "text-white" : "text-midnight"}`}>{r.to}</span>
                      </div>
                      <p className={`mt-2 text-sm font-medium ${r.featured ? "text-white/75" : "text-muted"}`}>
                        {r.fromCity} <span aria-hidden="true">→</span> {r.toCity}
                      </p>
                      <p className={`mt-1 text-xs ${r.featured ? "text-white/60" : "text-muted"}`}>Explore route options</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
            <p className="mt-5 text-xs text-muted">Routes are shown for discovery. Availability and fares are verified after a booking request.</p>
          </div>
        </section>

        {/* Why travellers choose us + How it works share one continuous photographic layer */}
        <div className="relative overflow-hidden bg-neutral-900 text-white">
          <img
            src="/travel-airport.jpg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center"
            onError={fallbackImage}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/85" />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(200,16,46,0.22),transparent_42%)]" />

          <section id="why-choose-us" className="relative container-page scroll-mt-20 py-16 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">A calmer way to book</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Why travellers choose FlyBidesh</h2>
                <p className="mt-4 max-w-xl text-white/80">
                  Flight discovery, clear itinerary information, and a booking-request flow that keeps a real person in the loop.
                </p>
                <div className="mt-7 h-1 w-20 rounded-full bg-crimson" />
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-2">
                {benefits.map((b, i) => {
                  const Icon = b.icon;
                  const wide = i === 0 || i === 3;
                  const horizontal = i === 0 || i === 3;
                  return (
                    <Reveal key={b.title} delay={i * 70} className={`h-full ${wide ? "sm:col-span-2" : ""}`}>
                      <div
                        className={`relative h-full overflow-hidden rounded-2xl border p-5 backdrop-blur-sm transition hover:border-white/40 ${
                          i === 0
                            ? "border-white/30 bg-white/15"
                            : i === 3
                              ? "border-white/15 bg-black/25"
                              : "border-white/15 bg-white/10"
                        } ${horizontal ? "sm:flex sm:items-start sm:gap-4" : ""}`}
                      >
                        {i === 3 && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 bg-crimson" />}
                        <span className={`flex shrink-0 items-center justify-center rounded-xl border border-crimson/40 bg-black/25 ${i === 0 ? "h-12 w-12" : "h-10 w-10"}`}>
                          <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                        </span>
                        <div className={i === 0 ? "mt-4 sm:mt-0" : "mt-3 sm:mt-0"}>
                          <h3 className="font-semibold text-white">{b.title}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-white/75">{b.text}</p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="how-it-works" className="relative container-page scroll-mt-20 pb-16 pt-10 sm:pb-24 sm:pt-14">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">The request-first journey</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">How it works</h2>
              <p className="mt-3 text-white/75">
                Four clear steps from route search to a human follow-up. Submitting a request does not issue a ticket.
              </p>
            </Reveal>

            <Reveal className="journey-flow relative mx-auto mt-10 hidden min-h-[600px] max-w-[620px] items-center justify-center lg:flex">
              <div className="relative h-[600px] w-[600px]">
                <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <circle cx="300" cy="300" r="214" fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="1.5" strokeDasharray="8 10" />
                  <circle
                    className="journey-path"
                    cx="300"
                    cy="300"
                    r="214"
                    fill="none"
                    stroke="#C8102E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    transform="rotate(-90 300 300)"
                  />
                  <g fill="#C8102E" opacity="0.85">
                    <path d="M -5 -5 L 6 0 L -5 5 Z" transform="translate(451 451) rotate(45)" />
                    <path d="M -5 -5 L 6 0 L -5 5 Z" transform="translate(149 451) rotate(135)" />
                    <path d="M -5 -5 L 6 0 L -5 5 Z" transform="translate(149 149) rotate(225)" />
                    <path d="M -5 -5 L 6 0 L -5 5 Z" transform="translate(451 149) rotate(315)" />
                  </g>
                </svg>

                <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/40 bg-white shadow-xl ring-8 ring-white/10">
                  <Plane className="h-7 w-7 text-crimson" aria-hidden="true" />
                  <p className="mt-2 text-sm font-bold text-midnight">FlyBidesh</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted">Request first</p>
                </div>

                {journey.map((s, i) => {
                  const Icon = s.icon;
                  const positions = [
                    "left-1/2 top-0 -translate-x-1/2",
                    "right-0 top-1/2 -translate-y-1/2",
                    "left-1/2 bottom-0 -translate-x-1/2",
                    "left-0 top-1/2 -translate-y-1/2",
                  ];
                  return (
                    <div
                      key={s.title}
                      className={`absolute w-52 rounded-2xl border border-white/20 bg-white p-4 text-midnight shadow-xl ${positions[i]}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-crimson text-xs font-bold text-white">{i + 1}</span>
                        <Icon className="h-5 w-5 text-midnight" aria-hidden="true" />
                      </div>
                      <h3 className="mt-2 font-semibold text-midnight">{s.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{s.text}</p>
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <ol className="mx-auto mt-10 max-w-xl space-y-4 lg:hidden">
              {journey.map((s, i) => {
                const Icon = s.icon;
                return (
                  <li key={s.title} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-crimson text-sm font-bold text-white">{i + 1}</span>
                      {i < journey.length - 1 && <span className="mt-1 w-px flex-1 bg-white/30" />}
                    </div>
                    <div className="mb-4 flex-1 rounded-2xl border border-white/20 bg-black/30 p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-white" aria-hidden="true" />
                        <h3 className="font-semibold text-white">{s.title}</h3>
                      </div>
                      <p className="mt-1 text-sm text-white/75">{s.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="mt-6 text-center text-xs text-white/60">A submitted request is not a confirmed ticket.</p>
          </section>
        </div>

        {/* Destination inspirations */}
        <section id="destinations" className="container-page section scroll-mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Travel inspiration</p>
              <h2 className="mt-2 text-3xl font-bold text-midnight sm:text-4xl">Destination inspirations</h2>
              <p className="mt-2 text-muted">A few places to start. Choose a destination to search for available flight options.</p>
            </Reveal>
            <Link to="/destinations" className="btn-secondary">All destinations</Link>
          </div>

          <div className="mt-8 grid auto-rows-[180px] gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px]">
            {destinations.map((d, i) => (
              <Reveal key={d.code} delay={i * 60} className={`h-full ${d.span}`}>
                <Link
                  to={routeLink(d.origin, d.code)}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                  aria-label={`Search flights to ${d.city}`}
                >
                  <img src={d.img} alt={`${d.city} destination`} loading="lazy" onError={fallbackImage} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition duration-500 group-hover:from-black/90" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">{d.code} · {d.country}</p>
                      <p className="mt-1 text-xl font-bold text-white">{d.city}</p>
                    </div>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 bg-black/25 transition group-hover:border-crimson group-hover:bg-crimson">
                      <ArrowRight className="h-4 w-4 text-white transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section id="final-cta" className="container-page scroll-mt-20 pt-16 sm:pt-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-midnight text-white">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_18%,rgba(200,16,46,0.3),transparent_46%)]" />
              <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-14">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Ready when you are</p>
                  <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    Your next journey starts with a search.
                  </h2>
                  <p className="mt-4 max-w-xl text-white/75">
                    Start with a route and travel dates. Review the available options, then submit a request when you are ready.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a href="#flight-search" className="btn-primary gap-2">
                      Search flights
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <Link
                      to="/how-it-works"
                      className="inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
                    >
                      How it works
                    </Link>
                  </div>
                  <p className="mt-4 text-xs text-white/55">A submitted request is not a confirmed ticket.</p>
                </div>

                <div aria-hidden="true" className="hidden justify-end lg:flex">
                  <div className="w-72 rotate-[-5deg] rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                      <span>Next journey</span>
                      <Plane className="h-4 w-4 text-crimson" />
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                      <span className="text-2xl font-extrabold">KTM</span>
                      <span className="flex flex-1 items-center gap-2">
                        <span className="h-px flex-1 bg-crimson" />
                        <Plane className="h-3.5 w-3.5 text-crimson" />
                        <span className="h-px w-6 bg-crimson" />
                      </span>
                      <span className="text-2xl font-extrabold">DXB</span>
                    </div>
                    <div className="mt-6 border-t border-white/15 pt-4 text-xs text-white/65">
                      <p>Search · Choose · Request · Confirm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-white py-16 sm:py-24">
          <div className="container-page grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow">Good to know</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-midnight sm:text-4xl">Frequently asked questions</h2>
              <p className="mt-3 max-w-md text-muted">
                Short answers about searching, requesting, and what happens before a booking is confirmed.
              </p>
              <Link to="/help" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-midnight underline decoration-crimson decoration-2 underline-offset-4 hover:text-crimson">
                Visit Help & FAQs
                <ArrowRight className="h-4 w-4 text-crimson" aria-hidden="true" />
              </Link>
            </Reveal>

            <div className="divide-y divide-border border-y border-border">
              {faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <Reveal key={f.q} delay={i * 50}>
                    <h3>
                      <button
                        type="button"
                        id={`faq-button-${i}`}
                        aria-expanded={open}
                        aria-controls={`faq-panel-${i}`}
                        onClick={() => setOpenFaq(open ? null : i)}
                        className="flex w-full items-center justify-between gap-6 py-5 text-left"
                      >
                        <span className="font-semibold text-midnight">{f.q}</span>
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                            open ? "border-crimson bg-crimson text-white" : "border-border bg-white text-midnight"
                          }`}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-button-${i}`}
                      aria-hidden={!open}
                      className={`overflow-hidden transition-all duration-300 ease-out ${open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <p className="pb-5 pr-12 text-sm leading-relaxed text-muted">{f.a}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}