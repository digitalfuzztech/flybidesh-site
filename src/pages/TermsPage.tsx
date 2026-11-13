import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-midnight">Terms & Conditions (draft)</h1>
        <p className="mt-4 text-sm text-muted">Starter terms describing a request-based service. Requires business/legal review before production. Submitting a request does not confirm a ticket.</p>
      </main>
      <Footer />
    </div>
  );
}




