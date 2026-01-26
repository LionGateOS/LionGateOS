// LionGateOS Particle Layer Module — Final Speed Adjustment

/* CSS for canvas (optional if not already in CSS) */
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
        const totalParticles = this.count;
        for (let i=0; i<totalParticles; i++) {
            this.particles.push(this.spawnParticle());
        }
    }

    spawnParticle() {
        return {
            x: Math.random()*this.canvas.width,
            y: Math.random()*this.canvas.height,
            r: Math.random()*1.5+0.5,
            vx: (Math.random()-0.5)*0.5*0.64, // Reduced speed by extra 20%
            vy: (Math.random()-0.5)*0.5*0.64, // Reduced speed by extra 20%
            a: Math.random()*0.5+0.1,
            tw: Math.random()*Math.PI*2,
            ph: Math.random()*Math.PI*2,
            glow: Math.random() * 0.5 + 0.2,
            color: ["#6e78ff","#a0a8ff","#ff95a0","#ffd580","#a0ffc8"][Math.floor(Math.random()*5)]
        };
    }

    animate() {
        const ctx = this.ctx;
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        for (let p of this.particles) {
            p.x += p.vx + Math.sin(p.tw)*0.2;
            p.y += p.vy + Math.sin(p.ph)*0.2;
            p.tw += 0.01;
            p.ph += 0.01;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fillStyle = `rgba(${this.hexToRgb(p.color)},${p.a})`;
            ctx.shadowBlur = p.glow * 10;
            ctx.shadowColor = p.color;
            ctx.fill();

            if(p.y < 0 || p.y > this.canvas.height || p.x < 0 || p.x > this.canvas.width){
                Object.assign(p, this.spawnParticle());
            }
        }
        requestAnimationFrame(() => this.animate());
    }

    hexToRgb(hex) {
        const bigint = parseInt(hex.replace("#",""),16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r},${g},${b}`;
    }
}

/* Usage Example */
// new ParticleLayer(document.body, 140, false); // background layer
// new ParticleLayer(document.body, 140, true);  // foreground layer
