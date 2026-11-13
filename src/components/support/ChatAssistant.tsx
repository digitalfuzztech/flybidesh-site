import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Send, X } from "lucide-react";

type Message = { role: "assistant" | "user"; text: string };

const welcome =
  "Hello — I'm FlyBidesh's automated flight-booking helper. I can explain how to search, submit a booking request, and what happens next. I can't check live fares or confirm bookings.";

const prompts = [
  "How do I search for flights?",
  "What happens after I submit a booking request?",
  "What documents might I need?",
  "Does submitting a request confirm my ticket?",
];

function answerFor(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("search") && (q.includes("flight") || q.includes("how"))) {
    return "Use the flight search panel at the top of the homepage. Choose round-trip or one-way, set your origin and destination, select dates and travellers, then press Search Flights. You can also edit the search from the results page.";
  }
  if (q.includes("confirm") || q.includes("ticket") || q.includes("booked")) {
    return "No. Submitting a booking request does not confirm a ticket. The flight and fare still need to be verified by our team, and you will be contacted before anything is confirmed.";
  }
  if (q.includes("after") || q.includes("submit") || q.includes("next")) {
    return "After you submit a booking request, our team reviews the selected flight and verifies availability and fare. We then follow up using the email and WhatsApp details you provided. A request is not a confirmed ticket.";
  }
  if (q.includes("document") || q.includes("passport") || q.includes("aadhaar") || q.includes("citizenship")) {
    return "Document requirements depend on the route and nationality. International routes generally require passport details and a passport upload. Nepal–India routes may allow eligible citizenship or Aadhaar documentation where accepted. The form only shows options allowed by the configured route policy.";
  }
  if (q.includes("fare") || q.includes("price") || q.includes("cost")) {
    return "Prices shown in the demo interface are sample data, not live fares. The applicable fare is verified before confirmation.";
  }
  if (q.includes("contact") || q.includes("whatsapp") || q.includes("email")) {
    return "You can find contact options on the Contact page. For a specific booking request, use the email and WhatsApp details you entered so our team can follow up.";
  }
  return "I can help with flight search, booking requests, required traveller details, and what happens next. For anything specific to your trip, please use the Contact page. I can't check availability or issue tickets here.";
}

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [panelMounted, setPanelMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: welcome }]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);

  const closeChat = useCallback(() => {
    setOpen(false);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setPanelMounted(false), 240);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  const toggleChat = () => {
    if (open) {
      closeChat();
      return;
    }
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setPanelMounted(true);
    setOpen(true);
  };

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeChat]);

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }, { role: "assistant", text: answerFor(trimmed) }]);
    setInput("");
  };

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={toggleChat}
        aria-label={open ? "Close flight assistance chat" : "Open flight assistance chat"}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="chat-assistance-panel"
        className="fixed bottom-5 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-crimson text-white shadow-lg transition hover:bg-crimson-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson sm:right-5"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <MessageCircle className="h-5 w-5" aria-hidden="true" />}
      </button>

      {panelMounted && (
        <div
          ref={panelRef}
          id="chat-assistance-panel"
          role="dialog"
          aria-label="Flight assistance chat"
          aria-hidden={!open}
          className={`chat-panel fixed bottom-20 right-4 z-50 flex max-h-[70vh] min-h-0 w-[calc(100%-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border-2 border-border bg-white shadow-2xl transition duration-300 sm:right-5 ${
            open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <div className="flex items-start justify-between gap-3 border-b border-border bg-white px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-midnight">Flight assistance</h2>
              <p className="text-[11px] text-muted">Automated guidance · not a live agent</p>
            </div>
            <button type="button" onClick={closeChat} aria-label="Close chat" className="rounded p-1 text-muted hover:text-midnight">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={`max-w-[88%] rounded-xl px-3 py-2 text-sm leading-relaxed ${m.role === "user" ? "ml-auto bg-crimson text-white" : "bg-neutral-100 text-midnight"}`}>
                {m.text}
              </div>
            ))}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Try asking</p>
              {prompts.map((p) => (
                <button key={p} type="button" onClick={() => send(p)} className="block w-full rounded-lg border border-border bg-white px-3 py-2 text-left text-xs text-midnight transition hover:border-crimson">
                  {p}
                </button>
              ))}
            </div>
            <div className="flex gap-3 border-t border-border pt-3 text-xs">
              <Link to="/how-it-works" className="font-medium text-midnight underline underline-offset-2">How it works</Link>
              <Link to="/help" className="font-medium text-midnight underline underline-offset-2">Help & FAQs</Link>
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about searching or requesting…"
              aria-label="Ask a flight assistance question"
              className="h-10 min-w-0 flex-1 rounded-lg border-2 border-border-strong px-3 text-sm text-midnight placeholder:text-muted focus:border-crimson focus:outline-none"
            />
            <button type="submit" aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-crimson text-white transition hover:bg-crimson-hover">
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}