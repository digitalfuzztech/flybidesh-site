import { findAirport } from "../data/airports";

export type DocumentOption = "passport" | "citizenship" | "aadhaar";

export interface RouteDocumentPolicy {
  allowed: DocumentOption[];
  requiresPassportUpload: boolean;
  citizenshipAllowed: boolean;
  aadhaarAllowed: boolean;
  note: string;
}

export function getRoutePolicy(originCode: string, destinationCode: string): RouteDocumentPolicy {
  const origin = findAirport(originCode);
  const dest = findAirport(destinationCode);
  const bothNepal = origin?.countryCode === "NP" && dest?.countryCode === "NP";
  const nepalIndia =
    (origin?.countryCode === "NP" && dest?.countryCode === "IN") ||
    (origin?.countryCode === "IN" && dest?.countryCode === "NP");

  if (bothNepal) {
    return {
      allowed: ["passport", "citizenship"],
      requiresPassportUpload: true,
      citizenshipAllowed: true,
      aadhaarAllowed: false,
      note:
        "For domestic Nepal routes, passport or applicable Nepal citizenship documentation may be used, subject to airline and route requirements.",
    };
  }
  if (nepalIndia) {
    return {
      allowed: ["passport", "citizenship", "aadhaar"],
      requiresPassportUpload: true,
      citizenshipAllowed: true,
      aadhaarAllowed: true,
      note:
        "For Nepal–India routes, passport is accepted. Eligible Nepalese or Indian travellers may use applicable citizenship or Aadhaar documentation where accepted. Eligibility depends on nationality, traveller category, airline policy, and current entry requirements.",
    };
  }
  return {
    allowed: ["passport"],
    requiresPassportUpload: true,
    citizenshipAllowed: false,
    aadhaarAllowed: false,
    note:
      "For all other international routes, passport details and a passport document upload are required in this form.",
  };
}

export function isEligibleForAlternative(doc: DocumentOption, nationality: string, policy: RouteDocumentPolicy): boolean {
  if (doc === "passport") return true;
  if (doc === "citizenship") {
    // Nepalese nationals on eligible routes
    return policy.citizenshipAllowed && nationality.toLowerCase().includes("nepal");
  }
  if (doc === "aadhaar") {
    return policy.aadhaarAllowed && nationality.toLowerCase().includes("india");
  }
  return false;
}




