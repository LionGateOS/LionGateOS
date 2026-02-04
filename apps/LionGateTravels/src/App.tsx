import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plane, Hotel, MapPin, Clock, DollarSign, TrendingDown, 
  Wind, Sun, Cloud, CloudRain, Search, Filter,
  Globe, Shield, Star, Car,
  ArrowRightLeft, X, RefreshCw, Zap, Target, Calendar,
  Droplets, Navigation, Radio, Satellite,
  Compass, Sparkles, Hexagon,
  Check
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Logo from '@/assets/logo.png';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface HotelData {
  hotel_id: string;
  property_metadata: {
    name: string;
    address: string;
    rating: number;
    reviews: number;
    images: string[];
    amenities: string[];
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
}

interface WorldClock {
  city: string;
  timezone: string;
  offset: string;
  weather: {
    temp: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'clear';
    humidity: number;
    wind: number;
  };
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
}

interface FlightRoute {
  from: { lat: number; lng: number; name: string };
  to: { lat: number; lng: number; name: string };
  distance: number;
  duration: string;
  price: number;
}

interface PriceDrop {
  id: string;
  destination: string;
  originalPrice: number;
  newPrice: number;
  discount: number;
  expiresIn: number;
}

// ============================================
// CUSTOM HOOKS
// ============================================

// Magnetic Cursor Hook
const useMagneticCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailIdRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Add trail point
      const newTrail = { x: e.clientX, y: e.clientY, id: trailIdRef.current++ };
      setTrail(prev => [...prev.slice(-8), newTrail]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return { position, isHovering, setIsHovering, trail };
};

// 3D Tilt Hook
const use3DTilt = (maxTilt: number = 15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * maxTilt * -1;
    const tiltY = (x - 0.5) * maxTilt;
    setTransform(`perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`);
  }, [maxTilt]);

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  }, []);

  return { ref, transform, handleMouseMove, handleMouseLeave };
};

// Parallax Hook
const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      setOffset(scrolled * speed * 0.1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offset };
};

// ============================================
// MOCK DATA
// ============================================

const MOCK_HOTELS: HotelData[] = [
  {
    hotel_id: 'HTL-001',
    property_metadata: {
      name: 'Aetheris Grand Tokyo',
      address: '2-1-1 Nihonbashi, Chuo City, Tokyo',
      rating: 4.9,
      reviews: 2847,
      images: [],
      amenities: ['Spa', 'Pool', 'Gym', 'WiFi', 'Bar', 'Restaurant']
    },
    room_inventory: [
      { type: 'Deluxe Suite', count: 12, price_per_night: 450 },
      { type: 'Executive Room', count: 24, price_per_night: 320 },
      { type: 'Standard Room', count: 48, price_per_night: 180 }
    ],
    dynamic_pricing_index: 1.15,
    geospatial_coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    hotel_id: 'HTL-002',
    property_metadata: {
      name: 'Nebula Resort Dubai',
      address: 'Sheikh Zayed Road, Downtown Dubai',
      rating: 4.8,
      reviews: 1923,
      images: [],
      amenities: ['Beach', 'Spa', 'Pool', 'Gym', 'WiFi', 'Club']
    },
    room_inventory: [
      { type: 'Royal Suite', count: 8, price_per_night: 1200 },
      { type: 'Ocean View', count: 32, price_per_night: 580 },
      { type: 'Garden Room', count: 56, price_per_night: 340 }
    ],
    dynamic_pricing_index: 0.95,
    geospatial_coordinates: { lat: 25.2048, lng: 55.2708 }
  },
  {
    hotel_id: 'HTL-003',
    property_metadata: {
      name: 'Cosmos Hotel NYC',
      address: '5th Avenue, Manhattan, New York',
      rating: 4.7,
      reviews: 3156,
      images: [],
      amenities: ['Rooftop', 'Gym', 'WiFi', 'Bar', 'Business Center']
    },
    room_inventory: [
      { type: 'Penthouse', count: 4, price_per_night: 2800 },
      { type: 'City View', count: 40, price_per_night: 520 },
      { type: 'Classic Room', count: 80, price_per_night: 280 }
    ],
    dynamic_pricing_index: 1.35,
    geospatial_coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    hotel_id: 'HTL-004',
    property_metadata: {
      name: 'Stellar Palace London',
      address: 'Kensington Gardens, London SW7',
      rating: 4.9,
      reviews: 1567,
      images: [],
      amenities: ['Spa', 'Pool', 'Gym', 'WiFi', 'Tea Room', 'Garden']
    },
    room_inventory: [
      { type: 'Heritage Suite', count: 10, price_per_night: 890 },
      { type: 'Park View', count: 28, price_per_night: 450 },
      { type: 'Cozy Room', count: 64, price_per_night: 220 }
    ],
    dynamic_pricing_index: 1.08,
    geospatial_coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  {
    hotel_id: 'HTL-005',
    property_metadata: {
      name: 'Quantum Bay Singapore',
      address: 'Marina Bay, Singapore',
      rating: 4.8,
      reviews: 2234,
      images: [],
      amenities: ['Infinity Pool', 'Spa', 'Gym', 'WiFi', 'Sky Bar', 'Casino']
    },
    room_inventory: [
      { type: 'Sky Suite', count: 16, price_per_night: 750 },
      { type: 'Marina View', count: 36, price_per_night: 420 },
      { type: 'Urban Room', count: 72, price_per_night: 240 }
    ],
    dynamic_pricing_index: 1.22,
    geospatial_coordinates: { lat: 1.3521, lng: 103.8198 }
  }
];

const WORLD_CLOCKS: WorldClock[] = [
  { city: 'New York', timezone: 'America/New_York', offset: 'UTC-5', weather: { temp: 18, condition: 'sunny', humidity: 45, wind: 12 } },
  { city: 'London', timezone: 'Europe/London', offset: 'UTC+0', weather: { temp: 14, condition: 'cloudy', humidity: 72, wind: 18 } },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', offset: 'UTC+9', weather: { temp: 22, condition: 'clear', humidity: 58, wind: 8 } },
  { city: 'Dubai', timezone: 'Asia/Dubai', offset: 'UTC+4', weather: { temp: 34, condition: 'sunny', humidity: 35, wind: 15 } },
  { city: 'Singapore', timezone: 'Asia/Singapore', offset: 'UTC+8', weather: { temp: 30, condition: 'rainy', humidity: 85, wind: 10 } }
];

const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 149.50 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 1.53 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', rate: 1.35 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭', rate: 0.88 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', rate: 7.19 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', rate: 7.82 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', rate: 1.64 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', rate: 10.45 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', rate: 1330.0 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', rate: 1.34 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', rate: 10.62 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', rate: 17.05 }
];

const PRICE_DROPS: PriceDrop[] = [
  { id: 'PD-001', destination: 'Tokyo → Bali', originalPrice: 850, newPrice: 520, discount: 39, expiresIn: 124 },
  { id: 'PD-002', destination: 'NYC → Paris', originalPrice: 1200, newPrice: 780, discount: 35, expiresIn: 89 },
  { id: 'PD-003', destination: 'London → Dubai', originalPrice: 950, newPrice: 640, discount: 33, expiresIn: 156 },
  { id: 'PD-004', destination: 'Singapore → Sydney', originalPrice: 720, newPrice: 480, discount: 33, expiresIn: 67 },
  { id: 'PD-005', destination: 'Dubai → Maldives', originalPrice: 1500, newPrice: 980, discount: 35, expiresIn: 203 },
  { id: 'PD-006', destination: 'LA → Tokyo', originalPrice: 1400, newPrice: 890, discount: 36, expiresIn: 145 },
  { id: 'PD-007', destination: 'Paris → Rome', originalPrice: 320, newPrice: 180, discount: 44, expiresIn: 98 },
  { id: 'PD-008', destination: 'Sydney → Auckland', originalPrice: 450, newPrice: 290, discount: 36, expiresIn: 178 }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const getLocalTime = (timezone: string) => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    timeZone: timezone, 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'sunny': return <Sun className="w-5 h-5 text-yellow-400" />;
    case 'cloudy': return <Cloud className="w-5 h-5 text-gray-400" />;
    case 'rainy': return <CloudRain className="w-5 h-5 text-blue-400" />;
    case 'clear': return <Star className="w-5 h-5 text-cyan-400" />;
    default: return <Sun className="w-5 h-5 text-yellow-400" />;
  }
};

// ============================================
// COMPONENTS
// ============================================

// Custom Cursor Component
const CustomCursor: React.FC = () => {
  const { position, trail } = useMagneticCursor();

  return (
    <>
      {/* Cursor Trail */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="cursor-trail"
          style={{
            left: point.x - 4,
            top: point.y - 4,
            opacity: (index + 1) / trail.length * 0.5,
            transform: `scale(${(index + 1) / trail.length})`
          }}
        />
      ))}
      {/* Main Cursor */}
      <div
        className="custom-cursor"
        style={{
          left: position.x - 10,
          top: position.y - 10,
        }}
      />
    </>
  );
};

// 3D Tilt Card Component
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const { ref, transform, handleMouseMove, handleMouseLeave } = use3DTilt(15);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// Magnetic Button Component
const MagneticButton: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'gold' | 'magenta';
}> = ({ children, onClick, className = '', variant = 'primary' }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-500 to-violet-500 hover:shadow-[0_0_30px_rgba(0,245,255,0.4)]',
    secondary: 'bg-white/10 hover:bg-white/20 border border-white/20',
    gold: 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]',
    magenta: 'bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:shadow-[0_0_30px_rgba(255,0,255,0.4)]'
  };

  return (
    <button
      ref={buttonRef}
      className={`magnetic-btn px-6 py-3 rounded-lg font-medium transition-all duration-200 ${variantStyles[variant]} ${className}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ============================================
// MODULE 1: GLOBAL CONNECTIVITY HUB
// ============================================

const GlobalConnectivityHub: React.FC = () => {
  const [currentTimes, setCurrentTimes] = useState<string[]>(
    WORLD_CLOCKS.map(w => getLocalTime(w.timezone))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimes(WORLD_CLOCKS.map(w => getLocalTime(w.timezone)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-xl p-4 neon-border-cyan">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-gradient-cyan">GLOBAL CONNECTIVITY HUB</h3>
        </div>
        <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
          <Radio className="w-3 h-3 mr-1 animate-pulse" />
          LIVE
        </Badge>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {WORLD_CLOCKS.map((clock, index) => (
          <TiltCard key={clock.city} className="glass-card rounded-lg p-3">
            <div className="text-center">
              <div className="text-xs text-white/50 mb-1">{clock.offset}</div>
              <div className="text-2xl font-mono font-bold text-white mb-1">
                {currentTimes[index]}
              </div>
              <div className="text-sm font-medium text-cyan-400 mb-2">{clock.city}</div>
              <div className="flex items-center justify-center gap-2 text-xs">
                {getWeatherIcon(clock.weather.condition)}
                <span className="text-white/70">{clock.weather.temp}°C</span>
              </div>
              <div className="flex items-center justify-center gap-3 mt-2 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  {clock.weather.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3" />
                  {clock.weather.wind}km/h
                </span>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MODULE 2: SEARCH MATRIX
// ============================================

const SearchMatrix: React.FC<{ onFilterChange: (filters: any) => void }> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    priceRange: [100, 2000],
    amenities: {
      wifi: true,
      pool: false,
      spa: false,
      gym: true,
      restaurant: false,
      bar: false
    },
    neighborhoods: {
      downtown: true,
      beachfront: false,
      airport: false,
      historic: true,
      business: false
    },
    safetyScore: 7
  });

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleAmenity = (key: string) => {
    updateFilter('amenities', { ...filters.amenities, [key]: !filters.amenities[key as keyof typeof filters.amenities] });
  };

  const toggleNeighborhood = (key: string) => {
    updateFilter('neighborhoods', { ...filters.neighborhoods, [key]: !filters.neighborhoods[key as keyof typeof filters.neighborhoods] });
  };

  return (
    <div className="glass-panel rounded-xl p-4 neon-border-gold">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-bold text-gradient-gold">SEARCH MATRIX</h3>
        </div>
        <MagneticButton variant="gold" className="text-xs py-1 px-3">
          <Filter className="w-3 h-3 mr-1" />
          Reset
        </MagneticButton>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Price Column */}
        <div className="glass-card rounded-lg p-3">
          <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            PRICE RANGE
          </h4>
          <div className="mb-4">
            <Slider
              value={filters.priceRange}
              min={50}
              max={5000}
              step={50}
              onValueChange={(value) => updateFilter('priceRange', value)}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-white/70">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">23 deals found</span>
          </div>
        </div>

        {/* Amenities Column */}
        <div className="glass-card rounded-lg p-3">
          <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AMENITIES
          </h4>
          <div className="space-y-2">
            {Object.entries(filters.amenities).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs text-white/70 capitalize">{key}</span>
                <div 
                  className={`neon-toggle ${value ? 'active' : ''}`}
                  onClick={() => toggleAmenity(key)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Neighborhood Column */}
        <div className="glass-card rounded-lg p-3">
          <h4 className="text-sm font-semibold text-fuchsia-400 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            NEIGHBORHOOD
          </h4>
          <div className="space-y-2">
            {Object.entries(filters.neighborhoods).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs text-white/70 capitalize">{key}</span>
                <div 
                  className={`neon-toggle ${value ? 'active' : ''}`}
                  onClick={() => toggleNeighborhood(key)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Safety Score Column */}
        <div className="glass-card rounded-lg p-3">
          <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            SAFETY SCORE
          </h4>
          <div className="text-center mb-3">
            <span className="text-4xl font-bold text-emerald-400">{filters.safetyScore}</span>
            <span className="text-white/50">/10</span>
          </div>
          <div className="mb-2">
            <Slider
              value={[filters.safetyScore]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => updateFilter('safetyScore', value[0])}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400">Verified Properties</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MODULE 3: ROUTE VISUALIZER
// ============================================

const RouteVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedRoute, setSelectedRoute] = useState<FlightRoute | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  const routes: FlightRoute[] = [
    { from: { lat: 40.7128, lng: -74.0060, name: 'NYC' }, to: { lat: 51.5074, lng: -0.1278, name: 'London' }, distance: 5585, duration: '7h 30m', price: 780 },
    { from: { lat: 51.5074, lng: -0.1278, name: 'London' }, to: { lat: 25.2048, lng: 55.2708, name: 'Dubai' }, distance: 5470, duration: '6h 50m', price: 640 },
    { from: { lat: 25.2048, lng: 55.2708, name: 'Dubai' }, to: { lat: 1.3521, lng: 103.8198, name: 'Singapore' }, distance: 5845, duration: '7h 15m', price: 520 },
    { from: { lat: 1.3521, lng: 103.8198, name: 'Singapore' }, to: { lat: 35.6762, lng: 139.6503, name: 'Tokyo' }, distance: 5320, duration: '6h 45m', price: 480 },
    { from: { lat: 35.6762, lng: 139.6503, name: 'Tokyo' }, to: { lat: 40.7128, lng: -74.0060, name: 'NYC' }, distance: 10840, duration: '13h 30m', price: 1200 }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw world map outline (simplified)
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.15)';
    ctx.lineWidth = 1;
    
    // Draw grid
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // City positions (normalized to canvas)
    const cities = {
      NYC: { x: width * 0.25, y: height * 0.35 },
      London: { x: width * 0.48, y: height * 0.28 },
      Dubai: { x: width * 0.58, y: height * 0.45 },
      Singapore: { x: width * 0.72, y: height * 0.58 },
      Tokyo: { x: width * 0.85, y: height * 0.38 }
    };

    // Draw city nodes
    Object.entries(cities).forEach(([name, pos]) => {
      // Glow effect
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 20);
      gradient.addColorStop(0, 'rgba(0, 245, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      ctx.fill();

      // Center dot
      ctx.fillStyle = '#00f5ff';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(name, pos.x, pos.y + 18);
    });

    // Draw routes
    if (selectedRoute) {
      const fromCity = cities[selectedRoute.from.name as keyof typeof cities];
      const toCity = cities[selectedRoute.to.name as keyof typeof cities];

      if (fromCity && toCity) {
        // Calculate curved path
        const midX = (fromCity.x + toCity.x) / 2;
        const midY = (fromCity.y + toCity.y) / 2 - 50;

        // Draw full path (dimmed)
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(fromCity.x, fromCity.y);
        ctx.quadraticCurveTo(midX, midY, toCity.x, toCity.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw animated path
        const progress = animationProgress;
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(fromCity.x, fromCity.y);
        
        // Draw partial curve based on progress
        const currentMidX = fromCity.x + (midX - fromCity.x) * progress;
        const currentMidY = fromCity.y + (midY - fromCity.y) * progress;
        const currentEndX = fromCity.x + (toCity.x - fromCity.x) * progress;
        const currentEndY = fromCity.y + (toCity.y - fromCity.y) * progress;
        
        ctx.quadraticCurveTo(currentMidX, currentMidY, currentEndX, currentEndY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw plane icon at current position
        if (progress > 0) {
          ctx.fillStyle = '#ffd700';
          ctx.beginPath();
          ctx.arc(currentEndX, currentEndY, 6, 0, Math.PI * 2);
          ctx.fill();
          
          // Plane glow
          const planeGradient = ctx.createRadialGradient(currentEndX, currentEndY, 0, currentEndX, currentEndY, 15);
          planeGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
          planeGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
          ctx.fillStyle = planeGradient;
          ctx.beginPath();
          ctx.arc(currentEndX, currentEndY, 15, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }, [selectedRoute, animationProgress]);

  useEffect(() => {
    if (selectedRoute) {
      setAnimationProgress(0);
      const interval = setInterval(() => {
        setAnimationProgress(prev => {
          if (prev >= 1) {
            clearInterval(interval);
            return 1;
          }
          return prev + 0.02;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [selectedRoute]);

  return (
    <div className="glass-panel rounded-xl p-4 neon-border-magenta">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-fuchsia-400" />
          <h3 className="text-lg font-bold text-gradient-magenta">ROUTE VISUALIZER</h3>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-fuchsia-500/50 text-fuchsia-400">
            <Satellite className="w-3 h-3 mr-1" />
            GPS ACTIVE
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Canvas Map */}
        <div className="col-span-2">
          <canvas
            ref={canvasRef}
            className="route-canvas w-full h-64"
          />
        </div>

        {/* Route List */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white/70 mb-2">SELECT ROUTE</h4>
          {routes.map((route, index) => (
            <TiltCard key={index}>
              <div
                className={`glass-card rounded-lg p-3 cursor-pointer transition-all ${
                  selectedRoute === route ? 'border-fuchsia-500/50 bg-fuchsia-500/10' : ''
                }`}
                onClick={() => setSelectedRoute(route)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-fuchsia-400">{route.from.name}</span>
                  <ArrowRightLeft className="w-3 h-3 text-white/40" />
                  <span className="text-xs text-fuchsia-400">{route.to.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>{route.distance.toLocaleString()} km</span>
                  <span className="text-yellow-400">${route.price}</span>
                </div>
                <div className="text-xs text-white/40 mt-1">{route.duration}</div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      {selectedRoute && (
        <div className="mt-4 glass-card rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-white/50">FROM</div>
              <div className="text-lg font-bold text-fuchsia-400">{selectedRoute.from.name}</div>
            </div>
            <Plane className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <div className="text-xs text-white/50">TO</div>
              <div className="text-lg font-bold text-fuchsia-400">{selectedRoute.to.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-white/50">DISTANCE</div>
              <div className="text-lg font-bold text-white">{selectedRoute.distance.toLocaleString()} km</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-white/50">DURATION</div>
              <div className="text-lg font-bold text-white">{selectedRoute.duration}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-white/50">PRICE</div>
              <div className="text-lg font-bold text-yellow-400">${selectedRoute.price}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MODULE 4: REAL-TIME PRICE TICKER
// ============================================

const PriceTicker: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>(
    PRICE_DROPS.reduce((acc, pd) => ({ ...acc, [pd.id]: pd.expiresIn }), {})
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) updated[key]--;
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel rounded-xl p-3 overflow-hidden">
      <div className="flex items-center gap-3 mb-2">
        <TrendingDown className="w-5 h-5 text-green-400" />
        <h3 className="text-sm font-bold text-green-400">INSTANT PRICE DROPS & LAST MINUTE STEALS</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-green-500/50 to-transparent" />
      </div>
      
      <div className="ticker-container">
        <div className="ticker-content">
          {[...PRICE_DROPS, ...PRICE_DROPS].map((drop, index) => (
            <div key={`${drop.id}-${index}`} className="ticker-item">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Plane className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">{drop.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40 line-through">${drop.originalPrice}</span>
                  <span className="text-lg font-bold text-green-400">${drop.newPrice}</span>
                </div>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                  -{drop.discount}%
                </Badge>
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <Clock className="w-3 h-3" />
                  {formatTime(timeLeft[drop.id] || 0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MODULE 5: CURRENCY CONVERTER PRO
// ============================================

const CurrencyConverter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState(CURRENCIES[0]);
  const [toCurrency, setToCurrency] = useState(CURRENCIES[1]);

  const convertedAmount = (amount / fromCurrency.rate * toCurrency.rate).toFixed(2);

  return (
    <>
      <div className={`overlay-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`slide-panel ${isOpen ? 'open' : ''}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-gradient-gold">CURRENCY CONVERTER PRO</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Converter */}
          <div className="glass-card rounded-xl p-4 mb-6">
            <div className="mb-4">
              <label className="text-xs text-white/50 mb-2 block">AMOUNT</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="neon-input text-2xl font-bold"
              />
            </div>

            <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end mb-4">
              <div>
                <label className="text-xs text-white/50 mb-2 block">FROM</label>
                <select
                  value={fromCurrency.code}
                  onChange={(e) => setFromCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])}
                  className="neon-input w-full"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => { const temp = fromCurrency; setFromCurrency(toCurrency); setToCurrency(temp); }}
                className="p-3 glass-card rounded-lg hover:bg-white/10 transition-colors"
              >
                <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
              </button>
              <div>
                <label className="text-xs text-white/50 mb-2 block">TO</label>
                <select
                  value={toCurrency.code}
                  onChange={(e) => setToCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[1])}
                  className="neon-input w-full"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center py-4">
              <div className="text-4xl font-bold text-gradient-gold">
                {toCurrency.symbol}{convertedAmount}
              </div>
              <div className="text-sm text-white/50 mt-2">
                1 {fromCurrency.code} = {(toCurrency.rate / fromCurrency.rate).toFixed(4)} {toCurrency.code}
              </div>
            </div>
          </div>

          {/* Currency Grid */}
          <h3 className="text-sm font-bold text-white/70 mb-3">QUICK REFERENCE</h3>
          <div className="grid grid-cols-3 gap-2">
            {CURRENCIES.slice(0, 12).map(currency => (
              <TiltCard key={currency.code}>
                <div className="glass-card rounded-lg p-2 text-center cursor-pointer hover:bg-white/5">
                  <div className="text-lg mb-1">{currency.flag}</div>
                  <div className="text-xs font-medium text-white">{currency.code}</div>
                  <div className="text-xs text-white/50">{currency.symbol}{(amount / fromCurrency.rate * currency.rate).toFixed(0)}</div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================
// MODULE 6: TRIP DURATION & BUDGET
// ============================================

const TripDurationBudget: React.FC = () => {
  const [duration, setDuration] = useState(7);
  const [dailyBudget, setDailyBudget] = useState(300);
  const [hotelPrice, setHotelPrice] = useState(250);

  const totalBudget = duration * dailyBudget;
  const hotelCost = duration * hotelPrice;
  const remainingBudget = totalBudget - hotelCost;
  const budgetUsedPercent = (hotelCost / totalBudget) * 100;

  return (
    <div className="glass-panel rounded-xl p-4 neon-border-cyan">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-gradient-cyan">TRIP DURATION & BUDGET</h3>
        </div>
        <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
          <Target className="w-3 h-3 mr-1" />
          PLANNER
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Duration Slider */}
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-white/70">DURATION</label>
            <span className="text-2xl font-bold text-cyan-400">{duration} <span className="text-sm text-white/50">days</span></span>
          </div>
          <Slider
            value={[duration]}
            min={1}
            max={30}
            step={1}
            onValueChange={(value) => setDuration(value[0])}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-white/40">
            <span>1 day</span>
            <span>30 days</span>
          </div>
        </div>

        {/* Daily Budget */}
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-white/70">DAILY BUDGET</label>
            <span className="text-2xl font-bold text-yellow-400">${dailyBudget}</span>
          </div>
          <Slider
            value={[dailyBudget]}
            min={50}
            max={2000}
            step={50}
            onValueChange={(value) => setDailyBudget(value[0])}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-white/40">
            <span>$50</span>
            <span>$2000</span>
          </div>
        </div>

        {/* Hotel Price */}
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-white/70">HOTEL/NIGHT</label>
            <span className="text-2xl font-bold text-fuchsia-400">${hotelPrice}</span>
          </div>
          <Slider
            value={[hotelPrice]}
            min={50}
            max={1000}
            step={10}
            onValueChange={(value) => setHotelPrice(value[0])}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-white/40">
            <span>$50</span>
            <span>$1000</span>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="mt-4 glass-card rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm text-white/50">TOTAL BUDGET</div>
            <div className="text-2xl font-bold text-white">${totalBudget.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/50">REMAINING</div>
            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${remainingBudget.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="neon-progress mb-2">
          <div 
            className="neon-progress-fill"
            style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div className="glass-card rounded-lg p-2">
            <div className="text-xs text-white/50">ACCOMMODATION</div>
            <div className="text-lg font-bold text-fuchsia-400">${hotelCost.toLocaleString()}</div>
          </div>
          <div className="glass-card rounded-lg p-2">
            <div className="text-xs text-white/50">ACTIVITIES</div>
            <div className="text-lg font-bold text-cyan-400">${(remainingBudget * 0.6).toFixed(0)}</div>
          </div>
          <div className="glass-card rounded-lg p-2">
            <div className="text-xs text-white/50">FOOD & TRANSPORT</div>
            <div className="text-lg font-bold text-yellow-400">${(remainingBudget * 0.4).toFixed(0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EXPEDIA API INTEGRATION LAYER
// ============================================

const ExpediaIntegration: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [hotels, setHotels] = useState<HotelData[]>(MOCK_HOTELS);
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);

  const syncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      // Simulate data update with random price changes
      const updatedHotels = hotels.map(hotel => ({
        ...hotel,
        dynamic_pricing_index: 0.8 + Math.random() * 0.6,
        room_inventory: hotel.room_inventory.map(room => ({
          ...room,
          price_per_night: Math.floor(room.price_per_night * (0.9 + Math.random() * 0.2))
        }))
      }));
      setHotels(updatedHotels);
      setLastSync(new Date());
      setIsSyncing(false);
    }, 2000);
  };

  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Hexagon className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-bold text-gradient-cyan">EXPEDIA RAPID API INTEGRATION</h3>
        </div>
        <div className="flex items-center gap-3">
          {lastSync && (
            <span className="text-xs text-white/50">
              Last sync: {lastSync.toLocaleTimeString()}
            </span>
          )}
          <MagneticButton 
            onClick={syncData}
            variant="primary"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'SYNCING...' : 'SYNC DATA'}
          </MagneticButton>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {hotels.map(hotel => (
          <TiltCard key={hotel.hotel_id}>
            <div 
              className={`glass-card rounded-lg p-3 cursor-pointer transition-all ${
                selectedHotel?.hotel_id === hotel.hotel_id ? 'border-violet-500/50 bg-violet-500/10' : ''
              }`}
              onClick={() => setSelectedHotel(hotel)}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs border-violet-500/50 text-violet-400">
                  {hotel.hotel_id}
                </Badge>
                <div className={`flex items-center gap-1 text-xs ${
                  hotel.dynamic_pricing_index > 1 ? 'text-red-400' : 'text-green-400'
                }`}>
                  <TrendingDown className="w-3 h-3" />
                  {(hotel.dynamic_pricing_index * 100).toFixed(0)}%
                </div>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1 line-clamp-1">{hotel.property_metadata.name}</h4>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-white/70">{hotel.property_metadata.rating}</span>
                <span className="text-xs text-white/40">({hotel.property_metadata.reviews})</span>
              </div>
              <div className="space-y-1">
                {hotel.room_inventory.slice(0, 2).map((room, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-white/50">{room.type}</span>
                    <span className="text-cyan-400">${room.price_per_night}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
                <MapPin className="w-3 h-3 text-white/40" />
                <span className="text-xs text-white/40 truncate">
                  {hotel.geospatial_coordinates.lat.toFixed(2)}, {hotel.geospatial_coordinates.lng.toFixed(2)}
                </span>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

      {selectedHotel && (
        <div className="mt-4 glass-card rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-white">{selectedHotel.property_metadata.name}</h4>
              <p className="text-sm text-white/50">{selectedHotel.property_metadata.address}</p>
            </div>
            <div className="flex gap-2">
              {selectedHotel.property_metadata.amenities.map((amenity, idx) => (
                <Badge key={idx} variant="outline" className="text-xs border-white/20 text-white/60">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {selectedHotel.room_inventory.map((room, idx) => (
              <div key={idx} className="glass-card rounded-lg p-3">
                <div className="text-sm font-medium text-white">{room.type}</div>
                <div className="text-xs text-white/50">{room.count} rooms available</div>
                <div className="text-lg font-bold text-cyan-400 mt-2">${room.price_per_night}<span className="text-xs text-white/50">/night</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// HERO SECTION
// ============================================

const HeroSection: React.FC = () => {
  const { ref, offset } = useParallax(0.3);

  return (
    <div ref={ref} className="relative h-64 overflow-hidden rounded-xl mb-4">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-fuchsia-900/30 to-cyan-900/50"
        style={{ transform: `translateY(${offset}px)` }}
      />
      <div className="absolute inset-0 bg-obsidian-mesh" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-6 mb-2">
            <h1 className="text-6xl font-black text-gradient-cyan tracking-tight">
              LionGateOS Travels
            </h1>
          </div>
          <p className="text-lg text-white/60 mb-6 tracking-widest">GLOBAL TRAVEL OPERATING SYSTEM</p>
          <div className="flex items-center justify-center gap-4">
            <MagneticButton variant="primary">
              <Plane className="w-4 h-4 mr-2" />
              EXPLORE
            </MagneticButton>
            <MagneticButton variant="secondary">
              <Compass className="w-4 h-4 mr-2" />
              DISCOVER
            </MagneticButton>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-20 h-20 border border-cyan-500/20 rounded-full animate-pulse" />
      <div className="absolute bottom-4 right-4 w-32 h-32 border border-fuchsia-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-8 w-2 h-2 bg-cyan-400 rounded-full animate-float" />
      <div className="absolute top-1/3 right-12 w-3 h-3 bg-fuchsia-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

function App() {
  const [currencyPanelOpen, setCurrencyPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-obsidian-deep scanlines">
      <CustomCursor />
      
      {/* Main Container - 95% Density */}
      <div className="max-w-[1920px] mx-auto p-2">
        {/* Header */}
        <header className="flex items-center justify-between mb-2 glass-panel rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center p-2">
              <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gradient-cyan">LionGateOS Travels</h1>
              <span className="text-xs text-white/50">GLOBAL TRAVEL OS</span>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            <MagneticButton variant="secondary" className="text-sm py-2 px-4">
              <Hotel className="w-4 h-4 mr-2" />
              HOTELS
            </MagneticButton>
            <MagneticButton variant="secondary" className="text-sm py-2 px-4">
              <Plane className="w-4 h-4 mr-2" />
              FLIGHTS
            </MagneticButton>
            <MagneticButton variant="secondary" className="text-sm py-2 px-4">
              <Car className="w-4 h-4 mr-2" />
              CARS
            </MagneticButton>
            <MagneticButton 
              variant="gold" 
              className="text-sm py-2 px-4"
              onClick={() => setCurrencyPanelOpen(true)}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              CURRENCY
            </MagneticButton>
          </nav>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              <Zap className="w-3 h-3 mr-1" />
              SYSTEM ONLINE
            </Badge>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
          </div>
        </header>

        {/* Hero */}
        <HeroSection />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-2">
          {/* Left Column - 8 cols */}
          <div className="col-span-8 space-y-2">
            {/* Global Connectivity Hub */}
            <GlobalConnectivityHub />
            
            {/* Search Matrix */}
            <SearchMatrix onFilterChange={(filters) => console.log(filters)} />
            
            {/* Route Visualizer */}
            <RouteVisualizer />
            
            {/* Expedia Integration */}
            <ExpediaIntegration />
          </div>

          {/* Right Column - 4 cols */}
          <div className="col-span-4 space-y-2">
            {/* Trip Duration & Budget */}
            <TripDurationBudget />
            
            {/* Quick Stats */}
            <div className="glass-panel rounded-xl p-4">
              <h3 className="text-sm font-bold text-white/70 mb-3">QUICK STATS</h3>
              <div className="grid grid-cols-2 gap-2">
                <TiltCard>
                  <div className="glass-card rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-cyan-400">2.4M+</div>
                    <div className="text-xs text-white/50">Hotels</div>
                  </div>
                </TiltCard>
                <TiltCard>
                  <div className="glass-card rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-fuchsia-400">500+</div>
                    <div className="text-xs text-white/50">Airlines</div>
                  </div>
                </TiltCard>
                <TiltCard>
                  <div className="glass-card rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-400">190+</div>
                    <div className="text-xs text-white/50">Countries</div>
                  </div>
                </TiltCard>
                <TiltCard>
                  <div className="glass-card rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-400">98%</div>
                    <div className="text-xs text-white/50">Satisfaction</div>
                  </div>
                </TiltCard>
              </div>
            </div>

            {/* Featured Destinations */}
            <div className="glass-panel rounded-xl p-4">
              <h3 className="text-sm font-bold text-white/70 mb-3">TRENDING DESTINATIONS</h3>
              <div className="space-y-2">
                {['Tokyo, Japan', 'Santorini, Greece', 'Bali, Indonesia', 'Paris, France', 'Maldives'].map((dest, idx) => (
                  <TiltCard key={dest}>
                    <div className="glass-card rounded-lg p-2 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-violet-500/30 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="text-sm text-white">{dest}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400">-{15 + idx * 5}%</span>
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div className="glass-panel rounded-xl p-4">
              <h3 className="text-sm font-bold text-white/70 mb-3">RECENT SEARCHES</h3>
              <div className="space-y-2">
                {[
                  { from: 'NYC', to: 'Tokyo', date: 'Mar 15' },
                  { from: 'London', to: 'Dubai', date: 'Apr 2' },
                  { from: 'LA', to: 'Paris', date: 'May 10' }
                ].map((search, idx) => (
                  <div key={idx} className="glass-card rounded-lg p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-cyan-400">{search.from}</span>
                      <Plane className="w-3 h-3 text-white/40" />
                      <span className="text-sm text-fuchsia-400">{search.to}</span>
                    </div>
                    <span className="text-xs text-white/40">{search.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Price Ticker Footer */}
        <div className="mt-2">
          <PriceTicker />
        </div>

        {/* Footer */}
        <footer className="mt-2 glass-panel rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>© 2026 LionGateOS Travels</span>
            <span>|</span>
            <span>v2.4.7-BETA</span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40">POWERED BY</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">EXPEDIA RAPID</Badge>
              <Badge variant="outline" className="text-xs border-violet-500/30 text-violet-400">AMADEUS</Badge>
              <Badge variant="outline" className="text-xs border-fuchsia-500/30 text-fuchsia-400">BOOKING.COM</Badge>
            </div>
          </div>
        </footer>
      </div>

      {/* Currency Converter Slide Panel */}
      <CurrencyConverter 
        isOpen={currencyPanelOpen} 
        onClose={() => setCurrencyPanelOpen(false)} 
      />
    </div>
  );
}

export default App;