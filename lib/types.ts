// Autocomplete types
export interface Prediction {
  description: string;
  place_id: string;
}

export interface AutocompleteResponse {
  predictions: Prediction[];
  status: string;
}

export interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// API Response types
export interface ApiSchool {
  name: string;
  rating?: number;
  level: string;
  type: string;
  distance: number;
}

export interface ApiAddress {
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface ApiNearbyHome {
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  livingArea?: number;
  livingAreaValue?: number;
  homeType: string;
  address: ApiAddress;
}

export interface ApiResoFacts {
  highSchoolDistrict?: string;
  middleOrJuniorSchoolDistrict?: string;
  elementarySchoolDistrict?: string;
}

export interface ApiResponse {
  latitude: number;
  longitude: number;
  schools: ApiSchool[];
  nearbyHomes: ApiNearbyHome[];
  resoFacts?: ApiResoFacts;
}

// School types
export interface School {
  name: string;
  type: "Elementary" | "Middle" | "High" | "Private";
  distance: string;
  rating?: number;
  address: string;
}

export interface SchoolsListProps {
  schoolDistrict: string;
  schools: School[];
}

// Comparable Homes types
export interface ComparableHome {
  address: string;
  price: number;
  sqft: number;
  beds: number;
  baths: number;
  pricePerSqft: number;
}

export interface ComparableHomesProps {
  homes: ComparableHome[];
}

// Neighborhood Pricing types
export type PricingClassification = "Cheap" | "Moderate" | "Expensive";

export interface NeighborhoodPricingProps {
  averagePricePerSqft: number;
  classification: PricingClassification;
}

// Neighborhood Data types
export interface NeighborhoodData {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  schoolDistrict: string;
  schools: School[];
  comparableHomes: ComparableHome[];
  pricing: {
    averagePricePerSqft: number;
    classification: PricingClassification;
  };
}
