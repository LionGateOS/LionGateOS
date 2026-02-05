import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Plane, Hotel, MapPin, Clock, DollarSign, TrendingDown, Wind, Sun, Cloud, CloudRain, Search, Filter, Globe, Shield, Star, Car, ArrowRightLeft, X, RefreshCw, Zap, Target, Calendar, Droplets, Navigation, Radio, Satellite, Compass, Sparkles, Hexagon, Check } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FlightSearch } from './components/FlightSearch';
import Logo from '@/assets/logo.png';
// ============================================
// CUSTOM HOOKS
// ============================================
// Magnetic Cursor Hook
const useMagneticCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [trail, setTrail] = useState([]);
    const trailIdRef = useRef(0);
    useEffect(() => {
        const handleMouseMove = (e) => {
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
const use3DTilt = (maxTilt = 15) => {
    const ref = useRef(null);
    const [transform, setTransform] = useState('');
    const handleMouseMove = useCallback((e) => {
        if (!ref.current)
            return;
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
const useParallax = (speed = 0.5) => {
    const ref = useRef(null);
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current)
                return;
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
const MOCK_HOTELS = [
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
const WORLD_CLOCKS = [
    { city: 'New York', timezone: 'America/New_York', offset: 'UTC-5', weather: { temp: 18, condition: 'sunny', humidity: 45, wind: 12 } },
    { city: 'London', timezone: 'Europe/London', offset: 'UTC+0', weather: { temp: 14, condition: 'cloudy', humidity: 72, wind: 18 } },
    { city: 'Tokyo', timezone: 'Asia/Tokyo', offset: 'UTC+9', weather: { temp: 22, condition: 'clear', humidity: 58, wind: 8 } },
    { city: 'Dubai', timezone: 'Asia/Dubai', offset: 'UTC+4', weather: { temp: 34, condition: 'sunny', humidity: 35, wind: 15 } },
    { city: 'Singapore', timezone: 'Asia/Singapore', offset: 'UTC+8', weather: { temp: 30, condition: 'rainy', humidity: 85, wind: 10 } }
];
const CURRENCIES = [
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
const PRICE_DROPS = [
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
const getLocalTime = (timezone) => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};
const getWeatherIcon = (condition) => {
    switch (condition) {
        case 'sunny': return _jsx(Sun, { className: "w-5 h-5 text-yellow-400" });
        case 'cloudy': return _jsx(Cloud, { className: "w-5 h-5 text-gray-400" });
        case 'rainy': return _jsx(CloudRain, { className: "w-5 h-5 text-blue-400" });
        case 'clear': return _jsx(Star, { className: "w-5 h-5 text-cyan-400" });
        default: return _jsx(Sun, { className: "w-5 h-5 text-yellow-400" });
    }
};
// ============================================
// COMPONENTS
// ============================================
// Custom Cursor Component
const CustomCursor = () => {
    const { position, trail } = useMagneticCursor();
    return (_jsxs(_Fragment, { children: [trail.map((point, index) => (_jsx("div", { className: "cursor-trail", style: {
                    left: point.x - 4,
                    top: point.y - 4,
                    opacity: (index + 1) / trail.length * 0.5,
                    transform: `scale(${(index + 1) / trail.length})`
                } }, point.id))), _jsx("div", { className: "custom-cursor", style: {
                    left: position.x - 10,
                    top: position.y - 10,
                } })] }));
};
// 3D Tilt Card Component
const TiltCard = ({ children, className = '' }) => {
    const { ref, transform, handleMouseMove, handleMouseLeave } = use3DTilt(15);
    return (_jsx("div", { ref: ref, className: `tilt-card ${className}`, style: { transform }, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave, children: children }));
};
// Magnetic Button Component
const MagneticButton = ({ children, onClick, className = '', variant = 'primary' }) => {
    const buttonRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e) => {
        if (!buttonRef.current)
            return;
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
    return (_jsx("button", { ref: buttonRef, className: `magnetic-btn px-6 py-3 rounded-lg font-medium transition-all duration-200 ${variantStyles[variant]} ${className}`, style: { transform: `translate(${position.x}px, ${position.y}px)` }, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave, onClick: onClick, children: children }));
};
// ============================================
// MODULE 1: GLOBAL CONNECTIVITY HUB
// ============================================
const GlobalConnectivityHub = () => {
    const [currentTimes, setCurrentTimes] = useState(WORLD_CLOCKS.map(w => getLocalTime(w.timezone)));
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTimes(WORLD_CLOCKS.map(w => getLocalTime(w.timezone)));
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs("div", { className: "glass-panel rounded-xl p-4 neon-border-cyan", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Globe, { className: "w-5 h-5 text-cyan-400" }), _jsx("h3", { className: "text-lg font-bold text-gradient-cyan", children: "GLOBAL CONNECTIVITY HUB" })] }), _jsxs(Badge, { variant: "outline", className: "border-cyan-500/50 text-cyan-400", children: [_jsx(Radio, { className: "w-3 h-3 mr-1 animate-pulse" }), "LIVE"] })] }), _jsx("div", { className: "grid grid-cols-5 gap-3", children: WORLD_CLOCKS.map((clock, index) => (_jsx(TiltCard, { className: "glass-card rounded-lg p-3", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xs text-white/50 mb-1", children: clock.offset }), _jsx("div", { className: "text-2xl font-mono font-bold text-white mb-1", children: currentTimes[index] }), _jsx("div", { className: "text-sm font-medium text-cyan-400 mb-2", children: clock.city }), _jsxs("div", { className: "flex items-center justify-center gap-2 text-xs", children: [getWeatherIcon(clock.weather.condition), _jsxs("span", { className: "text-white/70", children: [clock.weather.temp, "\u00B0C"] })] }), _jsxs("div", { className: "flex items-center justify-center gap-3 mt-2 text-xs text-white/40", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Droplets, { className: "w-3 h-3" }), clock.weather.humidity, "%"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Wind, { className: "w-3 h-3" }), clock.weather.wind, "km/h"] })] })] }) }, clock.city))) })] }));
};
// ============================================
// MODULE 2: SEARCH MATRIX
// ============================================
const SearchMatrix = ({ onFilterChange }) => {
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
    const updateFilter = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };
    const toggleAmenity = (key) => {
        updateFilter('amenities', { ...filters.amenities, [key]: !filters.amenities[key] });
    };
    const toggleNeighborhood = (key) => {
        updateFilter('neighborhoods', { ...filters.neighborhoods, [key]: !filters.neighborhoods[key] });
    };
    return (_jsxs("div", { className: "glass-panel rounded-xl p-4 neon-border-gold", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Search, { className: "w-5 h-5 text-yellow-400" }), _jsx("h3", { className: "text-lg font-bold text-gradient-gold", children: "SEARCH MATRIX" })] }), _jsxs(MagneticButton, { variant: "gold", className: "text-xs py-1 px-3", children: [_jsx(Filter, { className: "w-3 h-3 mr-1" }), "Reset"] })] }), _jsx("div", { className: "mb-6 bg-white/5 rounded-xl p-1 overflow-hidden", children: _jsx(FlightSearch, {}) }), _jsxs("div", { className: "grid grid-cols-4 gap-4", children: [_jsxs("div", { className: "glass-card rounded-lg p-3", children: [_jsxs("h4", { className: "text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2", children: [_jsx(DollarSign, { className: "w-4 h-4" }), "PRICE RANGE"] }), _jsx("div", { className: "mb-4", children: _jsx(Slider, { value: filters.priceRange, min: 50, max: 5000, step: 50, onValueChange: (value) => updateFilter('priceRange', value), className: "w-full" }) }), _jsxs("div", { className: "flex justify-between text-sm text-white/70", children: [_jsxs("span", { children: ["$", filters.priceRange[0]] }), _jsxs("span", { children: ["$", filters.priceRange[1]] })] }), _jsxs("div", { className: "mt-3 flex items-center gap-2", children: [_jsx(TrendingDown, { className: "w-4 h-4 text-green-400" }), _jsx("span", { className: "text-xs text-green-400", children: "23 deals found" })] })] }), _jsxs("div", { className: "glass-card rounded-lg p-3", children: [_jsxs("h4", { className: "text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2", children: [_jsx(Sparkles, { className: "w-4 h-4" }), "AMENITIES"] }), _jsx("div", { className: "space-y-2", children: Object.entries(filters.amenities).map(([key, value]) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-white/70 capitalize", children: key }), _jsx("div", { className: `neon-toggle ${value ? 'active' : ''}`, onClick: () => toggleAmenity(key) })] }, key))) })] }), _jsxs("div", { className: "glass-card rounded-lg p-3", children: [_jsxs("h4", { className: "text-sm font-semibold text-fuchsia-400 mb-3 flex items-center gap-2", children: [_jsx(MapPin, { className: "w-4 h-4" }), "NEIGHBORHOOD"] }), _jsx("div", { className: "space-y-2", children: Object.entries(filters.neighborhoods).map(([key, value]) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-white/70 capitalize", children: key }), _jsx("div", { className: `neon-toggle ${value ? 'active' : ''}`, onClick: () => toggleNeighborhood(key) })] }, key))) })] }), _jsxs("div", { className: "glass-card rounded-lg p-3", children: [_jsxs("h4", { className: "text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2", children: [_jsx(Shield, { className: "w-4 h-4" }), "SAFETY SCORE"] }), _jsxs("div", { className: "text-center mb-3", children: [_jsx("span", { className: "text-4xl font-bold text-emerald-400", children: filters.safetyScore }), _jsx("span", { className: "text-white/50", children: "/10" })] }), _jsx("div", { className: "mb-2", children: _jsx(Slider, { value: [filters.safetyScore], min: 1, max: 10, step: 1, onValueChange: (value) => updateFilter('safetyScore', value[0]), className: "w-full" }) }), _jsxs("div", { className: "flex items-center gap-2 mt-3", children: [_jsx(Check, { className: "w-4 h-4 text-emerald-400" }), _jsx("span", { className: "text-xs text-emerald-400", children: "Verified Properties" })] })] })] })] }));
};
// ============================================
// MODULE 3: ROUTE VISUALIZER
// ============================================
const RouteVisualizer = () => {
    const canvasRef = useRef(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [animationProgress, setAnimationProgress] = useState(0);
    const routes = [
        { from: { lat: 40.7128, lng: -74.0060, name: 'NYC' }, to: { lat: 51.5074, lng: -0.1278, name: 'London' }, distance: 5585, duration: '7h 30m', price: 780 },
        { from: { lat: 51.5074, lng: -0.1278, name: 'London' }, to: { lat: 25.2048, lng: 55.2708, name: 'Dubai' }, distance: 5470, duration: '6h 50m', price: 640 },
        { from: { lat: 25.2048, lng: 55.2708, name: 'Dubai' }, to: { lat: 1.3521, lng: 103.8198, name: 'Singapore' }, distance: 5845, duration: '7h 15m', price: 520 },
        { from: { lat: 1.3521, lng: 103.8198, name: 'Singapore' }, to: { lat: 35.6762, lng: 139.6503, name: 'Tokyo' }, distance: 5320, duration: '6h 45m', price: 480 },
        { from: { lat: 35.6762, lng: 139.6503, name: 'Tokyo' }, to: { lat: 40.7128, lng: -74.0060, name: 'NYC' }, distance: 10840, duration: '13h 30m', price: 1200 }
    ];
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
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
            const fromCity = cities[selectedRoute.from.name];
            const toCity = cities[selectedRoute.to.name];
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
    return (_jsxs("div", { className: "glass-panel rounded-xl p-4 neon-border-magenta", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Navigation, { className: "w-5 h-5 text-fuchsia-400" }), _jsx("h3", { className: "text-lg font-bold text-gradient-magenta", children: "ROUTE VISUALIZER" })] }), _jsx("div", { className: "flex gap-2", children: _jsxs(Badge, { variant: "outline", className: "border-fuchsia-500/50 text-fuchsia-400", children: [_jsx(Satellite, { className: "w-3 h-3 mr-1" }), "GPS ACTIVE"] }) })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsx("div", { className: "col-span-2", children: _jsx("canvas", { ref: canvasRef, className: "route-canvas w-full h-64" }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "text-sm font-semibold text-white/70 mb-2", children: "SELECT ROUTE" }), routes.map((route, index) => (_jsx(TiltCard, { children: _jsxs("div", { className: `glass-card rounded-lg p-3 cursor-pointer transition-all ${selectedRoute === route ? 'border-fuchsia-500/50 bg-fuchsia-500/10' : ''}`, onClick: () => setSelectedRoute(route), children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-xs text-fuchsia-400", children: route.from.name }), _jsx(ArrowRightLeft, { className: "w-3 h-3 text-white/40" }), _jsx("span", { className: "text-xs text-fuchsia-400", children: route.to.name })] }), _jsxs("div", { className: "flex items-center justify-between text-xs text-white/50", children: [_jsxs("span", { children: [route.distance.toLocaleString(), " km"] }), _jsxs("span", { className: "text-yellow-400", children: ["$", route.price] })] }), _jsx("div", { className: "text-xs text-white/40 mt-1", children: route.duration })] }) }, index)))] })] }), selectedRoute && (_jsxs("div", { className: "mt-4 glass-card rounded-lg p-3 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-white/50", children: "FROM" }), _jsx("div", { className: "text-lg font-bold text-fuchsia-400", children: selectedRoute.from.name })] }), _jsx(Plane, { className: "w-5 h-5 text-cyan-400 animate-pulse" }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-white/50", children: "TO" }), _jsx("div", { className: "text-lg font-bold text-fuchsia-400", children: selectedRoute.to.name })] })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xs text-white/50", children: "DISTANCE" }), _jsxs("div", { className: "text-lg font-bold text-white", children: [selectedRoute.distance.toLocaleString(), " km"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xs text-white/50", children: "DURATION" }), _jsx("div", { className: "text-lg font-bold text-white", children: selectedRoute.duration })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xs text-white/50", children: "PRICE" }), _jsxs("div", { className: "text-lg font-bold text-yellow-400", children: ["$", selectedRoute.price] })] })] })] }))] }));
};
// ============================================
// MODULE 4: REAL-TIME PRICE TICKER
// ============================================
const PriceTicker = () => {
    const [timeLeft, setTimeLeft] = useState(PRICE_DROPS.reduce((acc, pd) => ({ ...acc, [pd.id]: pd.expiresIn }), {}));
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(key => {
                    if (updated[key] > 0)
                        updated[key]--;
                });
                return updated;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    return (_jsxs("div", { className: "glass-panel rounded-xl p-3 overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(TrendingDown, { className: "w-5 h-5 text-green-400" }), _jsx("h3", { className: "text-sm font-bold text-green-400", children: "INSTANT PRICE DROPS & LAST MINUTE STEALS" }), _jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-green-500/50 to-transparent" })] }), _jsx("div", { className: "ticker-container", children: _jsx("div", { className: "ticker-content", children: [...PRICE_DROPS, ...PRICE_DROPS].map((drop, index) => (_jsx("div", { className: "ticker-item", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Plane, { className: "w-4 h-4 text-cyan-400" }), _jsx("span", { className: "text-sm font-medium text-white", children: drop.destination })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-xs text-white/40 line-through", children: ["$", drop.originalPrice] }), _jsxs("span", { className: "text-lg font-bold text-green-400", children: ["$", drop.newPrice] })] }), _jsxs(Badge, { className: "bg-red-500/20 text-red-400 border-red-500/50", children: ["-", drop.discount, "%"] }), _jsxs("div", { className: "flex items-center gap-1 text-xs text-yellow-400", children: [_jsx(Clock, { className: "w-3 h-3" }), formatTime(timeLeft[drop.id] || 0)] })] }) }, `${drop.id}-${index}`))) }) })] }));
};
// ============================================
// MODULE 5: CURRENCY CONVERTER PRO
// ============================================
const CurrencyConverter = ({ isOpen, onClose }) => {
    const [amount, setAmount] = useState(1000);
    const [fromCurrency, setFromCurrency] = useState(CURRENCIES[0]);
    const [toCurrency, setToCurrency] = useState(CURRENCIES[1]);
    const convertedAmount = (amount / fromCurrency.rate * toCurrency.rate).toFixed(2);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: `overlay-backdrop ${isOpen ? 'open' : ''}`, onClick: onClose }), _jsx("div", { className: `slide-panel ${isOpen ? 'open' : ''}`, children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(DollarSign, { className: "w-6 h-6 text-yellow-400" }), _jsx("h2", { className: "text-xl font-bold text-gradient-gold", children: "CURRENCY CONVERTER PRO" })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-white/10 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-white/60" }) })] }), _jsxs("div", { className: "glass-card rounded-xl p-4 mb-6", children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "text-xs text-white/50 mb-2 block", children: "AMOUNT" }), _jsx(Input, { type: "number", value: amount, onChange: (e) => setAmount(Number(e.target.value)), className: "neon-input text-2xl font-bold" })] }), _jsxs("div", { className: "grid grid-cols-[1fr,auto,1fr] gap-3 items-end mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-white/50 mb-2 block", children: "FROM" }), _jsx("select", { value: fromCurrency.code, onChange: (e) => setFromCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0]), className: "neon-input w-full", children: CURRENCIES.map(c => (_jsxs("option", { value: c.code, children: [c.flag, " ", c.code, " - ", c.name] }, c.code))) })] }), _jsx("button", { onClick: () => { const temp = fromCurrency; setFromCurrency(toCurrency); setToCurrency(temp); }, className: "p-3 glass-card rounded-lg hover:bg-white/10 transition-colors", children: _jsx(ArrowRightLeft, { className: "w-5 h-5 text-cyan-400" }) }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-white/50 mb-2 block", children: "TO" }), _jsx("select", { value: toCurrency.code, onChange: (e) => setToCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[1]), className: "neon-input w-full", children: CURRENCIES.map(c => (_jsxs("option", { value: c.code, children: [c.flag, " ", c.code, " - ", c.name] }, c.code))) })] })] }), _jsxs("div", { className: "text-center py-4", children: [_jsxs("div", { className: "text-4xl font-bold text-gradient-gold", children: [toCurrency.symbol, convertedAmount] }), _jsxs("div", { className: "text-sm text-white/50 mt-2", children: ["1 ", fromCurrency.code, " = ", (toCurrency.rate / fromCurrency.rate).toFixed(4), " ", toCurrency.code] })] })] }), _jsx("h3", { className: "text-sm font-bold text-white/70 mb-3", children: "QUICK REFERENCE" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: CURRENCIES.slice(0, 12).map(currency => (_jsx(TiltCard, { children: _jsxs("div", { className: "glass-card rounded-lg p-2 text-center cursor-pointer hover:bg-white/5", children: [_jsx("div", { className: "text-lg mb-1", children: currency.flag }), _jsx("div", { className: "text-xs font-medium text-white", children: currency.code }), _jsxs("div", { className: "text-xs text-white/50", children: [currency.symbol, (amount / fromCurrency.rate * currency.rate).toFixed(0)] })] }) }, currency.code))) })] }) })] }));
};
// ============================================
// MODULE 6: TRIP DURATION & BUDGET
// ============================================
const TripDurationBudget = () => {
    const [duration, setDuration] = useState(7);
    const [dailyBudget, setDailyBudget] = useState(300);
    const [hotelPrice, setHotelPrice] = useState(250);
    const totalBudget = duration * dailyBudget;
    const hotelCost = duration * hotelPrice;
    const remainingBudget = totalBudget - hotelCost;
    const budgetUsedPercent = (hotelCost / totalBudget) * 100;
    return (_jsxs("div", { className: "glass-panel rounded-xl p-4 neon-border-cyan", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-5 h-5 text-cyan-400" }), _jsx("h3", { className: "text-lg font-bold text-gradient-cyan", children: "TRIP DURATION & BUDGET" })] }), _jsxs(Badge, { variant: "outline", className: "border-cyan-500/50 text-cyan-400", children: [_jsx(Target, { className: "w-3 h-3 mr-1" }), "PLANNER"] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "glass-card rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("label", { className: "text-sm font-semibold text-white/70", children: "DURATION" }), _jsxs("span", { className: "text-2xl font-bold text-cyan-400", children: [duration, " ", _jsx("span", { className: "text-sm text-white/50", children: "days" })] })] }), _jsx(Slider, { value: [duration], min: 1, max: 30, step: 1, onValueChange: (value) => setDuration(value[0]), className: "mb-4" }), _jsxs("div", { className: "flex justify-between text-xs text-white/40", children: [_jsx("span", { children: "1 day" }), _jsx("span", { children: "30 days" })] })] }), _jsxs("div", { className: "glass-card rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("label", { className: "text-sm font-semibold text-white/70", children: "DAILY BUDGET" }), _jsxs("span", { className: "text-2xl font-bold text-yellow-400", children: ["$", dailyBudget] })] }), _jsx(Slider, { value: [dailyBudget], min: 50, max: 2000, step: 50, onValueChange: (value) => setDailyBudget(value[0]), className: "mb-4" }), _jsxs("div", { className: "flex justify-between text-xs text-white/40", children: [_jsx("span", { children: "$50" }), _jsx("span", { children: "$2000" })] })] }), _jsxs("div", { className: "glass-card rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("label", { className: "text-sm font-semibold text-white/70", children: "HOTEL/NIGHT" }), _jsxs("span", { className: "text-2xl font-bold text-fuchsia-400", children: ["$", hotelPrice] })] }), _jsx(Slider, { value: [hotelPrice], min: 50, max: 1000, step: 10, onValueChange: (value) => setHotelPrice(value[0]), className: "mb-4" }), _jsxs("div", { className: "flex justify-between text-xs text-white/40", children: [_jsx("span", { children: "$50" }), _jsx("span", { children: "$1000" })] })] })] }), _jsxs("div", { className: "mt-4 glass-card rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-white/50", children: "TOTAL BUDGET" }), _jsxs("div", { className: "text-2xl font-bold text-white", children: ["$", totalBudget.toLocaleString()] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-sm text-white/50", children: "REMAINING" }), _jsxs("div", { className: `text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-400' : 'text-red-400'}`, children: ["$", remainingBudget.toLocaleString()] })] })] }), _jsx("div", { className: "neon-progress mb-2", children: _jsx("div", { className: "neon-progress-fill", style: { width: `${Math.min(budgetUsedPercent, 100)}%` } }) }), _jsxs("div", { className: "grid grid-cols-3 gap-4 mt-4 text-center", children: [_jsxs("div", { className: "glass-card rounded-lg p-2", children: [_jsx("div", { className: "text-xs text-white/50", children: "ACCOMMODATION" }), _jsxs("div", { className: "text-lg font-bold text-fuchsia-400", children: ["$", hotelCost.toLocaleString()] })] }), _jsxs("div", { className: "glass-card rounded-lg p-2", children: [_jsx("div", { className: "text-xs text-white/50", children: "ACTIVITIES" }), _jsxs("div", { className: "text-lg font-bold text-cyan-400", children: ["$", (remainingBudget * 0.6).toFixed(0)] })] }), _jsxs("div", { className: "glass-card rounded-lg p-2", children: [_jsx("div", { className: "text-xs text-white/50", children: "FOOD & TRANSPORT" }), _jsxs("div", { className: "text-lg font-bold text-yellow-400", children: ["$", (remainingBudget * 0.4).toFixed(0)] })] })] })] })] }));
};
// ============================================
// EXPEDIA API INTEGRATION LAYER
// ============================================
const ExpediaIntegration = () => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState(null);
    const [hotels, setHotels] = useState(MOCK_HOTELS);
    const [selectedHotel, setSelectedHotel] = useState(null);
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
    return (_jsxs("div", { className: "glass-panel rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Hexagon, { className: "w-5 h-5 text-violet-400" }), _jsx("h3", { className: "text-lg font-bold text-gradient-cyan", children: "EXPEDIA RAPID API INTEGRATION" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [lastSync && (_jsxs("span", { className: "text-xs text-white/50", children: ["Last sync: ", lastSync.toLocaleTimeString()] })), _jsxs(MagneticButton, { onClick: syncData, variant: "primary", className: "flex items-center gap-2", children: [_jsx(RefreshCw, { className: `w-4 h-4 ${isSyncing ? 'animate-spin' : ''}` }), isSyncing ? 'SYNCING...' : 'SYNC DATA'] })] })] }), _jsx("div", { className: "grid grid-cols-5 gap-3", children: hotels.map(hotel => (_jsx(TiltCard, { children: _jsxs("div", { className: `glass-card rounded-lg p-3 cursor-pointer transition-all ${selectedHotel?.hotel_id === hotel.hotel_id ? 'border-violet-500/50 bg-violet-500/10' : ''}`, onClick: () => setSelectedHotel(hotel), children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx(Badge, { variant: "outline", className: "text-xs border-violet-500/50 text-violet-400", children: hotel.hotel_id }), _jsxs("div", { className: `flex items-center gap-1 text-xs ${hotel.dynamic_pricing_index > 1 ? 'text-red-400' : 'text-green-400'}`, children: [_jsx(TrendingDown, { className: "w-3 h-3" }), (hotel.dynamic_pricing_index * 100).toFixed(0), "%"] })] }), _jsx("h4", { className: "text-sm font-semibold text-white mb-1 line-clamp-1", children: hotel.property_metadata.name }), _jsxs("div", { className: "flex items-center gap-1 mb-2", children: [_jsx(Star, { className: "w-3 h-3 text-yellow-400 fill-yellow-400" }), _jsx("span", { className: "text-xs text-white/70", children: hotel.property_metadata.rating }), _jsxs("span", { className: "text-xs text-white/40", children: ["(", hotel.property_metadata.reviews, ")"] })] }), _jsx("div", { className: "space-y-1", children: hotel.room_inventory.slice(0, 2).map((room, idx) => (_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-white/50", children: room.type }), _jsxs("span", { className: "text-cyan-400", children: ["$", room.price_per_night] })] }, idx))) }), _jsxs("div", { className: "mt-2 pt-2 border-t border-white/10 flex items-center gap-2", children: [_jsx(MapPin, { className: "w-3 h-3 text-white/40" }), _jsxs("span", { className: "text-xs text-white/40 truncate", children: [hotel.geospatial_coordinates.lat.toFixed(2), ", ", hotel.geospatial_coordinates.lng.toFixed(2)] })] })] }) }, hotel.hotel_id))) }), selectedHotel && (_jsxs("div", { className: "mt-4 glass-card rounded-lg p-4", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-lg font-bold text-white", children: selectedHotel.property_metadata.name }), _jsx("p", { className: "text-sm text-white/50", children: selectedHotel.property_metadata.address })] }), _jsx("div", { className: "flex gap-2", children: selectedHotel.property_metadata.amenities.map((amenity, idx) => (_jsx(Badge, { variant: "outline", className: "text-xs border-white/20 text-white/60", children: amenity }, idx))) })] }), _jsx("div", { className: "mt-4 grid grid-cols-3 gap-4", children: selectedHotel.room_inventory.map((room, idx) => (_jsxs("div", { className: "glass-card rounded-lg p-3", children: [_jsx("div", { className: "text-sm font-medium text-white", children: room.type }), _jsxs("div", { className: "text-xs text-white/50", children: [room.count, " rooms available"] }), _jsxs("div", { className: "text-lg font-bold text-cyan-400 mt-2", children: ["$", room.price_per_night, _jsx("span", { className: "text-xs text-white/50", children: "/night" })] })] }, idx))) })] }))] }));
};
// ============================================
// HERO SECTION
// ============================================
const HeroSection = () => {
    const { ref, offset } = useParallax(0.3);
    return (_jsxs("div", { ref: ref, className: "relative h-64 overflow-hidden rounded-xl mb-4", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-violet-900/50 via-fuchsia-900/30 to-cyan-900/50", style: { transform: `translateY(${offset}px)` } }), _jsx("div", { className: "absolute inset-0 bg-obsidian-mesh" }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "flex items-center gap-6 mb-2", children: _jsx("h1", { className: "text-6xl font-black text-gradient-cyan tracking-tight", children: "LionGateOS Travels" }) }), _jsx("p", { className: "text-lg text-white/60 mb-6 tracking-widest", children: "GLOBAL TRAVEL OPERATING SYSTEM" }), _jsxs("div", { className: "flex items-center justify-center gap-4", children: [_jsxs(MagneticButton, { variant: "primary", children: [_jsx(Plane, { className: "w-4 h-4 mr-2" }), "EXPLORE"] }), _jsxs(MagneticButton, { variant: "secondary", children: [_jsx(Compass, { className: "w-4 h-4 mr-2" }), "DISCOVER"] })] })] }) }), _jsx("div", { className: "absolute top-4 left-4 w-20 h-20 border border-cyan-500/20 rounded-full animate-pulse" }), _jsx("div", { className: "absolute bottom-4 right-4 w-32 h-32 border border-fuchsia-500/20 rounded-full animate-pulse", style: { animationDelay: '1s' } }), _jsx("div", { className: "absolute top-1/2 left-8 w-2 h-2 bg-cyan-400 rounded-full animate-float" }), _jsx("div", { className: "absolute top-1/3 right-12 w-3 h-3 bg-fuchsia-400 rounded-full animate-float", style: { animationDelay: '0.5s' } })] }));
};
// ============================================
// MAIN APP
// ============================================
function App() {
    const [currencyPanelOpen, setCurrencyPanelOpen] = useState(false);
    return (_jsxs("div", { className: "min-h-screen bg-obsidian-deep scanlines", children: [_jsx(CustomCursor, {}), _jsxs("div", { className: "max-w-[1920px] mx-auto p-2", children: [_jsxs("header", { className: "flex items-center justify-between mb-2 glass-panel rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center p-2", children: _jsx("img", { src: Logo, alt: "Logo", className: "w-full h-full object-contain" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-black text-gradient-cyan", children: "LionGateOS Travels" }), _jsx("span", { className: "text-xs text-white/50", children: "GLOBAL TRAVEL OS" })] })] }), _jsxs("nav", { className: "flex items-center gap-2", children: [_jsxs(MagneticButton, { variant: "secondary", className: "text-sm py-2 px-4", children: [_jsx(Hotel, { className: "w-4 h-4 mr-2" }), "HOTELS"] }), _jsxs(MagneticButton, { variant: "secondary", className: "text-sm py-2 px-4", children: [_jsx(Plane, { className: "w-4 h-4 mr-2" }), "FLIGHTS"] }), _jsxs(MagneticButton, { variant: "secondary", className: "text-sm py-2 px-4", children: [_jsx(Car, { className: "w-4 h-4 mr-2" }), "CARS"] }), _jsxs(MagneticButton, { variant: "gold", className: "text-sm py-2 px-4", onClick: () => setCurrencyPanelOpen(true), children: [_jsx(DollarSign, { className: "w-4 h-4 mr-2" }), "CURRENCY"] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Badge, { variant: "outline", className: "border-green-500/50 text-green-400", children: [_jsx(Zap, { className: "w-3 h-3 mr-1" }), "SYSTEM ONLINE"] }), _jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" })] })] }), _jsx(HeroSection, {}), _jsxs("div", { className: "grid grid-cols-12 gap-2", children: [_jsxs("div", { className: "col-span-8 space-y-2", children: [_jsx(GlobalConnectivityHub, {}), _jsx(SearchMatrix, { onFilterChange: (filters) => console.log(filters) }), _jsx(RouteVisualizer, {}), _jsx(ExpediaIntegration, {})] }), _jsxs("div", { className: "col-span-4 space-y-2", children: [_jsx(TripDurationBudget, {}), _jsxs("div", { className: "glass-panel rounded-xl p-4", children: [_jsx("h3", { className: "text-sm font-bold text-white/70 mb-3", children: "QUICK STATS" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx(TiltCard, { children: _jsxs("div", { className: "glass-card rounded-lg p-3 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-cyan-400", children: "2.4M+" }), _jsx("div", { className: "text-xs text-white/50", children: "Hotels" })] }) }), _jsx(TiltCard, { children: _jsxs("div", { className: "glass-card rounded-lg p-3 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-fuchsia-400", children: "500+" }), _jsx("div", { className: "text-xs text-white/50", children: "Airlines" })] }) }), _jsx(TiltCard, { children: _jsxs("div", { className: "glass-card rounded-lg p-3 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-yellow-400", children: "190+" }), _jsx("div", { className: "text-xs text-white/50", children: "Countries" })] }) }), _jsx(TiltCard, { children: _jsxs("div", { className: "glass-card rounded-lg p-3 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-emerald-400", children: "98%" }), _jsx("div", { className: "text-xs text-white/50", children: "Satisfaction" })] }) })] })] }), _jsxs("div", { className: "glass-panel rounded-xl p-4", children: [_jsx("h3", { className: "text-sm font-bold text-white/70 mb-3", children: "TRENDING DESTINATIONS" }), _jsx("div", { className: "space-y-2", children: ['Tokyo, Japan', 'Santorini, Greece', 'Bali, Indonesia', 'Paris, France', 'Maldives'].map((dest, idx) => (_jsx(TiltCard, { children: _jsxs("div", { className: "glass-card rounded-lg p-2 flex items-center justify-between cursor-pointer", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-violet-500/30 flex items-center justify-center", children: _jsx(MapPin, { className: "w-4 h-4 text-cyan-400" }) }), _jsx("span", { className: "text-sm text-white", children: dest })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(TrendingDown, { className: "w-3 h-3 text-green-400" }), _jsxs("span", { className: "text-xs text-green-400", children: ["-", 15 + idx * 5, "%"] })] })] }) }, dest))) })] }), _jsxs("div", { className: "glass-panel rounded-xl p-4", children: [_jsx("h3", { className: "text-sm font-bold text-white/70 mb-3", children: "RECENT SEARCHES" }), _jsx("div", { className: "space-y-2", children: [
                                                    { from: 'NYC', to: 'Tokyo', date: 'Mar 15' },
                                                    { from: 'London', to: 'Dubai', date: 'Apr 2' },
                                                    { from: 'LA', to: 'Paris', date: 'May 10' }
                                                ].map((search, idx) => (_jsxs("div", { className: "glass-card rounded-lg p-2 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-cyan-400", children: search.from }), _jsx(Plane, { className: "w-3 h-3 text-white/40" }), _jsx("span", { className: "text-sm text-fuchsia-400", children: search.to })] }), _jsx("span", { className: "text-xs text-white/40", children: search.date })] }, idx))) })] })] })] }), _jsx("div", { className: "mt-2", children: _jsx(PriceTicker, {}) }), _jsxs("footer", { className: "mt-2 glass-panel rounded-lg p-3 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4 text-xs text-white/40", children: [_jsx("span", { children: "\u00A9 2026 LionGateOS Travels" }), _jsx("span", { children: "|" }), _jsx("span", { children: "v2.4.7-BETA" }), _jsx("span", { children: "|" }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-green-400 animate-pulse" }), "ALL SYSTEMS OPERATIONAL"] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-xs text-white/40", children: "POWERED BY" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", className: "text-xs border-cyan-500/30 text-cyan-400", children: "EXPEDIA RAPID" }), _jsx(Badge, { variant: "outline", className: "text-xs border-violet-500/30 text-violet-400", children: "AMADEUS" }), _jsx(Badge, { variant: "outline", className: "text-xs border-fuchsia-500/30 text-fuchsia-400", children: "BOOKING.COM" })] })] })] })] }), _jsx(CurrencyConverter, { isOpen: currencyPanelOpen, onClose: () => setCurrencyPanelOpen(false) })] }));
}
export default App;
