import React from 'react';
import { Hotel, Plane, Car, DollarSign, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MagneticButton } from './Shared';
import Logo from '@/assets/logo.png';

interface HeaderProps {
  mode: string;
  setMode: (mode: 'hotels' | 'flights' | 'cars') => void;
}

const Header: React.FC<HeaderProps> = ({ mode, setMode }) => {
  return (
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
        <MagneticButton 
          variant={mode === 'hotels' ? 'primary' : 'secondary'} 
          className="text-sm py-2 px-4"
          onClick={() => setMode('hotels')}
        >
          <Hotel className="w-4 h-4 mr-2" />
          HOTELS
        </MagneticButton>
        <MagneticButton 
          variant={mode === 'flights' ? 'primary' : 'secondary'} 
          className="text-sm py-2 px-4"
          onClick={() => setMode('flights')}
        >
          <Plane className="w-4 h-4 mr-2" />
          FLIGHTS
        </MagneticButton>
        <MagneticButton 
          variant={mode === 'cars' ? 'primary' : 'secondary'} 
          className="text-sm py-2 px-4"
          onClick={() => setMode('cars')}
        >
          <Car className="w-4 h-4 mr-2" />
          CARS
        </MagneticButton>
        <MagneticButton 
          variant="gold" 
          className="text-sm py-2 px-4"
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
  );
};

export default Header;
