/**
 * LIONGATEOS TRAVELS — DATA TYPES
 * 
 * Type definitions for Hotels, Cars, Activities
 * Provider-agnostic structures
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface Price {
  amount: number;
  currency: string;
  perNight?: boolean;
  perDay?: boolean;
}

export interface Location {
  address?: string;
  city?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Image {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

// ============================================================================
// SEARCH PARAMETERS
// ============================================================================

export interface LocationParam {
  destination: string;
}

export interface CoordinatesParam {
  lat: number;
  lng: number;
}

export type SearchLocation = LocationParam | CoordinatesParam;

export interface HotelSearchParams {
  location: SearchLocation;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: {
    adults: number;
    children?: number;
    rooms?: number;
  };
  currency?: string;
  maxPrice?: number;
}

export interface CarSearchParams {
  location: SearchLocation;
  pickupDate: string; // YYYY-MM-DD
  pickupTime?: string; // HH:MM
  dropoffDate: string; // YYYY-MM-DD
  dropoffTime?: string; // HH:MM
  currency?: string;
}

export interface ActivitySearchParams {
  location: SearchLocation;
  date?: string; // YYYY-MM-DD
  category?: string;
  currency?: string;
  maxPrice?: number;
}

// ============================================================================
// HOTELS
// ============================================================================

export interface Hotel {
  id: string;
  provider: 'expedia' | 'booking' | 'mock';
  name: string;
  location: Location;
  price: Price;
  rating?: number;
  reviewCount?: number;
  images: string[];
  amenities: string[];
  description: string;
  rooms: HotelRoom[];
  affiliateUrl: string;
}

export interface HotelRoom {
  id: string;
  name: string;
  capacity: number;
  beds: string[];
  price: Price;
  amenities: string[];
}

// ============================================================================
// CARS
// ============================================================================

export interface CarRental {
  id: string;
  provider: 'expedia' | 'mock';
  vendor: string;
  category: string;
  vehicle: {
    make?: string;
    model?: string;
    year?: number;
    type: string;
    transmission: string;
    fuelType: string;
    passengers: number;
    luggage: number;
    doors: number;
  };
  price: Price;
  location: {
    pickup: string;
    dropoff: string;
  };
  images: string[];
  features: string[];
  mileage: string;
  affiliateUrl: string;
}

// ============================================================================
// ACTIVITIES
// ============================================================================

export interface Activity {
  id: string;
  provider: 'expedia' | 'viator' | 'mock';
  name: string;
  category: string;
  description: string;
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  duration: number; // minutes
  price: Price;
  rating?: number;
  reviewCount?: number;
  images: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  cancellationPolicy: string;
  affiliateUrl: string;
}

// ============================================================================
// SEARCH RESULTS
// ============================================================================

export interface SearchResults<T> {
  results: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
