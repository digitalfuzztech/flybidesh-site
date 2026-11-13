import { Link } from "react-router-dom";
import { Plane } from "lucide-react";
import logoWhite from "../../assets/logo-white.png";
import { openCookieSettings } from "../../lib/consent";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer id="site-footer" className="relative mt-20 overflow-hidden bg-crimson text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full border border-white/10" />
      </div>

      <div className="container-page relative pb-36 pt-14 sm:pt-16">
        <div className="grid gap-10 border-b border-white/20 pb-10 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <img src={logoWhite} alt="FlyBidesh" className="h-30 w-auto object-contain" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
              Flight discovery and booking requests with clear itinerary information and personal follow-up.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/80">
              <Plane className="h-3.5 w-3.5" aria-hidden="true" />
              Request-first booking
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h4 className="text-sm font-semibold">Explore</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                <li><Link to="/" className="transition hover:text-white focus-visible:text-white">Flight Search</Link></li>
                <li><Link to="/destinations" className="transition hover:text-white focus-visible:text-white">Destinations</Link></li>
                <li><Link to="/how-it-works" className="transition hover:text-white focus-visible:text-white">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Support</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                <li><Link to="/help" className="transition hover:text-white focus-visible:text-white">Help & FAQs</Link></li>
                <li><Link to="/contact" className="transition hover:text-white focus-visible:text-white">Contact</Link></li>
                <li><Link to="/privacy" className="transition hover:text-white focus-visible:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="transition hover:text-white focus-visible:text-white">Terms & Conditions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Before you fly</h4>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                Submitting a request is not a confirmed ticket. Availability and fares are verified before confirmation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 text-xs text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} FlyBidesh.com. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/privacy" className="transition hover:text-white focus-visible:text-white">Privacy</Link>
            <Link to="/terms" className="transition hover:text-white focus-visible:text-white">Terms</Link>
            <button
              type="button"
              onClick={openCookieSettings}
              className="transition hover:text-white focus-visible:text-white"
            >
              Cookie preferences
            </button>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-white/60">
          This demo does not send real email or WhatsApp messages. Contact details are configured before launch.
        </p>
      </div>
    </footer>
  );
}
