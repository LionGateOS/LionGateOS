/**
 * EXPEDIA RAPID API PROVIDER
 * 
 * Direct integration with Expedia Rapid APIs:
 * - Lodging (Hotels)
 * - Cars (Rental)
 * - Activities / Experiences
 * 
 * Server-side keys only. NO Travel Shops. NO widgets.
 * Read-only, affiliate handoff for booking.
 */

import { 
  Hotel, 
  HotelSearchParams, 
  CarRental, 
  CarSearchParams, 
  Activity, 
  ActivitySearchParams 
} from '../types';

const EXPEDIA_API_BASE = 'https://api.expediapartnersolutions.com';
const RAPID_API_VERSION = 'v3';

/**
 * Expedia Rapid API Configuration
 * Keys should be provided by environment/Core
 */
interface ExpediaConfig {
  apiKey: string;
  apiSecret: string;
  affiliateId?: string;
}

let config: ExpediaConfig | null = null;

export function configureExpedia(cfg: ExpediaConfig) {
  config = cfg;
}

/**
 * Get auth headers for Expedia Rapid API
 */
function getAuthHeaders(): Record<string, string> {
  if (!config) {
    throw new Error('Expedia API not configured');
  }
  
  return {
    'Authorization': `Bearer ${config.apiKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

// ============================================================================
// HOTELS / LODGING
// ============================================================================

/**
 * Search hotels using Expedia Rapid API
 * Endpoint: /properties/availability
 */
export async function searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
  try {
    const queryParams = new URLSearchParams({
      checkin: params.checkIn,
      checkout: params.checkOut,
      adults: params.guests.adults.toString(),
      ...(params.guests.children && { children: params.guests.children.toString() }),
      ...(params.guests.rooms && { rooms: params.guests.rooms.toString() }),
      currency: params.currency || 'USD',
      language: 'en-US',
      sort: 'recommended',
    });
    
    // Add location parameter
    if ('destination' in params.location) {
      queryParams.append('destination', params.location.destination);
    } else if ('lat' in params.location && 'lng' in params.location) {
      queryParams.append('latitude', params.location.lat.toString());
      queryParams.append('longitude', params.location.lng.toString());
      queryParams.append('radius', '25');
      queryParams.append('radius_unit', 'km');
    }
    
    const url = `${EXPEDIA_API_BASE}/${RAPID_API_VERSION}/properties/availability?${queryParams}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Expedia API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return transformExpediaHotels(data);
  } catch (error) {
    console.error('Hotel search failed:', error);
    return getMockHotels(params); // Fallback to mock
  }
}

/**
 * Get hotel details and room rates
 * Endpoint: /properties/{propertyId}
 */
export async function getHotelDetails(propertyId: string, params: HotelSearchParams): Promise<Hotel> {
  try {
    const queryParams = new URLSearchParams({
      checkin: params.checkIn,
      checkout: params.checkOut,
      adults: params.guests.adults.toString(),
      currency: params.currency || 'USD',
      language: 'en-US',
    });
    
    const url = `${EXPEDIA_API_BASE}/${RAPID_API_VERSION}/properties/${propertyId}?${queryParams}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Expedia API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return transformExpediaHotel(data);
  } catch (error) {
    console.error('Hotel details failed:', error);
    throw error;
  }
}

/**
 * Transform Expedia API response to our Hotel type
 */
function transformExpediaHotels(data: any): Hotel[] {
  if (!data?.properties) return [];
  
  return data.properties.map((prop: any) => transformExpediaHotel(prop));
}

function transformExpediaHotel(prop: any): Hotel {
  const room = prop.rooms?.[0] || {};
  const rate = room.rates?.[0] || {};
  
  return {
    id: prop.property_id || prop.id,
    name: prop.name || 'Hotel',
    provider: 'expedia',
    location: {
      address: prop.address?.line_1 || '',
      city: prop.address?.city || '',
      country: prop.address?.country_code || '',
      coordinates: prop.location ? {
        lat: prop.location.latitude,
        lng: prop.location.longitude,
      } : undefined,
    },
    price: {
      amount: rate.price?.amount || 0,
      currency: rate.price?.currency || 'USD',
      perNight: true,
    },
    rating: prop.star_rating || prop.guest_rating?.overall || 0,
    reviewCount: prop.review_count || 0,
    images: prop.images?.map((img: any) => img.url) || [],
    amenities: prop.amenities?.map((a: any) => a.name) || [],
    description: prop.description || '',
    rooms: prop.rooms?.map((r: any) => ({
      id: r.id,
      name: r.name,
      capacity: r.occupancy?.max_allowed || 2,
      beds: r.bed_groups?.map((bg: any) => bg.description) || [],
      price: {
        amount: r.rates?.[0]?.price?.amount || 0,
        currency: r.rates?.[0]?.price?.currency || 'USD',
      },
      amenities: r.amenities || [],
    })) || [],
    affiliateUrl: generateExpediaAffiliateUrl('hotel', prop.property_id || prop.id),
  };
}

// ============================================================================
// CARS / RENTAL
// ============================================================================

/**
 * Search car rentals using Expedia Rapid API
 * Endpoint: /cars/availability
 */
export async function searchCars(params: CarSearchParams): Promise<CarRental[]> {
  try {
    const queryParams = new URLSearchParams({
      pickup_date: params.pickupDate,
      pickup_time: params.pickupTime || '10:00',
      dropoff_date: params.dropoffDate,
      dropoff_time: params.dropoffTime || '10:00',
      currency: params.currency || 'USD',
      language: 'en-US',
    });
    
    // Add location parameters
    if ('destination' in params.location) {
      queryParams.append('pickup_location', params.location.destination);
      queryParams.append('dropoff_location', params.location.destination);
    } else if ('lat' in params.location && 'lng' in params.location) {
      queryParams.append('pickup_latitude', params.location.lat.toString());
      queryParams.append('pickup_longitude', params.location.lng.toString());
      queryParams.append('dropoff_latitude', params.location.lat.toString());
      queryParams.append('dropoff_longitude', params.location.lng.toString());
    }
    
    const url = `${EXPEDIA_API_BASE}/${RAPID_API_VERSION}/cars/availability?${queryParams}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Expedia API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return transformExpediaCars(data);
  } catch (error) {
    console.error('Car search failed:', error);
    return getMockCars(params); // Fallback to mock
  }
}

/**
 * Transform Expedia car API response
 */
function transformExpediaCars(data: any): CarRental[] {
  if (!data?.vehicles) return [];
  
  return data.vehicles.map((vehicle: any) => ({
    id: vehicle.vehicle_id || vehicle.id,
    provider: 'expedia',
    vendor: vehicle.vendor?.name || 'Car Rental',
    category: vehicle.category || 'Standard',
    vehicle: {
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year,
      type: vehicle.vehicle_type || 'Car',
      transmission: vehicle.transmission_type || 'Automatic',
      fuelType: vehicle.fuel_type || 'Gasoline',
      passengers: vehicle.passenger_capacity || 5,
      luggage: vehicle.luggage_capacity || 2,
      doors: vehicle.door_count || 4,
    },
    price: {
      amount: vehicle.rate?.total_amount || 0,
      currency: vehicle.rate?.currency || 'USD',
      perDay: false,
    },
    location: {
      pickup: vehicle.pickup_location?.address || '',
      dropoff: vehicle.dropoff_location?.address || '',
    },
    images: vehicle.images?.map((img: any) => img.url) || [],
    features: vehicle.features || [],
    mileage: vehicle.mileage_policy || 'Unlimited',
    affiliateUrl: generateExpediaAffiliateUrl('car', vehicle.vehicle_id || vehicle.id),
  }));
}

// ============================================================================
// ACTIVITIES / EXPERIENCES
// ============================================================================

/**
 * Search activities using Expedia Rapid API
 * Endpoint: /activities/search
 */
export async function searchActivities(params: ActivitySearchParams): Promise<Activity[]> {
  try {
    const queryParams = new URLSearchParams({
      start_date: params.date || new Date().toISOString().split('T')[0],
      currency: params.currency || 'USD',
      language: 'en-US',
    });
    
    // Add location parameters
    if ('destination' in params.location) {
      queryParams.append('destination', params.location.destination);
    } else if ('lat' in params.location && 'lng' in params.location) {
      queryParams.append('latitude', params.location.lat.toString());
      queryParams.append('longitude', params.location.lng.toString());
      queryParams.append('radius', '50');
      queryParams.append('radius_unit', 'km');
    }
    
    if (params.category) {
      queryParams.append('category', params.category);
    }
    
    const url = `${EXPEDIA_API_BASE}/${RAPID_API_VERSION}/activities/search?${queryParams}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Expedia API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return transformExpediaActivities(data);
  } catch (error) {
    console.error('Activity search failed:', error);
    return getMockActivities(params); // Fallback to mock
  }
}

/**
 * Transform Expedia activities API response
 */
function transformExpediaActivities(data: any): Activity[] {
  if (!data?.activities) return [];
  
  return data.activities.map((activity: any) => ({
    id: activity.activity_id || activity.id,
    provider: 'expedia',
    name: activity.title || 'Activity',
    category: activity.category || 'Experience',
    description: activity.description || '',
    location: {
      name: activity.location?.name || '',
      address: activity.location?.address || '',
      coordinates: activity.location?.coordinates ? {
        lat: activity.location.coordinates.latitude,
        lng: activity.location.coordinates.longitude,
      } : undefined,
    },
    duration: activity.duration_minutes || 120,
    price: {
      amount: activity.price?.amount || 0,
      currency: activity.price?.currency || 'USD',
    },
    rating: activity.rating || 0,
    reviewCount: activity.review_count || 0,
    images: activity.images?.map((img: any) => img.url) || [],
    highlights: activity.highlights || [],
    included: activity.included || [],
    excluded: activity.excluded || [],
    cancellationPolicy: activity.cancellation_policy || 'Standard',
    affiliateUrl: generateExpediaAffiliateUrl('activity', activity.activity_id || activity.id),
  }));
}

// ============================================================================
// AFFILIATE URL GENERATION
// ============================================================================

/**
 * Generate Expedia affiliate URL for booking handoff
 */
function generateExpediaAffiliateUrl(type: 'hotel' | 'car' | 'activity', id: string): string {
  const baseUrl = 'https://www.expedia.com';
  const affiliateId = config?.affiliateId || 'liongateos';
  
  switch (type) {
    case 'hotel':
      return `${baseUrl}/Hotel-Search?hotelId=${id}&affid=${affiliateId}`;
    case 'car':
      return `${baseUrl}/Cars?vehicleId=${id}&affid=${affiliateId}`;
    case 'activity':
      return `${baseUrl}/Things-To-Do?activityId=${id}&affid=${affiliateId}`;
    default:
      return baseUrl;
  }
}

// ============================================================================
// MOCK DATA FALLBACKS (when API keys not configured)
// ============================================================================

function getMockHotels(params: HotelSearchParams): Hotel[] {
  const destination = 'destination' in params.location ? params.location.destination : 'Global';
  
  return [
    {
      id: 'mock-hotel-1',
      name: `Grand Hotel ${destination}`,
      provider: 'expedia',
      location: {
        address: '123 Main Street',
        city: destination,
        country: 'Worldwide',
      },
      price: {
        amount: 150,
        currency: 'USD',
        perNight: true,
      },
      rating: 4.5,
      reviewCount: 1234,
      images: ['/placeholder-hotel-1.jpg'],
      amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
      description: 'Luxury hotel in the heart of the city',
      rooms: [],
      affiliateUrl: '#',
    },
    {
      id: 'mock-hotel-2',
      name: `City Center Inn ${destination}`,
      provider: 'expedia',
      location: {
        address: '456 Downtown Ave',
        city: destination,
        country: 'Worldwide',
      },
      price: {
        amount: 89,
        currency: 'USD',
        perNight: true,
      },
      rating: 4.0,
      reviewCount: 856,
      images: ['/placeholder-hotel-2.jpg'],
      amenities: ['WiFi', 'Parking', 'Breakfast'],
      description: 'Comfortable stay near major attractions',
      rooms: [],
      affiliateUrl: '#',
    },
  ];
}

function getMockCars(params: CarSearchParams): CarRental[] {
  return [
    {
      id: 'mock-car-1',
      provider: 'expedia',
      vendor: 'Enterprise',
      category: 'Economy',
      vehicle: {
        make: 'Toyota',
        model: 'Corolla',
        type: 'Sedan',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        passengers: 5,
        luggage: 2,
        doors: 4,
      },
      price: {
        amount: 45,
        currency: 'USD',
        perDay: false,
      },
      location: {
        pickup: 'Airport Terminal',
        dropoff: 'Airport Terminal',
      },
      images: [],
      features: ['Air Conditioning', 'GPS'],
      mileage: 'Unlimited',
      affiliateUrl: '#',
    },
  ];
}

function getMockActivities(params: ActivitySearchParams): Activity[] {
  const destination = 'destination' in params.location ? params.location.destination : 'City';
  
  return [
    {
      id: 'mock-activity-1',
      provider: 'expedia',
      name: `${destination} City Tour`,
      category: 'Tours',
      description: 'Explore the best of the city with a guided tour',
      location: {
        name: destination,
        address: 'City Center',
      },
      duration: 180,
      price: {
        amount: 65,
        currency: 'USD',
      },
      rating: 4.7,
      reviewCount: 543,
      images: [],
      highlights: ['Expert Guide', 'Major Landmarks', 'Small Group'],
      included: ['Transportation', 'Guide'],
      excluded: ['Meals', 'Entrance Fees'],
      cancellationPolicy: 'Free cancellation up to 24 hours',
      affiliateUrl: '#',
    },
  ];
}
