import React, { useState, useEffect, useRef } from 'react';
import { Navigation, Satellite, ArrowRightLeft, Plane } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TiltCard } from './Shared';

interface FlightRoute {
  from: { lat: number; lng: number; name: string };
  to: { lat: number; lng: number; name: string };
  distance: number;
  duration: string;
  price: number;
}

const ROUTES: FlightRoute[] = [
  { from: { lat: 40.7128, lng: -74.0060, name: 'NYC' }, to: { lat: 51.5074, lng: -0.1278, name: 'London' }, distance: 5585, duration: '7h 30m', price: 780 },
  { from: { lat: 51.5074, lng: -0.1278, name: 'London' }, to: { lat: 25.2048, lng: 55.2708, name: 'Dubai' }, distance: 5470, duration: '6h 50m', price: 640 },
  { from: { lat: 25.2048, lng: 55.2708, name: 'Dubai' }, to: { lat: 1.3521, lng: 103.8198, name: 'Singapore' }, distance: 5845, duration: '7h 15m', price: 520 },
  { from: { lat: 1.3521, lng: 103.8198, name: 'Singapore' }, to: { lat: 35.6762, lng: 139.6503, name: 'Tokyo' }, distance: 5320, duration: '6h 45m', price: 480 },
  { from: { lat: 35.6762, lng: 139.6503, name: 'Tokyo' }, to: { lat: 40.7128, lng: -74.0060, name: 'NYC' }, distance: 10840, duration: '13h 30m', price: 1200 }
];

const RouteVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedRoute, setSelectedRoute] = useState<FlightRoute | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.15)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }

    const cities = {
      NYC: { x: width * 0.25, y: height * 0.35 },
      London: { x: width * 0.48, y: height * 0.28 },
      Dubai: { x: width * 0.58, y: height * 0.45 },
      Singapore: { x: width * 0.72, y: height * 0.58 },
      Tokyo: { x: width * 0.85, y: height * 0.38 }
    };

    Object.entries(cities).forEach(([name, pos]) => {
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 20);
      gradient.addColorStop(0, 'rgba(0, 245, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#00f5ff';
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(name, pos.x, pos.y + 18);
    });

    if (selectedRoute) {
      const fromCity = cities[selectedRoute.from.name as keyof typeof cities];
      const toCity = cities[selectedRoute.to.name as keyof typeof cities];

      if (fromCity && toCity) {
        const midX = (fromCity.x + toCity.x) / 2;
        const midY = (fromCity.y + toCity.y) / 2 - 50;

        ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(fromCity.x, fromCity.y);
        ctx.quadraticCurveTo(midX, midY, toCity.x, toCity.y);
        ctx.stroke();
        ctx.setLineDash([]);

        const progress = animationProgress;
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(fromCity.x, fromCity.y);
        
        const currentMidX = fromCity.x + (midX - fromCity.x) * progress;
        const currentMidY = fromCity.y + (midY - fromCity.y) * progress;
        const currentEndX = fromCity.x + (toCity.x - fromCity.x) * progress;
        const currentEndY = fromCity.y + (toCity.y - fromCity.y) * progress;
        
        ctx.quadraticCurveTo(currentMidX, currentMidY, currentEndX, currentEndY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (progress > 0) {
          ctx.fillStyle = '#ffd700';
          ctx.beginPath(); ctx.arc(currentEndX, currentEndY, 6, 0, Math.PI * 2); ctx.fill();
          const planeGradient = ctx.createRadialGradient(currentEndX, currentEndY, 0, currentEndX, currentEndY, 15);
          planeGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
          planeGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
          ctx.fillStyle = planeGradient;
          ctx.beginPath(); ctx.arc(currentEndX, currentEndY, 15, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
  }, [selectedRoute, animationProgress]);

  useEffect(() => {
    if (selectedRoute) {
      setAnimationProgress(0);
      const interval = setInterval(() => {
        setAnimationProgress(prev => {
          if (prev >= 1) { clearInterval(interval); return 1; }
          return prev + 0.02;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [selectedRoute]);

  return (
    <div className="route-visualizer glass-panel rounded-xl p-4 neon-border-magenta">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-fuchsia-400" />
          <h3 className="text-lg font-bold text-gradient-magenta uppercase tracking-wider">Route Visualizer</h3>
        </div>
        <Badge variant="outline" className="border-fuchsia-500/50 text-fuchsia-400">
          <Satellite className="w-3 h-3 mr-1" />
          GPS ACTIVE
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <canvas ref={canvasRef} className="route-canvas w-full h-64" />
        </div>
        <div className="space-y-2">
          {ROUTES.map((route, index) => (
            <TiltCard key={index}>
              <div
                className={`glass-card rounded-lg p-3 cursor-pointer transition-all ${
                  selectedRoute === route ? 'border-fuchsia-500/50 bg-fuchsia-500/10' : ''
                }`}
                onClick={() => {
                  setSelectedRoute(route);
                  const flash = document.createElement('div');
                  flash.innerText = `Visualizing Route to ${route.to.name} at $${route.price}`;
                  flash.style.position = 'fixed'; flash.style.top = '20px'; flash.style.right = '20px';
                  flash.style.background = '#00ff00'; flash.style.color = '#000'; flash.style.padding = '10px';
                  flash.style.borderRadius = '8px'; flash.style.zIndex = '9999'; flash.style.fontWeight = 'bold';
                  document.body.appendChild(flash);
                  setTimeout(() => flash.remove(), 3000);
                }}
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
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteVisualizer;
