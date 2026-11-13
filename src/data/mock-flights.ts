import type { FlightItinerary, FlightSegment, SearchCriteria } from "../types";
import { findAirport } from "./airports";

function iso(date: string, time: string): string {
  return `${date}T${time}:00`;
}

export function generateMockFlights(criteria: SearchCriteria): FlightItinerary[] {
  const origin = findAirport(criteria.origin);
  const dest = findAirport(criteria.destination);
  if (!origin || !dest || origin.code === dest.code) return [];

  const airlines = [
    { name: "Nepal Airlines", code: "RA" },
    { name: "Himalaya Airlines", code: "H9" },
    { name: "IndiGo", code: "6E" },
    { name: "Air India", code: "AI" },
    { name: "Qatar Airways", code: "QR" },
    { name: "Emirates", code: "EK" },
    { name: "Thai Airways", code: "TG" },
    { name: "Malaysia Airlines", code: "MH" },
  ];

  const results: FlightItinerary[] = [];
  const basePrices: Record<string, number> = {
    "KTM-DEL": 185, "KTM-DXB": 420, "KTM-DOH": 390, "KTM-BKK": 310,
    "KTM-KUL": 295, "KTM-SIN": 360, "KTM-LHR": 720, "KTM-JFK": 980,
    "KTM-PKR": 95, "KTM-BWA": 110,
  };
  const key = `${origin.code}-${dest.code}`;
  const reverseKey = `${dest.code}-${origin.code}`;
  const base = basePrices[key] ?? basePrices[reverseKey] ?? 350;

  const departTimes = ["06:10", "09:30", "13:45", "17:20", "21:05"];
  const durations = [135, 180, 260, 340];

  for (let i = 0; i < 8; i++) {
    const airline = airlines[i % airlines.length];
    const depTime = departTimes[i % departTimes.length];
    const durMin = durations[i % durations.length];
    const arrDate = new Date(`${criteria.departureDate}T${depTime}:00`);
    arrDate.setMinutes(arrDate.getMinutes() + durMin);
    const arrTime = `${String(arrDate.getHours()).padStart(2, "0")}:${String(arrDate.getMinutes()).padStart(2, "0")}`;
    const arrDateStr = arrDate.toISOString().slice(0, 10);
    const stops = i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2;
    const price = Math.round(base * (0.85 + i * 0.07) * (criteria.cabin === "business" ? 3.2 : criteria.cabin === "premium_economy" ? 1.6 : criteria.cabin === "first" ? 4.5 : 1));

    const segments: FlightSegment[] = [];
    if (stops === 0) {
      segments.push({
        airline: airline.name, airlineCode: airline.code,
        flightNumber: `${airline.code}${100 + i * 13}`,
        origin: origin.code, destination: dest.code,
        departureTime: iso(criteria.departureDate, depTime),
        arrivalTime: iso(arrDateStr, arrTime),
        durationMinutes: durMin,
      });
    } else {
      const mid = airlines[(i + 2) % airlines.length];
      const midCode = stops === 1 ? (origin.code === "KTM" ? "DEL" : "KTM") : "DXB";
      const midAirport = findAirport(midCode === origin.code || midCode === dest.code ? "DXB" : midCode) || findAirport("DXB")!;
      const firstDur = Math.round(durMin * 0.45);
      const layover = 75;
      const secondDur = durMin - firstDur - layover;
      const midArr = new Date(`${criteria.departureDate}T${depTime}:00`);
      midArr.setMinutes(midArr.getMinutes() + firstDur);
      const midDep = new Date(midArr.getTime() + layover * 60000);
      const finalArr = new Date(midDep.getTime() + secondDur * 60000);
      segments.push({
        airline: airline.name, airlineCode: airline.code,
        flightNumber: `${airline.code}${100 + i * 13}`,
        origin: origin.code, destination: midAirport.code,
        departureTime: iso(criteria.departureDate, depTime),
        arrivalTime: iso(midArr.toISOString().slice(0, 10), `${String(midArr.getHours()).padStart(2,"0")}:${String(midArr.getMinutes()).padStart(2,"0")}`),
        durationMinutes: firstDur,
      });
      segments.push({
        airline: mid.name, airlineCode: mid.code,
        flightNumber: `${mid.code}${200 + i * 7}`,
        origin: midAirport.code, destination: dest.code,
        departureTime: iso(midDep.toISOString().slice(0, 10), `${String(midDep.getHours()).padStart(2,"0")}:${String(midDep.getMinutes()).padStart(2,"0")}`),
        arrivalTime: iso(finalArr.toISOString().slice(0, 10), `${String(finalArr.getHours()).padStart(2,"0")}:${String(finalArr.getMinutes()).padStart(2,"0")}`),
        durationMinutes: secondDur,
      });
    }

    results.push({
      id: `demo-${origin.code}-${dest.code}-${i}`,
      source: "demo",
      price,
      currency: "USD",
      segments,
      stops,
      totalDurationMinutes: durMin,
      baggage: i % 2 === 0 ? "1 x 23kg checked + 7kg cabin" : "1 x 20kg checked",
      fareType: i % 2 === 0 ? "Refundable" : "Non-refundable",
      lastUpdated: new Date().toISOString(),
    });
  }
  return results;
}




