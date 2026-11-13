import { describe, it, expect } from "vitest";
import { searchAirports } from "../data/airports";
import { getRoutePolicy, isEligibleForAlternative } from "../lib/route-policy";
import { generateMockFlights } from "../data/mock-flights";

describe("airport search", () => {
  it("finds by code", () => {
    const res = searchAirports("ktm");
    expect(res.some((a) => a.code === "KTM")).toBe(true);
  });
  it("returns all for empty", () => {
    expect(searchAirports("").length).toBeGreaterThan(5);
  });
});

describe("route policy", () => {
  it("domestic nepal allows citizenship", () => {
    const p = getRoutePolicy("KTM", "PKR");
    expect(p.citizenshipAllowed).toBe(true);
    expect(p.aadhaarAllowed).toBe(false);
  });
  it("nepal-india allows aadhaar for indian nationality", () => {
    const p = getRoutePolicy("KTM", "DEL");
    expect(p.aadhaarAllowed).toBe(true);
    expect(isEligibleForAlternative("aadhaar", "Indian", p)).toBe(true);
    expect(isEligibleForAlternative("aadhaar", "Nepalese", p)).toBe(false);
  });
  it("other international only passport", () => {
    const p = getRoutePolicy("KTM", "DXB");
    expect(p.allowed).toEqual(["passport"]);
  });
});

describe("mock flights", () => {
  it("generates flights", () => {
    const f = generateMockFlights({ tripType: "one-way", origin: "KTM", destination: "DEL", departureDate: "2026-11-01", adults: 1, children: 0, infants: 0, cabin: "economy" });
    expect(f.length).toBeGreaterThan(0);
  });
  it("returns empty for same origin/dest", () => {
    const f = generateMockFlights({ tripType: "one-way", origin: "KTM", destination: "KTM", departureDate: "2026-11-01", adults: 1, children: 0, infants: 0, cabin: "economy" });
    expect(f).toHaveLength(0);
  });
});




