import { useState } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-midnight">Contact</h1>
        <p className="mt-1 text-sm text-muted">Contact details are configured before launch. WhatsApp and email entry points will be added.</p>
        {!sent ? (
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="mt-6 space-y-4 rounded-2xl border-2 border-border-strong bg-white p-6"
          >
            <input placeholder="Name" required className="w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
            <input type="email" placeholder="Email" required className="w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
            <textarea placeholder="Message" rows={4} required className="w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
            <button className="rounded-xl bg-crimson px-5 py-2.5 text-sm font-semibold text-white">Send message</button>
          </form>
        ) : (
          <p className="mt-6 text-sm text-success">Thanks — your message has been recorded (demo).</p>
        )}
      </main>
      <Footer />
    </div>
  );
}




