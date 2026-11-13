import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-midnight sm:text-3xl">How it works</h1>
        <ol className="mt-8 space-y-6">
          {[
            "Search for your flight using origin, destination, dates, and travellers.",
            "Compare available options by price, duration, and stops.",
            "Submit traveller and contact details with required documents.",
            "Receive a request reference and continue with our team.",
          ].map((s, i) => (
            <li key={s} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-crimson text-white text-sm font-bold">{i + 1}</span>
              <p className="pt-1.5">{s}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-muted">A submitted request is not a confirmed ticket. Availability and fares are verified before confirmation.</p>
      </main>
      <Footer />
    </div>
  );
}




