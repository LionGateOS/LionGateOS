import React, { useState, useEffect } from 'react';
import { Globe, Radio, Droplets, Wind, Sun, Cloud, CloudRain, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TiltCard } from './Shared';

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

const WORLD_CLOCKS: WorldClock[] = [
  { city: 'New York', timezone: 'America/New_York', offset: 'UTC-5', weather: { temp: 18, condition: 'sunny', humidity: 45, wind: 12 } },
  { city: 'London', timezone: 'Europe/London', offset: 'UTC+0', weather: { temp: 14, condition: 'cloudy', humidity: 72, wind: 18 } },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', offset: 'UTC+9', weather: { temp: 22, condition: 'clear', humidity: 58, wind: 8 } },
  { city: 'Dubai', timezone: 'Asia/Dubai', offset: 'UTC+4', weather: { temp: 34, condition: 'sunny', humidity: 35, wind: 15 } },
  { city: 'Singapore', timezone: 'Asia/Singapore', offset: 'UTC+8', weather: { temp: 30, condition: 'rainy', humidity: 85, wind: 10 } }
];

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

const ConnectivityHub: React.FC = () => {
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
    <div className="glass-panel rounded-xl p-4 neon-border-cyan mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-gradient-cyan uppercase tracking-wider">Global Connectivity Hub</h3>
        </div>
        <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
          <Radio className="w-3 h-3 mr-1 animate-pulse" />
          LIVE
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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

export default ConnectivityHub;
