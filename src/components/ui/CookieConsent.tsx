import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { COOKIE_STORAGE_KEY, OPEN_COOKIE_SETTINGS_EVENT } from "../../lib/consent";

function hasAcceptedConsent() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(COOKIE_STORAGE_KEY) === "accepted";
  } catch {
    return false;
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(() => !hasAcceptedConsent());
  const [confirmation, setConfirmation] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const openSettings = () => {
      setConfirmation(false);
      setStorageError(false);
      setVisible(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  useEffect(() => {
    if (!confirmation) return;
    const timer = window.setTimeout(() => setConfirmation(false), 2800);
    return () => window.clearTimeout(timer);
  }, [confirmation]);

  const accept = () => {
    try {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, "accepted");
      setStorageError(false);
      setVisible(false);
      setConfirmation(true);
    } catch {
      setStorageError(true);
    }
  };

  return (
    <>
      {visible && (
        <aside
          className="relative z-[60] border-b-2 border-border bg-neutral-50 px-4 py-2.5 sm:px-6"
          aria-label="Cookie preference"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
              <Cookie className="h-4 w-4 text-crimson" aria-hidden="true" />
            </span>
            <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted">
              <span className="font-semibold text-midnight">Essential storage only.</span>{" "}
              No analytics or advertising cookies.
            </p>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="hidden rounded-lg px-3 py-2 text-xs font-medium text-muted transition hover:text-midnight sm:inline-flex"
              >
                Not now
              </button>
              <button type="button" onClick={accept} className="btn-primary !px-3.5 !py-2 !text-xs">
                Accept
              </button>
              <button
                type="button"
                onClick={() => setVisible(false)}
                aria-label="Dismiss cookie notice"
                className="rounded p-1.5 text-muted transition hover:text-midnight"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          {storageError && (
            <p role="status" className="mx-auto mt-1 max-w-7xl text-xs text-muted">
              Your preference could not be saved in this browser.
            </p>
          )}
        </aside>
      )}

      {confirmation && (
        <div
          role="status"
          aria-live="polite"
          className="toast-in fixed right-4 top-24 z-[60] rounded-xl border border-border bg-white px-4 py-3 text-sm text-midnight shadow-lg sm:right-6"
        >
          Cookie preference saved.
        </div>
      )}
    </>
  );
}
