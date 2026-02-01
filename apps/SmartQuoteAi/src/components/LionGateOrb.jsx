import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * LionGateOrb - A draggable, theme-synced 3D particle orb.
 * Supports "right", "bottom", "left", "top" initial positions or numeric coordinates.
 */
export default function LionGateOrb({ size = 100, initialX = 'right', initialY = 'bottom' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const requestRef = useRef();
  
  // Calculate initial position
  const getInitialPos = () => {
    const margin = 30;
    let x = margin;
    let y = window.innerHeight - size - margin;

    if (initialX === 'right') x = window.innerWidth - size - margin;
    else if (typeof initialX === 'number') x = initialX;

    if (initialY === 'top') y = margin;
    else if (typeof initialY === 'number') y = initialY;

    return { x, y };
  };

  const [position, setPosition] = useState(getInitialPos);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Handle Dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // --- ANIMATION LOGIC ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // CONFIG
    const trailLength = 15;
    const particleCount = 35; 
    
    // --- THEME SYNC LOGIC ---
    // 1. Try to read from LionGateOS storage
    // 2. Fallback to default blue/indigo/pink if running standalone
    let colors = ['#3b82f6', '#6366f1', '#ec4899'];
    try {
      const synced = localStorage.getItem('liongate_theme_sync');
      if (synced) {
        const data = JSON.parse(synced);
        if(data.accent) colors = [data.accent, data.accent2, data.accent3];
      }
    } catch(e) {
      console.log("Running Standalone Mode");
    }

    const particles = [];
    for(let i=0; i<particleCount; i++) {
        const theta = Math.acos(2 * Math.random() - 1);
        const phi = 2 * Math.PI * Math.random();
        particles.push({
            vx: Math.sin(theta) * Math.cos(phi),
            vy: Math.sin(theta) * Math.sin(phi),
            vz: Math.cos(theta),
            history: []
        });
    }

    function project(x, y, z) {
        const perspective = size * 3; 
        const scale = perspective / (perspective + z);
        return { x: (size/2) + x * scale, y: (size/2) + y * scale };
    }

    let angleX = 0;
    let angleY = 0;

    const animate = () => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const speed = 0.005; 
      angleY += speed;
      angleX += speed * 0.5;

      const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX), sinX = Math.sin(angleX);

      ctx.globalCompositeOperation = 'lighter'; 
      const orbRadius = (size / 2) * 0.65; 

      particles.forEach((p, index) => {
          let x = p.vx * orbRadius;
          let y = p.vy * orbRadius;
          let z = p.vz * orbRadius;

          // Rotation
          let x1 = x * cosY - z * sinY;
          let z1 = z * cosY + x * sinY;
          x = x1; z = z1;

          let y1 = y * cosX - z * sinX;
          let z1_2 = z * cosX + y * sinX;
          y = y1; z = z1_2;

          p.history.push({x, y, z});
          if(p.history.length > trailLength) p.history.shift();

          if(p.history.length > 2) {
              const col = colors[index % 3]; 
              ctx.beginPath();
              ctx.strokeStyle = col;
              ctx.lineWidth = 1.5; 
              ctx.setLineDash([2, 2]); 
              
              let start = project(p.history[0].x, p.history[0].y, p.history[0].z);
              ctx.moveTo(start.x, start.y);
              
              for(let i=1; i<p.history.length; i++) {
                  let pos = project(p.history[i].x, p.history[i].y, p.history[i].z);
                  ctx.globalAlpha = i / p.history.length;
                  ctx.lineTo(pos.x, pos.y);
              }
              ctx.stroke();
          }
      });
      
      ctx.setLineDash([]);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [size]);

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: `${size}px`,
        height: `${size}px`,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'grab',
        pointerEvents: 'auto',
        transition: isDragging ? 'none' : 'top 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      }}
      title="Drag to move"
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />
    </div>
  );
}