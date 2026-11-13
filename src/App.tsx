import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Preloader } from "./components/layout/Preloader";
import { BackToTop } from "./components/ui/BackToTop";
import { CookieConsent } from "./components/ui/CookieConsent";
import { ChatAssistant } from "./components/support/ChatAssistant";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import FlightDetailsPage from "./pages/FlightDetailsPage";
import BookingRequestPage from "./pages/BookingRequestPage";
import RequestSuccessPage from "./pages/RequestSuccessPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import DestinationsPage from "./pages/DestinationsPage";
import ContactPage from "./pages/ContactPage";
import HelpPage from "./pages/HelpPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";

function HashScroll() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const node = document.getElementById(id);
    if (!node) return;
    const frame = window.requestAnimationFrame(() => node.scrollIntoView({ block: "start" }));
    return () => window.cancelAnimationFrame(frame);
  }, [hash, pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <Preloader />
      <BrowserRouter>
        <HashScroll />
        <CookieConsent />
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flights" element={<SearchResultsPage />} />
        <Route path="/flights/:id" element={<FlightDetailsPage />} />
        <Route path="/booking-request" element={<BookingRequestPage />} />
        <Route path="/booking-request/success" element={<RequestSuccessPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        </Routes>
        <BackToTop />
        <ChatAssistant />
      </BrowserRouter>
    </>
  );
}




