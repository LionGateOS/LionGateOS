export interface HotelData {
  hotel_id: string;
  property_metadata: {
    name: string;
    address: string;
    rating: number;
    reviews: number;
    images: string[];
    amenities: string[];
    neighborhood: string;
  };
  room_inventory: {
    type: string;
    count: number;
    price_per_night: number;
  }[];
  dynamic_pricing_index: number;
  geospatial_coordinates: {
    lat: number;
    lng: number;
  };
  safety_score: number;
}

export const MOCK_HOTELS: HotelData[] = [
  {
    hotel_id: 'HTL-001',
    property_metadata: {
      name: 'LionGate Grand Plaza',
      address: '123 Downtown Ave',
      rating: 4.8,
      reviews: 1200,
      images: [],
      amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
      neighborhood: 'Downtown'
    },
    room_inventory: [{ type: 'Standard', count: 10, price_per_night: 120 }],
    dynamic_pricing_index: 1.0,
    geospatial_coordinates: { lat: 0, lng: 0 },
    safety_score: 9
  },
  {
    hotel_id: 'HTL-002',
    property_metadata: {
      name: 'Sunset Retreat',
      address: '456 Beach Way',
      rating: 4.5,
      reviews: 850,
      images: [],
      amenities: ['WiFi', 'Beach'],
      neighborhood: 'Beachfront'
    },
    room_inventory: [{ type: 'Deluxe', count: 5, price_per_night: 350 }],
    dynamic_pricing_index: 1.0,
    geospatial_coordinates: { lat: 0, lng: 0 },
    safety_score: 7
  },
  {
    hotel_id: 'HTL-003',
    property_metadata: {
      name: 'Urban Neo-Hub',
      address: '789 Historic Lane',
      rating: 4.2,
      reviews: 600,
      images: [],
      amenities: ['Bar'],
      neighborhood: 'Historic'
    },
    room_inventory: [{ type: 'Studio', count: 15, price_per_night: 85 }],
    dynamic_pricing_index: 1.0,
    geospatial_coordinates: { lat: 0, lng: 0 },
    safety_score: 6
  },
  {
    hotel_id: 'HTL-004',
    property_metadata: {
      name: 'SafeHaven Suites',
      address: '101 Business District',
      rating: 4.9,
      reviews: 2000,
      images: [],
      amenities: ['WiFi', 'Pool', 'Gym', 'Business Center'],
      neighborhood: 'Business'
    },
    room_inventory: [{ type: 'Executive', count: 8, price_per_night: 500 }],
    dynamic_pricing_index: 1.0,
    geospatial_coordinates: { lat: 0, lng: 0 },
    safety_score: 10
  },
  {
    hotel_id: 'HTL-005',
    property_metadata: {
      name: 'The Budget Base',
      address: '202 Airport Road',
      rating: 3.8,
      reviews: 400,
      images: [],
      amenities: ['WiFi', 'Shuttle'],
      neighborhood: 'Airport'
    },
    room_inventory: [{ type: 'Basic', count: 25, price_per_night: 65 }],
    dynamic_pricing_index: 1.0,
    geospatial_coordinates: { lat: 0, lng: 0 },
    safety_score: 4
  }
];