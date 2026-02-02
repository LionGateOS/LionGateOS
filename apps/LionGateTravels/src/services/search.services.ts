/**
 * SEARCH SERVICES
 * 
 * Unified search interfaces for Hotels, Cars, Activities
 * Provider-agnostic with Expedia as first provider
 */

import {
  Hotel,
  HotelSearchParams,
  CarRental,
  CarSearchParams,
  Activity,
  ActivitySearchParams,
} from '../types';

import * as ExpediaAPI from '../providers/expedia/expedia.api';

// ============================================================================
// HOTEL SEARCH SERVICE
// ============================================================================

export class HotelSearchService {
  /**
   * Search hotels worldwide
   */
  static async search(params: HotelSearchParams): Promise<Hotel[]> {
    // Currently uses Expedia as primary provider
    // Can add fallback providers or parallel searches later
    return ExpediaAPI.searchHotels(params);
  }
  
  /**
   * Get hotel details with room availability
   */
  static async getDetails(hotelId: string, params: HotelSearchParams): Promise<Hotel> {
    return ExpediaAPI.getHotelDetails(hotelId, params);
  }
}

// ============================================================================
// CAR SEARCH SERVICE
// ============================================================================

export class CarSearchService {
  /**
   * Search car rentals worldwide
   */
  static async search(params: CarSearchParams): Promise<CarRental[]> {
    // Currently uses Expedia as primary provider
    return ExpediaAPI.searchCars(params);
  }
}

// ============================================================================
// ACTIVITY SEARCH SERVICE
// ============================================================================

export class ActivitySearchService {
  /**
   * Search activities/experiences worldwide
   */
  static async search(params: ActivitySearchParams): Promise<Activity[]> {
    // Currently uses Expedia as primary provider
    return ExpediaAPI.searchActivities(params);
  }
}

// ============================================================================
// UNIFIED SEARCH SERVICE
// ============================================================================

/**
 * Combined search across all travel components
 */
export class UnifiedSearchService {
  /**
   * Search everything for a destination
   */
  static async searchAll(params: {
    location: HotelSearchParams['location'];
    checkIn: string;
    checkOut: string;
    guests: { adults: number; children?: number };
    currency?: string;
  }) {
    const [hotels, cars, activities] = await Promise.all([
      HotelSearchService.search({
        location: params.location,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        guests: { ...params.guests, rooms: 1 },
        currency: params.currency,
      }),
      CarSearchService.search({
        location: params.location,
        pickupDate: params.checkIn,
        dropoffDate: params.checkOut,
        currency: params.currency,
      }),
      ActivitySearchService.search({
        location: params.location,
        date: params.checkIn,
        currency: params.currency,
      }),
    ]);
    
    return { hotels, cars, activities };
  }
}
