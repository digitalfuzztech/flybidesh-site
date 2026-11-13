import type { Airport } from "../types";

export const airports: Airport[] = [
  { code: "KTM", city: "Kathmandu", name: "Tribhuvan International Airport", country: "Nepal", countryCode: "NP" },
  { code: "PKR", city: "Pokhara", name: "Pokhara International Airport", country: "Nepal", countryCode: "NP" },
  { code: "BWA", city: "Bhairahawa", name: "Gautam Buddha International Airport", country: "Nepal", countryCode: "NP" },
  { code: "DEL", city: "Delhi", name: "Indira Gandhi International Airport", country: "India", countryCode: "IN" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International Airport", country: "India", countryCode: "IN" },
  { code: "DXB", city: "Dubai", name: "Dubai International Airport", country: "United Arab Emirates", countryCode: "AE" },
  { code: "DOH", city: "Doha", name: "Hamad International Airport", country: "Qatar", countryCode: "QA" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport", country: "Thailand", countryCode: "TH" },
  { code: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur International Airport", country: "Malaysia", countryCode: "MY" },
  { code: "SIN", city: "Singapore", name: "Changi Airport", country: "Singapore", countryCode: "SG" },
  { code: "LHR", city: "London", name: "Heathrow Airport", country: "United Kingdom", countryCode: "GB" },
  { code: "JFK", city: "New York", name: "John F. Kennedy International Airport", country: "United States", countryCode: "US" },
];

export function findAirport(code: string): Airport | undefined {
  return airports.find((a) => a.code === code);
}

export function searchAirports(query: string): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) return airports;
  return airports.filter(
    (a) =>
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  );
}




