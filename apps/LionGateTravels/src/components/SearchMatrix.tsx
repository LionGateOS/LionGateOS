import React, { useState } from 'react';
import { 
  Search, Filter, DollarSign, TrendingDown, 
  Sparkles, MapPin, Shield, Check
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { FlightSearch } from './FlightSearch';

// Magnetic Button Component (Internal to keep it portable or we can import it if we move it to a shared lib)
const MagneticButton: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'gold' | 'magenta';
}> = ({ children, onClick, className = '', variant = 'primary' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
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

export interface SearchFilters {
  priceRange: number[];
  amenities: {
    wifi: boolean;
    pool: boolean;
    spa: boolean;
    gym: boolean;
    restaurant: boolean;
    bar: boolean;
  };
  neighborhoods: {
    downtown: boolean;
    beachfront: boolean;
    airport: boolean;
    historic: boolean;
    business: boolean;
  };
  safetyScore: number;
}

interface SearchMatrixProps {
  onFilterChange: (filters: SearchFilters) => void;
  filteredCount?: number;
  mode?: string;
}

export const SearchMatrix: React.FC<SearchMatrixProps> = ({ onFilterChange, filteredCount = 0, mode = 'hotels' }) => {
  const initialFilters: SearchFilters = {
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
  };

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleAmenity = (key: keyof SearchFilters['amenities']) => {
    const newAmenities = { ...filters.amenities, [key]: !filters.amenities[key] };
    updateFilter('amenities', newAmenities);
  };

  const toggleNeighborhood = (key: keyof SearchFilters['neighborhoods']) => {
    const newNeighborhoods = { ...filters.neighborhoods, [key]: !filters.neighborhoods[key] };
    updateFilter('neighborhoods', newNeighborhoods);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  return (
    <div className="glass-panel rounded-xl p-3 neon-border-gold">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-bold text-gradient-gold uppercase tracking-wider">
            SEARCH MATRIX
          </h3>
        </div>
        <div className="flex gap-2">
          <MagneticButton variant="primary" className="text-xs py-1 px-3" onClick={() => { window.dispatchEvent(new CustomEvent("triggerSearch")); }}>
            <Search className="w-3 h-3 mr-1" />
            Search
          </MagneticButton>
          <MagneticButton variant="gold" className="text-xs py-1 px-3" onClick={resetFilters}>
            <Filter className="w-3 h-3 mr-1" />
            Reset
          </MagneticButton>
        </div>
      </div>

      {/* Flight Search Widget - Always visible in this restored version */}
      <div className="mb-2 bg-white/5 rounded-xl p-1 overflow-hidden">
        <FlightSearch />
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
            <span className="deals-count text-xs text-green-400">{filteredCount} deals found</span>
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
                  onClick={() => toggleAmenity(key as keyof SearchFilters['amenities'])}
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
                  onClick={() => toggleNeighborhood(key as keyof SearchFilters['neighborhoods'])}
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
