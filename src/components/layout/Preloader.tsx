import { useEffect, useState } from "react";
import logoPrimary from "../../assets/logo-primary.png";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let fallback: number | undefined;

    const finish = () => {
      setLeaving(true);
      window.setTimeout(() => setVisible(false), 320);
    };

    if (document.readyState === "complete") {
      const frame = window.requestAnimationFrame(() => window.setTimeout(finish, 180));
      return () => {
        window.cancelAnimationFrame(frame);
        if (fallback) window.clearTimeout(fallback);
      };
    }

    window.addEventListener("load", finish, { once: true });
    fallback = window.setTimeout(finish, 2200);

    return () => {
      window.removeEventListener("load", finish);
      if (fallback) window.clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`preloader ${leaving ? "preloader-out" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading FlyBidesh"
    >
      <img src={logoPrimary} alt="FlyBidesh" className="preloader-logo" />
      <div className="preloader-track" aria-hidden="true">
        <span className="preloader-bar" />
      </div>
    </div>
  );
}