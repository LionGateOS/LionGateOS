import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useGlobalMonitor } from '../context/GlobalMonitorContext';
import { GlobalTruthLogic } from '../services/GlobalTruthLogic';
/**
 * LionGateOrb - A draggable, theme-synced 3D particle orb.
 * Now acts as a GLOBAL STATE MONITOR via the Universal Intelligence Engine.
 */
export default function LionGateOrb({ size = 100, initialX = 'right', initialY = 'bottom' }) {
    // Safe context consumption (optional, handles if used outside provider)
    let monitorState = { activeZone: null, activeSeverity: null };
    try {
        monitorState = useGlobalMonitor();
    }
    catch (e) {
        // Fallback if context is missing (standalone mode)
    }
    const { activeZone, activeSeverity } = monitorState;
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const requestRef = useRef();
    // Calculate initial position
    const getInitialPos = () => {
        const margin = 30;
        let x = margin;
        let y = window.innerHeight - size - margin;
        if (initialX === 'right')
            x = window.innerWidth - size - margin;
        else if (typeof initialX === 'number')
            x = initialX;
        if (initialY === 'top')
            y = margin;
        else if (typeof initialY === 'number')
            y = initialY;
        return { x, y };
    };
    const [position, setPosition] = useState(getInitialPos);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    // Handle Dragging
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };
    const handleMouseMove = useCallback((e) => {
        if (!isDragging)
            return;
        let newX = e.clientX - dragOffset.current.x;
        let newY = e.clientY - dragOffset.current.y;
        // Boundary checks
        const minVisible = 20;
        const maxX = window.innerWidth - minVisible;
        const minX = -size + minVisible;
        const maxY = window.innerHeight - minVisible;
        const minY = -size + minVisible;
        if (newX > maxX)
            newX = maxX;
        if (newX < minX)
            newX = minX;
        if (newY > maxY)
            newY = maxY;
        if (newY < minY)
            newY = minY;
        setPosition({ x: newX, y: newY });
    }, [isDragging, size]);
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);
    // Window Resize Physics (Stress Test Compliance)
    useEffect(() => {
        const handleResize = () => {
            setPosition(prev => {
                const minVisible = 20;
                const maxX = window.innerWidth - minVisible;
                const maxY = window.innerHeight - minVisible;
                let newX = prev.x;
                let newY = prev.y;
                if (newX > maxX)
                    newX = maxX;
                if (newY > maxY)
                    newY = maxY;
                return { x: newX, y: newY };
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        else {
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
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // CONFIG
        const trailLength = 15;
        const particleCount = 35;
        const getThemeColors = () => {
            const styles = getComputedStyle(document.documentElement);
            const c1 = styles.getPropertyValue('--lg-accent').trim() || '#38bdf8';
            const c2 = styles.getPropertyValue('--lg-accent-2').trim() || '#a78bfa';
            const c3 = styles.getPropertyValue('--lg-accent-3').trim() || '#ec4899';
            return [c1, c2, c3];
        };
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
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
            return { x: (size / 2) + x * scale, y: (size / 2) + y * scale };
        }
        let angleX = 0;
        let angleY = 0;
        // We use a ref for the monitor state inside the animation loop 
        // to avoid re-creating the loop on every state change, 
        // but the effect dependency [activeZone, activeSeverity] 
        // will restart the loop naturally, which is fine for this logic.
        const animate = () => {
            if (!containerRef.current)
                return;
            const rect = containerRef.current.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colors = getThemeColors();
            // -- GLOBAL TRUTH LOGIC --
            // Calculate pulse pattern
            const pattern = GlobalTruthLogic.getPulsePattern(activeZone, activeSeverity);
            const speed = pattern.speed;
            const spread = pattern.spread;
            angleY += speed;
            angleX += speed * 0.5;
            const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
            const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
            ctx.globalCompositeOperation = 'lighter';
            const orbRadius = (size / 2) * 0.65 * spread; // Apply spread (pulse)
            particles.forEach((p, index) => {
                let x = p.vx * orbRadius;
                let y = p.vy * orbRadius;
                let z = p.vz * orbRadius;
                // Rotation
                let x1 = x * cosY - z * sinY;
                let z1 = z * cosY + x * sinY;
                x = x1;
                z = z1;
                let y1 = y * cosX - z * sinX;
                let z1_2 = z * cosX + y * sinX;
                y = y1;
                z = z1_2;
                p.history.push({ x, y, z });
                if (p.history.length > trailLength)
                    p.history.shift();
                if (p.history.length > 2) {
                    // Pulse Color Logic?
                    // If critical, maybe flash red?
                    let col = colors[index % 3];
                    if (activeSeverity === 'Critical') {
                        col = (index % 2 === 0) ? '#ef4444' : '#f87171';
                    }
                    else if (activeSeverity === 'High') {
                        col = (index % 2 === 0) ? '#f87171' : col;
                    }
                    ctx.beginPath();
                    ctx.strokeStyle = col;
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([2, 2]);
                    let start = project(p.history[0].x, p.history[0].y, p.history[0].z);
                    ctx.moveTo(start.x, start.y);
                    for (let i = 1; i < p.history.length; i++) {
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
    }, [size, activeZone, activeSeverity]); // Re-bind when monitor state changes
    return (_jsx("div", { ref: containerRef, onMouseDown: handleMouseDown, style: {
            position: 'fixed',
            left: position.x,
            top: position.y,
            width: `${size}px`,
            height: `${size}px`,
            zIndex: 9999,
            cursor: isDragging ? 'grabbing' : 'grab',
            pointerEvents: 'auto',
            transition: isDragging ? 'none' : 'top 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }, title: `Global State Monitor: ${activeZone || 'Idle'} / ${activeSeverity || 'Normal'}`, children: _jsx("canvas", { ref: canvasRef, style: { width: '100%', height: '100%', pointerEvents: 'none' } }) }));
}
