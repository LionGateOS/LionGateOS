// LionGateOS Particle Layer Module
// Reusable JS + CSS for sparks and particle dynamics

/* CSS (can be included in <style> or a .css file) */
const sparkCSS = `
#sparkCanvas, #sparkCanvasFront {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 30;
}
`; 
document.head.insertAdjacentHTML('beforeend', `<style>${sparkCSS}</style>`);

/* JS Particle Module */
class ParticleLayer {
    constructor(container=document.body, count=140, frontLayer=false) {
        this.container = container;
        this.count = count;
        this.frontLayer = frontLayer;
        this.canvas = document.createElement('canvas');
        this.canvas.id = frontLayer ? 'sparkCanvasFront' : 'sparkCanvas';
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.initParticles();
        requestAnimationFrame(() => this.animate());
    }

    resize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }

    initParticles() {
        for (let i=0; i<this.count; i++) {
            this.particles.push(this.spawnParticle());
        }
    }

    spawnParticle() {
        return {
            x: Math.random()*this.canvas.width,
            y: Math.random()*this.canvas.height,
            r: Math.random()*1.5+0.5,
            vx: (Math.random()-0.5)*0.5,
            vy: Math.random()*1.0+0.2,
            a: Math.random()*0.5+0.1,
            tw: Math.random()*Math.PI*2,
            ph: Math.random()*Math.PI*2
        };
    }

    animate() {
        const ctx = this.ctx;
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        for (let p of this.particles) {
            p.x += p.vx + Math.sin(p.tw)*0.3;
            p.y -= p.vy + Math.sin(p.ph)*0.2;
            p.tw += 0.01;
            p.ph += 0.01;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fillStyle = `rgba(255,255,255,${p.a})`;
            ctx.fill();

            if(p.y < 0 || p.x < 0 || p.x > this.canvas.width){
                Object.assign(p, this.spawnParticle());
                p.y = this.canvas.height;
            }
        }
        requestAnimationFrame(() => this.animate());
    }
}

/* Usage Example */
// new ParticleLayer(document.body, 140, false); // background layer
// new ParticleLayer(document.body, 140, true);  // front layer through cards

/* Optional Edge Trace Notes:
   - For apps implementing perimeter traces, limit each trace to 60s max
   - Maximum 2 concurrent traces per card
   - Edge trace is separate from particle module */
