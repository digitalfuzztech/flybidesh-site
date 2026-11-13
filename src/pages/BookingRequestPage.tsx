import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ClipboardCheck, Mail, Plane, UploadCloud, User } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { getRoutePolicy, isEligibleForAlternative } from "../lib/route-policy";
import type { BookingPassenger, ContactDetails, SearchCriteria, FlightItinerary } from "../types";
import { formatCurrency } from "../lib/formatting";

const emptyPassenger: BookingPassenger = {
  fullName: "", dateOfBirth: "", nationality: "", gender: "prefer_not",
  documentType: "passport", documentNumber: "", issueDate: "", expiryDate: "", documentFile: null,
};

const MAX_FILE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

function validateFile(f: File | null): string | null {
  if (!f) return "Document upload is required.";
  if (!ALLOWED.includes(f.type)) return "Unsupported file type.";
  if (f.size > MAX_FILE) return "File exceeds 5 MB.";
  return null;
}

export default function BookingRequestPage() {
  const loc = useLocation();
  const navigate = useNavigate();
  const flight = (loc.state as { flight?: FlightItinerary })?.flight;
  const criteria = (loc.state as { criteria?: SearchCriteria })?.criteria;

  const passengerCount = criteria ? criteria.adults + criteria.children + criteria.infants : 1;
  const policy = criteria ? getRoutePolicy(criteria.origin, criteria.destination) : getRoutePolicy("KTM", "DEL");

  const [step, setStep] = useState(0);
  const [passengers, setPassengers] = useState<BookingPassenger[]>(
    Array.from({ length: passengerCount }, () => ({ ...emptyPassenger }))
  );
  const [contact, setContact] = useState<ContactDetails>({
    fullName: "", callingCode: "+977", whatsapp: "", email: "",
    street: "", city: "", province: "", country: "Nepal", postalCode: "",
  });
  const [consents, setConsents] = useState({
    notConfirmed: false, fareVerification: false, contactUse: false, documentProcessing: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (!flight || !criteria) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-muted">Booking request unavailable. Please search and select a flight.</p>
          <Link to="/" className="mt-4 inline-block text-primary">Go home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const updatePassenger = (idx: number, patch: Partial<BookingPassenger>) => {
    setPassengers((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const validatePassengers = (): boolean => {
    const e: Record<string, string> = {};
    passengers.forEach((p, i) => {
      if (!p.fullName.trim()) e[`p${i}_name`] = "Full name is required.";
      if (!p.dateOfBirth) e[`p${i}_dob`] = "Date of birth is required.";
      if (!p.nationality.trim()) e[`p${i}_nat`] = "Nationality is required.";
      if (!p.documentNumber.trim()) e[`p${i}_docnum`] = "Document number is required.";
      // doc type eligibility
      if (!policy.allowed.includes(p.documentType)) e[`p${i}_doctype`] = "Document type not allowed for this route.";
      if (p.documentType !== "passport" && !isEligibleForAlternative(p.documentType, p.nationality, policy)) {
        e[`p${i}_doctype`] = "This document type is not eligible for the selected nationality.";
      }
      if (p.documentType === "passport" || (p.documentType === "citizenship" && policy.citizenshipAllowed) || (p.documentType === "aadhaar" && policy.aadhaarAllowed)) {
        const fe = validateFile(p.documentFile ?? null);
        if (fe) e[`p${i}_file`] = fe;
      }
      if (p.issueDate && new Date(p.issueDate) > new Date()) e[`p${i}_issue`] = "Issue date cannot be in the future.";
      if (p.expiryDate && criteria.departureDate && new Date(p.expiryDate) < new Date(criteria.departureDate)) e[`p${i}_expiry`] = "Document appears expired before travel.";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateContact = (): boolean => {
    const e: Record<string, string> = {};
    if (!contact.fullName.trim()) e.c_name = "Contact name is required.";
    if (!contact.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) e.c_email = "Valid email is required.";
    if (!contact.whatsapp.trim() || contact.whatsapp.length < 6) e.c_wa = "Valid WhatsApp number is required.";
    if (!contact.street.trim()) e.c_street = "Street address is required.";
    if (!contact.city.trim()) e.c_city = "City is required.";
    if (!contact.country.trim()) e.c_country = "Country is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateConsents = (): boolean => {
    if (!consents.notConfirmed || !consents.fareVerification || !consents.contactUse || !consents.documentProcessing) {
      setErrors({ consent: "All acknowledgements are required." });
      return false;
    }
    setErrors({});
    return true;
  };

  const next = () => {
    if (step === 1 && !validatePassengers()) return;
    if (step === 2 && !validateContact()) return;
    if (step === 3 && !validateConsents()) return;
    setStep((s) => Math.min(3, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    if (!validateConsents()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await new Promise((r) => setTimeout(r, 900));
      const ref = `REQ-${Date.now().toString(36).toUpperCase()}`;
      navigate("/booking-request/success", {
        state: {
          reference: ref,
          flight,
          criteria,
          contact,
          passengers,
          demo: true,
        },
      });
    } catch {
      setSubmitError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const docOptions = policy.allowed;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-page py-8">
        <h1 className="text-2xl font-bold text-midnight">Booking request</h1>
        <p className="mt-1 text-sm text-muted">This is a request, not a confirmed ticket.</p>

        {/* Progress */}
        <div className="mt-6 flex items-center gap-2 text-sm">
          {["Trip", "Traveller details", "Contact", "Review"].map((s, i) => (
            <div key={s} className={`flex items-center gap-2 ${i <= step ? "text-primary" : "text-muted"}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i <= step ? "bg-crimson text-white" : "bg-bg"}`}>{i + 1}</span>
              <span className="hidden sm:inline">{s}</span>
              {i < 3 && <span className="mx-1 h-px w-6 bg-border" />}
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {step === 0 && (
              <div className="card p-6">
                <h2 className="flex items-center gap-2 font-semibold text-midnight"><Plane className="h-4 w-4 text-sky" /> Selected flight</h2>
                <p className="mt-2 text-sm">{flight.segments[0].airline} · {criteria.origin} → {criteria.destination}</p>
                <p className="text-sm text-muted">{criteria.departureDate} {criteria.returnDate ? `· return ${criteria.returnDate}` : ""}</p>
                <p className="text-sm text-muted">{criteria.adults + criteria.children + criteria.infants} traveller(s) · {criteria.cabin}</p>
                <p className="mt-2 text-lg font-bold tabular">{formatCurrency(flight.price, flight.currency)}</p>
                <p className="mt-1 text-xs text-muted">Demonstration fare — subject to verification.</p>
                <div className="mt-4">
                  <Link to={`/flights/${flight.id}`} state={{ flight, criteria }} className="text-sm text-primary">View flight details</Link>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={next} className="rounded-xl bg-crimson px-5 py-2.5 text-sm font-semibold text-white">Continue</button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                {passengers.map((p, idx) => (
                  <div key={idx} className="card p-6">
                    <h3 className="flex items-center gap-2 font-semibold text-midnight"><User className="h-4 w-4 text-sky" /> Traveller {idx + 1}</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-medium text-muted">Full name (as on document)</label>
                        <input value={p.fullName} onChange={(e) => updatePassenger(idx, { fullName: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
                        {errors[`p${idx}_name`] && <p className="mt-1 text-xs text-error">{errors[`p${idx}_name`]}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted">Date of birth</label>
                        <input type="date" value={p.dateOfBirth} onChange={(e) => updatePassenger(idx, { dateOfBirth: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
                        {errors[`p${idx}_dob`] && <p className="mt-1 text-xs text-error">{errors[`p${idx}_dob`]}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted">Nationality</label>
                        <input value={p.nationality} onChange={(e) => updatePassenger(idx, { nationality: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" placeholder="e.g. Nepalese" />
                        {errors[`p${idx}_nat`] && <p className="mt-1 text-xs text-error">{errors[`p${idx}_nat`]}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted">Gender (if required)</label>
                        <select value={p.gender} onChange={(e) => updatePassenger(idx, { gender: e.target.value as BookingPassenger["gender"] })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm">
                          <option value="prefer_not">Prefer not to say</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted">Document type</label>
                        <select value={p.documentType} onChange={(e) => updatePassenger(idx, { documentType: e.target.value as BookingPassenger["documentType"], documentFile: null })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm">
                          {docOptions.map((d) => (
                            <option key={d} value={d}>{d === "passport" ? "Passport" : d === "citizenship" ? "Citizenship" : "Aadhaar"}</option>
                          ))}
                        </select>
                        {errors[`p${idx}_doctype`] && <p className="mt-1 text-xs text-error">{errors[`p${idx}_doctype`]}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted">Document number</label>
                        <input value={p.documentNumber} onChange={(e) => updatePassenger(idx, { documentNumber: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
                        {errors[`p${idx}_docnum`] && <p className="mt-1 text-xs text-error">{errors[`p${idx}_docnum`]}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted">Issue date (if applicable)</label>
                        <input type="date" value={p.issueDate} onChange={(e) => updatePassenger(idx, { issueDate: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
                        {errors[`p${idx}_issue`] && <p className="mt-1 text-xs text-error">{errors[`p${idx}_issue`]}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted">Expiry date (if applicable)</label>
                        <input type="date" value={p.expiryDate} onChange={(e) => updatePassenger(idx, { expiryDate: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
                        {errors[`p${idx}_expiry`] && <p className="mt-1 text-xs text-error">{errors[`p${idx}_expiry`]}</p>}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-xs font-medium text-muted">Document upload</label>
                      <div className="mt-1 rounded-xl border-2 border-dashed border-border p-4 text-center">
                        {p.documentFile ? (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{p.documentFile.name}</span>
                            <button type="button" onClick={() => updatePassenger(idx, { documentFile: null })} className="text-xs text-error">Remove</button>
                          </div>
                        ) : (
                          <label className="flex cursor-pointer flex-col items-center gap-2 text-sm text-muted">
                            <UploadCloud className="h-6 w-6 text-sky" />
                            <span className="font-medium text-midnight">Choose a document</span>
                            <span>JPEG, PNG, WebP, or PDF · max 5 MB</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,application/pdf"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0] || null;
                                updatePassenger(idx, { documentFile: f });
                              }}
                            />
                          </label>
                        )}
                      </div>
                      {errors[`p${idx}_file`] && <p className="mt-1 text-xs text-error">{errors[`p${idx}_file`]}</p>}
                    </div>
                    <p className="mt-3 text-xs text-muted">{policy.note}</p>
                  </div>
                ))}

                <div className="flex justify-between">
                  <button onClick={back} className="rounded-xl border-2 border-border-strong px-5 py-2.5 text-sm font-medium">Back</button>
                  <button onClick={next} className="rounded-xl bg-crimson px-5 py-2.5 text-sm font-semibold text-white">Continue</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card p-6">
                <h2 className="flex items-center gap-2 font-semibold text-midnight"><Mail className="h-4 w-4 text-sky" /> Contact information</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-muted">Contact full name</label>
                    <input value={contact.fullName} onChange={(e) => setContact({ ...contact, fullName: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
                    {errors.c_name && <p className="mt-1 text-xs text-error">{errors.c_name}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted">Country calling code</label>
                    <input value={contact.callingCode} onChange={(e) => setContact({ ...contact, callingCode: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted">WhatsApp number</label>
                    <input value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" placeholder="98XXXXXXXX" />
                    {errors.c_wa && <p className="mt-1 text-xs text-error">{errors.c_wa}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-muted">Email address</label>
                    <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
                    {errors.c_email && <p className="mt-1 text-xs text-error">{errors.c_email}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-muted">Street address</label>
                    <input value={contact.street} onChange={(e) => setContact({ ...contact, street: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
                    {errors.c_street && <p className="mt-1 text-xs text-error">{errors.c_street}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted">City</label>
                    <input value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
                    {errors.c_city && <p className="mt-1 text-xs text-error">{errors.c_city}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted">Province / state</label>
                    <input value={contact.province} onChange={(e) => setContact({ ...contact, province: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted">Country</label>
                    <input value={contact.country} onChange={(e) => setContact({ ...contact, country: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
                    {errors.c_country && <p className="mt-1 text-xs text-error">{errors.c_country}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted">Postal code</label>
                    <input value={contact.postalCode} onChange={(e) => setContact({ ...contact, postalCode: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border-strong px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={back} className="rounded-xl border-2 border-border-strong px-5 py-2.5 text-sm font-medium">Back</button>
                  <button onClick={next} className="rounded-xl bg-crimson px-5 py-2.5 text-sm font-semibold text-white">Continue</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card p-6">
                <h2 className="flex items-center gap-2 font-semibold text-midnight"><ClipboardCheck className="h-4 w-4 text-sky" /> Review and submit</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <p><span className="text-muted">Route:</span> {criteria.origin} → {criteria.destination}</p>
                  <p><span className="text-muted">Date:</span> {criteria.departureDate} {criteria.returnDate ? `· return ${criteria.returnDate}` : ""}</p>
                  <p><span className="text-muted">Passengers:</span> {passengers.length}</p>
                  <p><span className="text-muted">Fare:</span> {formatCurrency(flight.price, flight.currency)} (subject to verification)</p>
                  <p><span className="text-muted">Contact:</span> {contact.fullName} · {contact.email} · {contact.callingCode}{contact.whatsapp}</p>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { key: "notConfirmed", label: "I understand this request is not a confirmed ticket." },
                    { key: "fareVerification", label: "I understand fare and availability will be verified before confirmation." },
                    { key: "contactUse", label: "I consent to being contacted about this request." },
                    { key: "documentProcessing", label: "I consent to processing of my travel-document data for booking assistance, per the privacy policy." },
                  ].map((c) => (
                    <label key={c.key} className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={consents[c.key as keyof typeof consents]}
                        onChange={(e) => setConsents({ ...consents, [c.key]: e.target.checked })}
                        className="mt-1"
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                  <p className="text-xs text-muted">
                    See <Link to="/privacy" className="text-primary">Privacy Policy</Link> and <Link to="/terms" className="text-primary">Terms</Link>.
                  </p>
                  {errors.consent && <p className="text-xs text-error">{errors.consent}</p>}
                </div>

                {submitError && <p className="mt-3 text-sm text-error">{submitError}</p>}

                <div className="mt-6 flex justify-between">
                  <button onClick={back} className="rounded-xl border-2 border-border-strong px-5 py-2.5 text-sm font-medium" disabled={submitting}>Back</button>
                  <button onClick={submit} disabled={submitting} className="rounded-xl bg-crimson px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                    {submitting ? "Submitting…" : "Submit Booking Request"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border-2 border-border-strong bg-white p-5">
              <h3 className="font-semibold">Trip summary</h3>
              <p className="mt-2 text-sm">{criteria.origin} → {criteria.destination}</p>
              <p className="text-xs text-muted">{criteria.departureDate}</p>
              <p className="mt-2 text-sm">{flight.segments[0].airline}</p>
              <p className="text-xs text-muted">{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop(s)`}</p>
              <p className="mt-3 text-lg font-bold tabular">{formatCurrency(flight.price, flight.currency)}</p>
              <p className="text-xs text-muted">Sample fare · subject to verification</p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}





