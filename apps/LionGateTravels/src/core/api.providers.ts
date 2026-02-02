/**
 * API PROVIDER ABSTRACTION LAYER
 * 
 * Provider-agnostic interfaces for travel services.
 * LionGateOS Core can swap providers without changing Travels code.
 * 
 * NO hardcoded provider API keys.
 * NO direct provider calls.
 * 
 * Governance: LIONGATEOS_API_BOUNDARY_DEFINITIONS_FINAL.md
 */

// ============================================================================
// PLACES / GEOCODING API
// ============================================================================

export interface PlacesProvider {
  name: 'google-places' | 'mapbox' | 'openstreetmap';
  
  /**
   * Search for places by query
   */
  searchPlaces(query: string, options?: PlacesSearchOptions): Promise<Place[]>;
  
  /**
   * Get place details by ID
   */
  getPlaceDetails(placeId: string): Promise<PlaceDetails>;
  
  /**
   * Geocode an address
   */
  geocode(address: string): Promise<GeoLocation>;
  
  /**
   * Reverse geocode coordinates
   */
  reverseGeocode(lat: number, lng: number): Promise<string>;
}

export interface PlacesSearchOptions {
  type?: 'city' | 'country' | 'airport' | 'poi';
  limit?: number;
  language?: string;
  biasLocation?: GeoLocation;
}

export interface Place {
  id: string;
  name: string;
  type: string;
  location: GeoLocation;
  address?: string;
  timezone?: string;
}

export interface PlaceDetails extends Place {
  description?: string;
  photos?: string[];
  rating?: number;
  reviews?: number;
  openingHours?: string[];
  website?: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

// ============================================================================
// FLIGHTS API
// ============================================================================

export interface FlightsProvider {
  name: 'amadeus' | 'skyscanner' | 'mock';
  
  /**
   * Search for flights
   * Returns data ONLY - no booking capability
   */
  searchFlights(query: FlightSearchQuery): Promise<FlightResult[]>;
  
  /**
   * Get affiliate link for booking
   * Handled by Core, never by Travels
   */
  getAffiliateLink?(flightId: string): Promise<string>;
}

export interface FlightSearchQuery {
  origin: string; // IATA code
  destination: string;
  departDate: string; // YYYY-MM-DD
  returnDate?: string;
  passengers: {
    adults: number;
    children?: number;
    infants?: number;
  };
  cabinClass?: 'economy' | 'premium' | 'business' | 'first';
  maxStops?: number;
}

export interface FlightResult {
  id: string;
  price: {
    amount: number;
    currency: string;
  };
  outbound: FlightSegment[];
  return?: FlightSegment[];
  duration: {
    outbound: number; // minutes
    return?: number;
  };
  stops: number;
  airlines: string[];
  
  // NO recommendation fields allowed
  // Travels presents data neutrally
}

export interface FlightSegment {
  departure: {
    airport: string;
    time: string;
    terminal?: string;
  };
  arrival: {
    airport: string;
    time: string;
    terminal?: string;
  };
  airline: string;
  flightNumber: string;
  duration: number;
  aircraft?: string;
}

// ============================================================================
// HOTELS API
// ============================================================================

export interface HotelsProvider {
  name: 'booking.com' | 'expedia' | 'mock';
  
  /**
   * Search for hotels
   * Returns data ONLY - no booking capability
   */
  searchHotels(query: HotelSearchQuery): Promise<HotelResult[]>;
  
  /**
   * Get hotel details
   */
  getHotelDetails(hotelId: string): Promise<HotelDetails>;
  
  /**
   * Get affiliate link for booking
   * Handled by Core, never by Travels
   */
  getAffiliateLink?(hotelId: string, params: HotelSearchQuery): Promise<string>;
}

export interface HotelSearchQuery {
  location: string | GeoLocation;
  checkIn: string; // YYYY-MM-DD
  checkOut: string;
  guests: {
    adults: number;
    children?: number;
    rooms?: number;
  };
  maxPrice?: number;
  currency?: string;
}

export interface HotelResult {
  id: string;
  name: string;
  location: {
    address: string;
    coordinates: GeoLocation;
  };
  price: {
    amount: number;
    currency: string;
    perNight: boolean;
  };
  rating?: number;
  reviews?: number;
  amenities: string[];
  photos?: string[];
  
  // NO recommendation fields allowed
}

export interface HotelDetails extends HotelResult {
  description: string;
  rooms: HotelRoom[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation?: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface HotelRoom {
  id: string;
  name: string;
  capacity: number;
  beds: string[];
  price: {
    amount: number;
    currency: string;
  };
  amenities: string[];
}

// ============================================================================
// EXPERIENCES API
// ============================================================================

export interface ExperiencesProvider {
  name: 'viator' | 'getyourguide' | 'mock';
  
  /**
   * Search for experiences/tours
   */
  searchExperiences(query: ExperienceSearchQuery): Promise<Experience[]>;
  
  /**
   * Get experience details
   */
  getExperienceDetails(experienceId: string): Promise<ExperienceDetails>;
}

export interface ExperienceSearchQuery {
  location: string | GeoLocation;
  category?: 'tours' | 'activities' | 'food' | 'culture' | 'adventure';
  date?: string;
  maxPrice?: number;
  currency?: string;
}

export interface Experience {
  id: string;
  name: string;
  category: string;
  location: string;
  duration: number; // minutes
  price: {
    amount: number;
    currency: string;
  };
  rating?: number;
  reviews?: number;
  photos?: string[];
}

export interface ExperienceDetails extends Experience {
  description: string;
  included: string[];
  excluded: string[];
  meetingPoint: string;
  cancellationPolicy: string;
  availability: ExperienceAvailability[];
}

export interface ExperienceAvailability {
  date: string;
  times: string[];
  available: boolean;
}

// ============================================================================
// WEATHER API
// ============================================================================

export interface WeatherProvider {
  name: 'openweather' | 'weatherapi' | 'mock';
  
  /**
   * Get current weather
   */
  getCurrentWeather(location: string | GeoLocation): Promise<Weather>;
  
  /**
   * Get forecast
   */
  getForecast(location: string | GeoLocation, days: number): Promise<WeatherForecast>;
}

export interface Weather {
  temperature: number; // Celsius
  feelsLike: number;
  humidity: number; // percentage
  description: string;
  icon: string;
  windSpeed: number; // km/h
  precipitation?: number; // mm
}

export interface WeatherForecast {
  location: string;
  days: WeatherDay[];
}

export interface WeatherDay {
  date: string;
  high: number;
  low: number;
  description: string;
  icon: string;
  precipitation: number;
  humidity: number;
}

// ============================================================================
// PROVIDER REGISTRY
// ============================================================================

/**
 * Registry of available providers
 * Managed by LionGateOS Core
 */
export interface ProviderRegistry {
  places: PlacesProvider;
  flights: FlightsProvider;
  hotels: HotelsProvider;
  experiences: ExperiencesProvider;
  weather: WeatherProvider;
}

/**
 * Get current provider configuration
 * Returns providers configured by Core
 */
export const getProviderRegistry = (): ProviderRegistry => {
  // This would be injected by Core in production
  // For now, return mock providers
  return {
    places: createMockPlacesProvider(),
    flights: createMockFlightsProvider(),
    hotels: createMockHotelsProvider(),
    experiences: createMockExperiencesProvider(),
    weather: createMockWeatherProvider(),
  };
};

// ============================================================================
// MOCK PROVIDERS (for development)
// ============================================================================

const createMockPlacesProvider = (): PlacesProvider => ({
  name: 'openstreetmap',
  async searchPlaces(query: string) {
    return [
      {
        id: 'mock-1',
        name: query,
        type: 'city',
        location: { lat: 0, lng: 0 },
      },
    ];
  },
  async getPlaceDetails(placeId: string) {
    return {
      id: placeId,
      name: 'Mock Place',
      type: 'city',
      location: { lat: 0, lng: 0 },
    };
  },
  async geocode(address: string) {
    return { lat: 0, lng: 0 };
  },
  async reverseGeocode(lat: number, lng: number) {
    return `${lat}, ${lng}`;
  },
});

const createMockFlightsProvider = (): FlightsProvider => ({
  name: 'mock',
  async searchFlights(query: FlightSearchQuery) {
    return [];
  },
});

const createMockHotelsProvider = (): HotelsProvider => ({
  name: 'mock',
  async searchHotels(query: HotelSearchQuery) {
    return [];
  },
  async getHotelDetails(hotelId: string) {
    return {
      id: hotelId,
      name: 'Mock Hotel',
      location: {
        address: '123 Mock St',
        coordinates: { lat: 0, lng: 0 },
      },
      price: {
        amount: 100,
        currency: 'USD',
        perNight: true,
      },
      amenities: [],
      description: 'Mock hotel description',
      rooms: [],
      policies: {
        checkIn: '15:00',
        checkOut: '11:00',
      },
      contact: {},
    };
  },
});

const createMockExperiencesProvider = (): ExperiencesProvider => ({
  name: 'mock',
  async searchExperiences(query: ExperienceSearchQuery) {
    return [];
  },
  async getExperienceDetails(experienceId: string) {
    return {
      id: experienceId,
      name: 'Mock Experience',
      category: 'tours',
      location: 'Mock Location',
      duration: 120,
      price: {
        amount: 50,
        currency: 'USD',
      },
      description: 'Mock experience description',
      included: [],
      excluded: [],
      meetingPoint: 'Mock meeting point',
      cancellationPolicy: 'Mock policy',
      availability: [],
    };
  },
});

const createMockWeatherProvider = (): WeatherProvider => ({
  name: 'mock',
  async getCurrentWeather(location: string | GeoLocation) {
    return {
      temperature: 20,
      feelsLike: 20,
      humidity: 50,
      description: 'Clear',
      icon: 'sun',
      windSpeed: 10,
    };
  },
  async getForecast(location: string | GeoLocation, days: number) {
    return {
      location: typeof location === 'string' ? location : 'Unknown',
      days: Array(days).fill(null).map((_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        high: 25,
        low: 15,
        description: 'Partly cloudy',
        icon: 'cloud',
        precipitation: 0,
        humidity: 60,
      })),
    };
  },
});
