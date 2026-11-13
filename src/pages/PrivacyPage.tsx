import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 prose prose-slate">
        <h1 className="text-2xl font-bold text-midnight">Privacy Policy (draft)</h1>
        <p className="mt-4 text-sm text-muted">This starter policy requires legal review before launch. We collect traveller and contact details and identity documents solely to assist with booking requests. Data is not sold. Documents are handled by the secure backend once connected.</p>
      </main>
      <Footer />
    </div>
  );
}




