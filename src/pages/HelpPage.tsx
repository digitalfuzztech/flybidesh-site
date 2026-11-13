import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

const faqs = [
  { q: "How does a booking request work?", a: "Search, select, submit traveller and contact details, then our team verifies and confirms." },
  { q: "Is my ticket confirmed immediately?", a: "No. A request is not a confirmed ticket." },
  { q: "When will I receive pricing confirmation?", a: "Our team contacts you after verification." },
  { q: "Which documents may I need?", a: "Passport, and in some cases citizenship or Aadhaar where accepted." },
  { q: "Can I request a domestic flight?", a: "Yes." },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-midnight">Help & FAQs</h1>
        <div className="mt-6 divide-y divide-border">
          {faqs.map((f) => (
            <details key={f.q} className="py-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}




