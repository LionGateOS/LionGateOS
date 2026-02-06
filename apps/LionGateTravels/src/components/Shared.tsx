import React, { useState, useRef, useCallback, useEffect } from 'react';

// Magnetic Cursor Hook (Internal use)
export const useMagneticCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailIdRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const newTrail = { x: e.clientX, y: e.clientY, id: trailIdRef.current++ };
      setTrail(prev => [...prev.slice(-8), newTrail]);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return { position, isHovering, setIsHovering, trail };
};

// 3D Tilt Hook
export const use3DTilt = (maxTilt: number = 15) => {
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

// 3D Tilt Card Component
export const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
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
export const MagneticButton: React.FC<{ 
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
