import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Tag, X } from "lucide-react";
import { Logo } from "./Logo";

const nav = [
  { to: "/", label: "Flights" },
  { to: "/destinations", label: "Destinations" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/help", label: "Help" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  return (
    <>
    <div className="bg-crimson text-white">
      <div className="container-page flex min-h-9 items-center justify-center gap-2 py-1.5 text-center text-xs font-medium sm:text-sm">
        <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <p>Explore flight deals and the latest travel offers. Start with a route search.</p>
      </div>
    </div>
    <header className="sticky top-0 z-40 border-b-2 border-border bg-white/90 backdrop-blur">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <Link to="/" aria-label="FlyBidesh home"><Logo /></Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                loc.pathname === n.to ? "bg-neutral-100 text-midnight" : "text-muted hover:text-midnight"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <Link to="/" className="btn-primary">Find Flights</Link>
          </div>
          <button className="md:hidden rounded-lg p-2 text-midnight" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-midnight/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Logo size="sm" />
              <button onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
            </div>
            <nav className="mt-6 flex flex-col gap-1">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-midnight hover:bg-bg">
                  {n.label}
                </Link>
              ))}
              <Link to="/" onClick={() => setOpen(false)} className="btn-primary mt-2 text-center">Find Flights</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
    </>
  );
}



