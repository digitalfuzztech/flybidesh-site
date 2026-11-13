export type CabinClass = "economy" | "premium_economy" | "business" | "first";

export type TripType = "one-way" | "round-trip" | "multi-city";

export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
  countryCode: string;
}

export interface SearchCriteria {
  tripType: TripType;
  origin: string; // airport code
  destination: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabin: CabinClass;
}

export interface FlightSegment {
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string; // ISO
  arrivalTime: string; // ISO
  durationMinutes: number;
}

export interface FlightItinerary {
  id: string;
  source: "demo" | "live";
  price: number;
  currency: string;
  segments: FlightSegment[];
  stops: number;
  totalDurationMinutes: number;
  baggage?: string;
  fareType?: string;
  lastUpdated?: string;
}

export interface BookingPassenger {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  gender?: "male" | "female" | "other" | "prefer_not";
  documentType: "passport" | "citizenship" | "aadhaar";
  documentNumber: string;
  issueDate?: string;
  expiryDate?: string;
  documentFile?: File | null;
}

export interface ContactDetails {
  fullName: string;
  callingCode: string;
  whatsapp: string;
  email: string;
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
}

export interface BookingRequestPayload {
  itineraryId: string;
  search: SearchCriteria;
  passengers: BookingPassenger[];
  contact: ContactDetails;
  consents: {
    notConfirmed: boolean;
    fareVerification: boolean;
    contactUse: boolean;
    documentProcessing: boolean;
  };
  demoMode: boolean;
}

export interface BookingRequestResponse {
  reference: string;
  status: "received" | "error";
  message: string;
  demo: boolean;
}




