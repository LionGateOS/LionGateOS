// LionGateOS Edge Tracer Module
// Handles panel perimeter highlights with glow and timing rules

class EdgeTracer {
    constructor(panel, options = {}) {
        this.panel = panel;
        this.glowColor = options.glowColor || 'rgba(110,120,255,0.5)';
        this.duration = options.duration || 60000; // 60 seconds max
        this.maxConcurrent = options.maxConcurrent || 2;
        this.traces = [];
        this.activeTraces = 0;

        // Create canvas overlay
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = 50;
        panel.style.position = 'relative';
        panel.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // Resize canvas on window/panel resize
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.panel.offsetWidth;
        this.canvas.height = this.panel.offsetHeight;
    }

    startTrace() {
        if (this.activeTraces >= this.maxConcurrent) return;
        this.activeTraces++;
        const trace = {
            startTime: performance.now(),
            duration: this.duration
        };
        this.traces.push(trace);
        requestAnimationFrame((t) => this.animate(t, trace));
    }

    animate(timestamp, trace) {
        const elapsed = timestamp - trace.startTime;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw all active traces
        this.traces = this.traces.filter(tr => (timestamp - tr.startTime) < tr.duration);
        for (let tr of this.traces) {
            const progress = (timestamp - tr.startTime) / tr.duration;
            this.drawTrace(progress);
        }

        if ((timestamp - trace.startTime) < trace.duration) {
            requestAnimationFrame((t) => this.animate(t, trace));
        } else {
            this.activeTraces--;
        }
    }

    drawTrace(progress) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.save();
        ctx.strokeStyle = this.glowColor;
        ctx.lineWidth = 3;
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();

        // Move along perimeter clockwise
        const perimeter = 2 * (w + h);
        let distance = perimeter * progress;

        // Top edge
        if (distance <= w) {
            ctx.moveTo(distance, 0);
            ctx.lineTo(distance + 20, 0);
        }
        distance -= w;
        if (distance > 0 && distance <= h) {
            ctx.moveTo(w, distance);
            ctx.lineTo(w, Math.min(distance + 20, h));
        }
        distance -= h;
        if (distance > 0 && distance <= w) {
            ctx.moveTo(w - distance, h);
            ctx.lineTo(Math.max(w - distance - 20, 0), h);
        }
        distance -= w;
        if (distance > 0 && distance <= h) {
            ctx.moveTo(0, h - distance);
            ctx.lineTo(0, Math.max(h - distance - 20, 0));
        }

        ctx.stroke();
        ctx.restore();
    }
}

/* Usage Example */

// Select a panel (any container div)
const panel = document.querySelector('.card');

// Create an EdgeTracer instance
const tracer = new EdgeTracer(panel, { glowColor: 'rgba(110,120,255,0.6)', duration: 60000 });

// Start a trace manually or on hover
panel.addEventListener('mouseenter', () => tracer.startTrace());

