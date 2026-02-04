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
/**
 * Get current provider configuration
 * Returns providers configured by Core
 */
export const getProviderRegistry = () => {
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
const createMockPlacesProvider = () => ({
    name: 'openstreetmap',
    async searchPlaces(query) {
        return [
            {
                id: 'mock-1',
                name: query,
                type: 'city',
                location: { lat: 0, lng: 0 },
            },
        ];
    },
    async getPlaceDetails(placeId) {
        return {
            id: placeId,
            name: 'Mock Place',
            type: 'city',
            location: { lat: 0, lng: 0 },
        };
    },
    async geocode(address) {
        return { lat: 0, lng: 0 };
    },
    async reverseGeocode(lat, lng) {
        return `${lat}, ${lng}`;
    },
});
const createMockFlightsProvider = () => ({
    name: 'mock',
    async searchFlights(query) {
        return [];
    },
});
const createMockHotelsProvider = () => ({
    name: 'mock',
    async searchHotels(query) {
        return [];
    },
    async getHotelDetails(hotelId) {
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
const createMockExperiencesProvider = () => ({
    name: 'mock',
    async searchExperiences(query) {
        return [];
    },
    async getExperienceDetails(experienceId) {
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
const createMockWeatherProvider = () => ({
    name: 'mock',
    async getCurrentWeather(location) {
        return {
            temperature: 20,
            feelsLike: 20,
            humidity: 50,
            description: 'Clear',
            icon: 'sun',
            windSpeed: 10,
        };
    },
    async getForecast(location, days) {
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
