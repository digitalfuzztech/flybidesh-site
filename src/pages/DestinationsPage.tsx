import { Link } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

const dests = [
  { city: "Delhi", code: "DEL", country: "India", img: "https://images.unsplash.com/photo-1587474260608-2bfa5c1c8e3a?w=600&q=80" },
  { city: "Dubai", code: "DXB", country: "UAE", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80" },
  { city: "Doha", code: "DOH", country: "Qatar", img: "https://images.unsplash.com/photo-1599577181097-49f7f1e3f8e7?w=600&q=80" },
  { city: "Bangkok", code: "BKK", country: "Thailand", img: "https://images.unsplash.com/photo-1508009603885-50cf7c579367?w=600&q=80" },
  { city: "Kuala Lumpur", code: "KUL", country: "Malaysia", img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f08?w=600&q=80" },
  { city: "Singapore", code: "SIN", country: "Singapore", img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80" },
  { city: "Pokhara", code: "PKR", country: "Nepal", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80" },
  { city: "Kathmandu", code: "KTM", country: "Nepal", img: "https://images.unsplash.com/photo-1558799401-1f6c9e6b4c5a?w=600&q=80" },
];

export default function DestinationsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-midnight">Destinations</h1>
        <p className="mt-1 text-sm text-muted">Explore routes. Displaying a destination does not imply flight availability.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dests.map((d) => (
            <Link
              key={d.code}
              to={`/flights?tripType=one-way&origin=KTM&destination=${d.code}&departureDate=${new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)}&adults=1&children=0&infants=0&cabin=economy`}
              className="group relative overflow-hidden rounded-2xl"
            >
              <img src={d.img} alt={d.city} className="h-44 w-full object-cover transition group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-lg font-bold text-white">{d.city}</p>
                <p className="text-xs text-neutral-200">{d.code} · {d.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}




