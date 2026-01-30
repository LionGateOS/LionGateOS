(function() {
  'use strict';

  const $ = (id) => document.getElementById(id);

  const THEME_PRESETS = {
    dark: { bg0:'#060814', bg1:'#0b1024', surface:'rgba(255,255,255,.06)', stroke:'rgba(255,255,255,.12)', text:'rgba(255,255,255,.92)', muted:'rgba(255,255,255,.68)', accent:'#3b82f6', accent2:'#6366f1' },
    light: { bg0:'#f7fafc', bg1:'#e9eef7', surface:'rgba(0,0,0,.06)', stroke:'rgba(0,0,0,.14)', text:'rgba(0,0,0,.92)', muted:'rgba(0,0,0,.66)', accent:'#2563eb', accent2:'#7c3aed' },
    midnight: { bg0:'#0a0e1a', bg1:'#111827', surface:'rgba(99,102,241,.08)', stroke:'rgba(99,102,241,.25)', text:'rgba(255,255,255,.92)', muted:'rgba(255,255,255,.68)', accent:'#60a5fa', accent2:'#818cf8' },
    slate: { bg0:'#0f172a', bg1:'#1e293b', surface:'rgba(148,163,184,.08)', stroke:'rgba(148,163,184,.2)', text:'rgba(255,255,255,.92)', muted:'rgba(255,255,255,.68)', accent:'#38bdf8', accent2:'#a78bfa' },
    ember: { bg0:'#1a0f0a', bg1:'#2d1810', surface:'rgba(249,115,22,.08)', stroke:'rgba(249,115,22,.25)', text:'rgba(255,255,255,.92)', muted:'rgba(255,255,255,.68)', accent:'#f97316', accent2:'#ef4444' },
    cyberpunk: { bg0:'#0d0221', bg1:'#1a0533', surface:'rgba(236,72,153,.1)', stroke:'rgba(236,72,153,.3)', text:'#f0abfc', muted:'rgba(240,171,252,.7)', accent:'#ec4899', accent2:'#06b6d4' },
    ocean: { bg0:'#042f49', bg1:'#083344', surface:'rgba(34,211,238,.08)', stroke:'rgba(34,211,238,.25)', text:'rgba(255,255,255,.92)', muted:'rgba(255,255,255,.68)', accent:'#22d3ee', accent2:'#2dd4bf' },
    forest: { bg0:'#052e16', bg1:'#14532d', surface:'rgba(34,197,94,.1)', stroke:'rgba(34,197,94,.25)', text:'rgba(255,255,255,.92)', muted:'rgba(255,255,255,.68)', accent:'#22c55e', accent2:'#84cc16' },
    sunset: { bg0:'#1c1917', bg1:'#292524', surface:'rgba(251,146,60,.08)', stroke:'rgba(251,146,60,.25)', text:'rgba(255,255,255,.92)', muted:'rgba(255,255,255,.68)', accent:'#fb923c', accent2:'#f43f5e' },
    aurora: { bg0:'#0c1222', bg1:'#0f172a', surface:'rgba(167,139,250,.1)', stroke:'rgba(167,139,250,.25)', text:'rgba(255,255,255,.92)', muted:'rgba(255,255,255,.68)', accent:'#a78bfa', accent2:'#34d399' },
    'neon-city': { bg0:'#0a0a0a', bg1:'#171717', surface:'rgba(250,204,21,.08)', stroke:'rgba(250,204,21,.3)', text:'#fef08a', muted:'rgba(254,240,138,.7)', accent:'#facc15', accent2:'#f472b6' },
    royal: { bg0:'#1e1b4b', bg1:'#312e81', surface:'rgba(199,210,254,.1)', stroke:'rgba(199,210,254,.25)', text:'rgba(255,255,255,.92)', muted:'rgba(255,255,255,.68)', accent:'#c7d2fe', accent2:'#fbbf24' },
    matrix: { bg0:'#000000', bg1:'#0a0f0a', surface:'rgba(0,255,65,.06)', stroke:'rgba(0,255,65,.25)', text:'#00ff41', muted:'rgba(0,255,65,.7)', accent:'#00ff41', accent2:'#39ff14' },
    cherry: { bg0:'#1a0a14', bg1:'#2d1020', surface:'rgba(244,114,182,.08)', stroke:'rgba(244,114,182,.25)', text:'rgba(255,255,255,.92)', muted:'rgba(255,255,255,.68)', accent:'#f472b6', accent2:'#fb7185' },
    ice: { bg0:'#0c1929', bg1:'#172554', surface:'rgba(186,230,253,.08)', stroke:'rgba(186,230,253,.2)', text:'rgba(255,255,255,.92)', muted:'rgba(255,255,255,.68)', accent:'#7dd3fc', accent2:'#bae6fd' }
  };

  const STORAGE = {
    appearance: 'liongateos.appearance.v4',
    particles: 'liongateos.particles.v3',
    tracers: 'liongateos.tracers.v2',
    screensaver: 'liongateos.screensaver.v2',
    modules: 'liongateos.modules.v1',
    frames: 'liongateos.frames.v1',
    ai: 'liongateos.ai.v1'
  };

  const state = {
    particles: { enabled: false, count: 120, speed: 35, distance: 120, brightness: 60, color: '#3b82f6', colorMode: 'single', sizeVar: 3, animationId: null, points: [] },
    tracers: { enabled: false, count: 1, color: '#3b82f6', speed: 50, speedVar: 10, thickness: 4, glow: 60, glowVar: 10, trail: 80, direction: 'clockwise', target: 'perimeter', animationId: null, tracerInstances: [] },
    screensaver: { enabled: false, idleMinutes: 5, type: 'particles', mediaUrl: '', active: false, ssAnimationId: null },
    theme: { preset: 'dark', accent: '#3b82f6', accent2: '#6366f1', bgBase: '#060814', surface: '#0b1024', text: '#ffffff', muted: '#aaaaaa', stroke: '#333333', glow: 100 },
    frames: { style: 'default', radius: 22, glowColor: '#3b82f6', glowIntensity: 0 },
    modules: { calendar: 'apps/Calendar/index.html', budget: 'apps/Budget/index.html', travels: 'apps/LionGateTravels/index.html', rows: 'apps/Rows/index.html', smartquote: 'apps/SmartQuoteAi/index.html' },
    ai: { visible: true, state: 'idle', voiceActive: false }
  };

  // Tab system
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.panel').forEach(p => p.classList.toggle('hidden', p.id !== 'tab-' + target));
      if (target === 'calendar') loadModule('calendar', 'calendarContainer');
      if (target === 'apps') renderAppsGrid();
    });
  });

  // Drawer
  const drawer = $('drawer'), drawerBackdrop = $('drawerBackdrop');
  $('btnAppearance').addEventListener('click', () => { drawer.classList.add('open'); drawerBackdrop.classList.add('open'); });
  $('closeDrawerBtn').addEventListener('click', () => { drawer.classList.remove('open'); drawerBackdrop.classList.remove('open'); });
  drawerBackdrop.addEventListener('click', () => { drawer.classList.remove('open'); drawerBackdrop.classList.remove('open'); });

  // Theme system
  function applyThemePreset(presetName) {
    const preset = THEME_PRESETS[presetName];
    if (!preset) return;
    state.theme.preset = presetName;
    state.theme.accent = preset.accent;
    state.theme.accent2 = preset.accent2;
    state.theme.bgBase = preset.bg0;
    state.theme.surface = preset.bg1;
    $('accentColor').value = preset.accent;
    $('accent2Color').value = preset.accent2;
    $('bgBaseColor').value = preset.bg0;
    $('surfaceColor').value = preset.bg1;
    applyTheme();
  }

  function applyTheme() {
    const root = document.documentElement;
    root.setAttribute('data-theme', state.theme.preset);
    root.style.setProperty('--lg-accent', state.theme.accent);
    root.style.setProperty('--lg-accent2', state.theme.accent2);
    root.style.setProperty('--lg-glow', state.theme.glow / 100);
    const statusTheme = $('statusTheme');
    if (statusTheme) statusTheme.textContent = state.theme.preset.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    broadcastTheme();
    saveState();
  }

  function broadcastTheme() {
    const themeData = { type: 'LIONGATEOS_THEME', theme: state.theme, frames: state.frames };
    document.querySelectorAll('iframe').forEach(iframe => { try { iframe.contentWindow.postMessage(themeData, '*'); } catch(e) {} });
  }

  $('themePreset').addEventListener('change', (e) => applyThemePreset(e.target.value));
  $('accentColor').addEventListener('input', (e) => { state.theme.accent = e.target.value; applyTheme(); });
  $('accent2Color').addEventListener('input', (e) => { state.theme.accent2 = e.target.value; applyTheme(); });
  $('bgBaseColor').addEventListener('input', (e) => { state.theme.bgBase = e.target.value; applyTheme(); });
  $('surfaceColor').addEventListener('input', (e) => { state.theme.surface = e.target.value; applyTheme(); });
  $('textColor').addEventListener('input', (e) => { state.theme.text = e.target.value; applyTheme(); });
  $('mutedColor').addEventListener('input', (e) => { state.theme.muted = e.target.value; applyTheme(); });
  $('strokeColor').addEventListener('input', (e) => { state.theme.stroke = e.target.value; applyTheme(); });
  $('glowStrength').addEventListener('input', (e) => { state.theme.glow = parseInt(e.target.value); applyTheme(); });

  // Panel frames
  function applyFrames() {
    const root = document.documentElement;
    root.style.setProperty('--lg-frame-radius', state.frames.radius + 'px');
    root.style.setProperty('--lg-frame-glow-color', state.frames.glowColor);
    root.style.setProperty('--lg-frame-glow-intensity', state.frames.glowIntensity);
    document.querySelectorAll('.panel, .top').forEach(el => el.setAttribute('data-frame-style', state.frames.style));
    saveState();
  }
  $('frameStyle').addEventListener('change', (e) => { state.frames.style = e.target.value; applyFrames(); });
  $('frameRadius').addEventListener('input', (e) => { state.frames.radius = parseInt(e.target.value); applyFrames(); });
  $('frameGlowColor').addEventListener('input', (e) => { state.frames.glowColor = e.target.value; applyFrames(); });
  $('frameGlowIntensity').addEventListener('input', (e) => { state.frames.glowIntensity = parseInt(e.target.value); applyFrames(); });

  // Background
  const bgLayer = $('lg-background-layer'), bgError = $('lg-bg-error');
  function showBgError(msg) { bgError.textContent = msg; bgError.classList.add('visible'); setTimeout(() => bgError.classList.remove('visible'), 5000); }
  $('bgType').addEventListener('change', (e) => {
    $('bgUrlInput').style.display = e.target.value === 'url' ? 'block' : 'none';
    $('bgUploadInput').style.display = e.target.value === 'upload' ? 'block' : 'none';
    $('bgVideoInput').style.display = e.target.value === 'video' ? 'block' : 'none';
  });
  $('applyBgUrl').addEventListener('click', () => {
    const url = $('bgUrl').value.trim();
    if (!url) return;
    const img = new Image();
    img.onload = () => { bgLayer.style.backgroundImage = 'url(' + url + ')'; bgLayer.classList.add('custom-active'); $('bgPreview').innerHTML = '<img src="' + url + '" alt="Preview">'; saveState(); };
    img.onerror = () => showBgError('Failed to load image: ' + url);
    img.src = url;
  });
  $('applyBgVideo').addEventListener('click', () => {
    const url = $('bgVideoUrl').value.trim();
    if (!url) return;
    bgLayer.innerHTML = '';
    const video = document.createElement('video');
    video.autoplay = true; video.muted = true; video.loop = true; video.playsInline = true;
    video.onerror = () => { showBgError('Failed to load video: ' + url); bgLayer.innerHTML = ''; };
    video.onloadeddata = () => { bgLayer.classList.add('custom-active'); $('bgPreview').innerHTML = '<video src="' + url + '" muted loop autoplay></video>'; saveState(); };
    video.src = url;
    bgLayer.appendChild(video);
  });
  $('bgFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => { bgLayer.style.backgroundImage = 'url(' + event.target.result + ')'; bgLayer.classList.add('custom-active'); $('bgPreview').innerHTML = '<img src="' + event.target.result + '" alt="Preview">'; saveState(); };
      reader.readAsDataURL(file);
    }
  });
  $('bgOpacity').addEventListener('input', (e) => { bgLayer.style.opacity = e.target.value / 100; saveState(); });
  $('resetBg').addEventListener('click', () => {
    bgLayer.classList.remove('custom-active'); bgLayer.style.backgroundImage = ''; bgLayer.style.opacity = 1; bgLayer.innerHTML = '';
    $('bgPreview').innerHTML = '<span>Background Preview</span>'; $('bgType').value = 'default'; $('bgUrl').value = ''; $('bgVideoUrl').value = ''; $('bgOpacity').value = 100; saveState();
  });

  // Particles
  const particlesCanvas = $('lg-particles'), particlesCtx = particlesCanvas ? particlesCanvas.getContext('2d') : null;
  function initParticles() {
    if (!particlesCanvas) return;
    particlesCanvas.width = window.innerWidth; particlesCanvas.height = window.innerHeight;
    state.particles.points = [];
    for (let i = 0; i < state.particles.count; i++) {
      state.particles.points.push({ x: Math.random() * particlesCanvas.width, y: Math.random() * particlesCanvas.height, vx: (Math.random() - 0.5) * (state.particles.speed / 50), vy: (Math.random() - 0.5) * (state.particles.speed / 50), size: 1 + Math.random() * state.particles.sizeVar, hue: Math.random() * 360 });
    }
  }
  function getParticleColor(p, i) {
    if (state.particles.colorMode === 'rainbow') return 'hsl(' + ((p.hue + Date.now() * 0.02) % 360) + ', 80%, 60%)';
    if (state.particles.colorMode === 'gradient') return (i / state.particles.points.length) < 0.5 ? state.theme.accent : state.theme.accent2;
    return state.particles.color;
  }
  function animateParticles() {
    if (!state.particles.enabled || !particlesCtx) return;
    const w = particlesCanvas.width, h = particlesCanvas.height, ctx = particlesCtx;
    ctx.clearRect(0, 0, w, h);
    const alpha = state.particles.brightness / 100, dist = state.particles.distance;
    state.particles.points.forEach((p, i) => {
      p.x += p.vx * (state.particles.speed / 25); p.y += p.vy * (state.particles.speed / 25);
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      p.x = Math.max(0, Math.min(w, p.x)); p.y = Math.max(0, Math.min(h, p.y));
      const color = getParticleColor(p, i);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = color; ctx.globalAlpha = alpha; ctx.fill();
      for (let j = i + 1; j < state.particles.points.length; j++) {
        const p2 = state.particles.points[j], dx = p.x - p2.x, dy = p.y - p2.y, d = Math.sqrt(dx*dx + dy*dy);
        if (d < dist) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.strokeStyle = color; ctx.globalAlpha = alpha * (1 - d/dist) * 0.5; ctx.lineWidth = 0.5; ctx.stroke(); }
      }
    });
    ctx.globalAlpha = 1;
    state.particles.animationId = requestAnimationFrame(animateParticles);
  }
  function startParticles() { if (!particlesCanvas) return; state.particles.enabled = true; particlesCanvas.classList.add('active'); initParticles(); animateParticles(); $('particlesToggle').classList.add('active'); $('statusParticles').textContent = 'On'; saveState(); }
  function stopParticles() { state.particles.enabled = false; if (state.particles.animationId) { cancelAnimationFrame(state.particles.animationId); state.particles.animationId = null; } if (particlesCtx) particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height); particlesCanvas.classList.remove('active'); $('particlesToggle').classList.remove('active'); $('statusParticles').textContent = 'Off'; saveState(); }
  $('particlesToggle').addEventListener('click', () => { state.particles.enabled ? stopParticles() : startParticles(); });
  $('particleCount').addEventListener('input', (e) => { state.particles.count = parseInt(e.target.value); if (state.particles.enabled) initParticles(); saveState(); });
  $('particleSpeed').addEventListener('input', (e) => { state.particles.speed = parseInt(e.target.value); saveState(); });
  $('particleDistance').addEventListener('input', (e) => { state.particles.distance = parseInt(e.target.value); saveState(); });
  $('particleBrightness').addEventListener('input', (e) => { state.particles.brightness = parseInt(e.target.value); saveState(); });
  $('particleSizeVar').addEventListener('input', (e) => { state.particles.sizeVar = parseInt(e.target.value); if (state.particles.enabled) initParticles(); saveState(); });
  $('particleColorMode').addEventListener('change', (e) => { state.particles.colorMode = e.target.value; $('particleColorLabel').style.display = e.target.value === 'single' ? 'flex' : 'none'; saveState(); });
  $('particleColor').addEventListener('input', (e) => { state.particles.color = e.target.value; saveState(); });
  window.addEventListener('resize', () => { if (particlesCanvas) { particlesCanvas.width = window.innerWidth; particlesCanvas.height = window.innerHeight; if (state.particles.enabled) initParticles(); } if (tracersCanvas) { tracersCanvas.width = window.innerWidth; tracersCanvas.height = window.innerHeight; } });

  // Tracers
  const tracersCanvas = $('lg-tracers'), tracersCtx = tracersCanvas ? tracersCanvas.getContext('2d') : null;
  function initTracers() {
    state.tracers.tracerInstances = [];
    for (let i = 0; i < state.tracers.count; i++) {
      const dir = state.tracers.direction === 'random' ? (Math.random() > 0.5 ? 1 : -1) : (state.tracers.direction === 'clockwise' ? 1 : -1);
      state.tracers.tracerInstances.push({ position: Math.random() * 1000, direction: dir, speedMod: 1 + (Math.random() - 0.5) * (state.tracers.speedVar / 50), glowMod: 1 + (Math.random() - 0.5) * (state.tracers.glowVar / 50) });
    }
  }
  function animateTracers() {
    if (!state.tracers.enabled || !tracersCtx) return;
    const w = tracersCanvas.width, h = tracersCanvas.height, ctx = tracersCtx;
    const margin = 14, innerW = w - margin * 2, innerH = h - margin * 2;
    const r = Math.min(state.frames.radius, innerW / 2, innerH / 2);
    const straightH = innerH - 2 * r, straightW = innerW - 2 * r, arcLen = Math.PI / 2 * r;
    const perimeter = 2 * straightW + 2 * straightH + 2 * Math.PI * r;
    ctx.clearRect(0, 0, w, h);
    const segs = [straightW, arcLen, straightH, arcLen, straightW, arcLen, straightH, arcLen];
    function getPoint(p) {
      p = ((p % perimeter) + perimeter) % perimeter;
      let seg = 0, acc = 0;
      for (; seg < 8; seg++) { if (p < acc + segs[seg]) break; acc += segs[seg]; }
      const t = p - acc;
      switch (seg) {
        case 0: return { x: margin + r + t, y: margin };
        case 1: { const a = -Math.PI / 2 + (t / r); return { x: margin + innerW - r + Math.cos(a) * r, y: margin + r + Math.sin(a) * r }; }
        case 2: return { x: margin + innerW, y: margin + r + t };
        case 3: { const a = 0 + (t / r); return { x: margin + innerW - r + Math.cos(a) * r, y: margin + innerH - r + Math.sin(a) * r }; }
        case 4: return { x: margin + innerW - r - t, y: margin + innerH };
        case 5: { const a = Math.PI / 2 + (t / r); return { x: margin + r + Math.cos(a) * r, y: margin + innerH - r + Math.sin(a) * r }; }
        case 6: return { x: margin, y: margin + innerH - r - t };
        case 7: { const a = Math.PI + (t / r); return { x: margin + r + Math.cos(a) * r, y: margin + r + Math.sin(a) * r }; }
        default: return { x: margin + r, y: margin };
      }
    }
    state.tracers.tracerInstances.forEach(tracer => {
      tracer.position += (state.tracers.speed / 10) * tracer.speedMod * tracer.direction;
      if (tracer.position > perimeter) tracer.position = 0;
      if (tracer.position < 0) tracer.position = perimeter;
      const pos = tracer.position, trail = state.tracers.trail, thickness = state.tracers.thickness, glowIntensity = state.tracers.glow * tracer.glowMod;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (glowIntensity > 0) { ctx.shadowColor = state.tracers.color; ctx.shadowBlur = glowIntensity / 3; }
      for (let i = 0; i < trail; i++) {
        const alpha = 1 - (i / trail), p1 = getPoint(pos - i * tracer.direction), p2 = getPoint(pos - (i + 1) * tracer.direction);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.strokeStyle = state.tracers.color; ctx.globalAlpha = alpha * 0.8; ctx.lineWidth = thickness * (1 - i / trail * 0.5); ctx.stroke();
      }
      const head = getPoint(pos);
      ctx.beginPath(); ctx.arc(head.x, head.y, thickness * 1.5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.globalAlpha = 1; ctx.fill(); ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;
    state.tracers.animationId = requestAnimationFrame(animateTracers);
  }
  function startTracers() { if (!tracersCanvas) return; tracersCanvas.width = window.innerWidth; tracersCanvas.height = window.innerHeight; state.tracers.enabled = true; tracersCanvas.classList.add('active'); initTracers(); animateTracers(); $('tracersToggle').classList.add('active'); $('statusTracers').textContent = 'On'; saveState(); }
  function stopTracers() { state.tracers.enabled = false; if (state.tracers.animationId) { cancelAnimationFrame(state.tracers.animationId); state.tracers.animationId = null; } if (tracersCtx) tracersCtx.clearRect(0, 0, tracersCanvas.width, tracersCanvas.height); tracersCanvas.classList.remove('active'); $('tracersToggle').classList.remove('active'); $('statusTracers').textContent = 'Off'; saveState(); }
  $('tracersToggle').addEventListener('click', () => { state.tracers.enabled ? stopTracers() : startTracers(); });
  $('tracerCount').addEventListener('input', (e) => { state.tracers.count = parseInt(e.target.value); if (state.tracers.enabled) initTracers(); saveState(); });
  $('tracerColor').addEventListener('input', (e) => { state.tracers.color = e.target.value; saveState(); });
  $('tracerSpeed').addEventListener('input', (e) => { state.tracers.speed = parseInt(e.target.value); saveState(); });
  $('tracerSpeedVar').addEventListener('input', (e) => { state.tracers.speedVar = parseInt(e.target.value); if (state.tracers.enabled) initTracers(); saveState(); });
  $('tracerThickness').addEventListener('input', (e) => { state.tracers.thickness = parseInt(e.target.value); saveState(); });
  $('tracerGlow').addEventListener('input', (e) => { state.tracers.glow = parseInt(e.target.value); saveState(); });
  $('tracerGlowVar').addEventListener('input', (e) => { state.tracers.glowVar = parseInt(e.target.value); if (state.tracers.enabled) initTracers(); saveState(); });
  $('tracerTrail').addEventListener('input', (e) => { state.tracers.trail = parseInt(e.target.value); saveState(); });
  $('tracerDirection').addEventListener('change', (e) => { state.tracers.direction = e.target.value; if (state.tracers.enabled) initTracers(); saveState(); });
  $('tracerTarget').addEventListener('change', (e) => { state.tracers.target = e.target.value; saveState(); });

  // Screensaver
  const screensaverEl = $('lg-screensaver');
  let lastActivityTime = Date.now();
  function resetIdleTimer() { lastActivityTime = Date.now(); if (state.screensaver.active) deactivateScreensaver(); }
  function checkIdle() { if (!state.screensaver.enabled || state.screensaver.active) return; const idleMs = Date.now() - lastActivityTime; if (idleMs >= state.screensaver.idleMinutes * 60 * 1000) activateScreensaver(); }
  document.addEventListener('mousemove', resetIdleTimer);
  document.addEventListener('keydown', resetIdleTimer);
  document.addEventListener('click', resetIdleTimer);
  document.addEventListener('scroll', resetIdleTimer);
  document.addEventListener('touchstart', resetIdleTimer);
  setInterval(checkIdle, 1000);

  function activateScreensaver() {
    state.screensaver.active = true;
    screensaverEl.innerHTML = '';
    if (state.screensaver.type === 'particles') {
      const ssCanvas = document.createElement('canvas');
      ssCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
      screensaverEl.appendChild(ssCanvas);
      ssCanvas.width = window.innerWidth; ssCanvas.height = window.innerHeight;
      const ssCtx = ssCanvas.getContext('2d'), ssParticles = [];
      for (let i = 0; i < 150; i++) ssParticles.push({ x: Math.random() * ssCanvas.width, y: Math.random() * ssCanvas.height, vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5, size: Math.random() * 3 + 1, hue: Math.random() * 360 });
      function animateSSParticles() {
        if (!state.screensaver.active) return;
        ssCtx.fillStyle = 'rgba(0,0,0,0.1)'; ssCtx.fillRect(0, 0, ssCanvas.width, ssCanvas.height);
        ssParticles.forEach((p, i) => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > ssCanvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > ssCanvas.height) p.vy *= -1;
          const color = state.particles.colorMode === 'rainbow' ? 'hsl(' + ((p.hue + Date.now() * 0.02) % 360) + ', 80%, 60%)' : (state.particles.color || '#3b82f6');
          ssCtx.beginPath(); ssCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ssCtx.fillStyle = color; ssCtx.fill();
          for (let j = i + 1; j < ssParticles.length; j++) {
            const p2 = ssParticles[j], d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
            if (d < 150) { ssCtx.beginPath(); ssCtx.moveTo(p.x, p.y); ssCtx.lineTo(p2.x, p2.y); ssCtx.strokeStyle = color; ssCtx.globalAlpha = (1 - d / 150) * 0.4; ssCtx.lineWidth = 0.5; ssCtx.stroke(); ssCtx.globalAlpha = 1; }
          }
        });
        state.screensaver.ssAnimationId = requestAnimationFrame(animateSSParticles);
      }
      animateSSParticles();
    } else if (state.screensaver.type === 'clock') {
      const clockDiv = document.createElement('div'); clockDiv.className = 'ss-clock'; screensaverEl.appendChild(clockDiv);
      function updateClock() { if (!state.screensaver.active) return; clockDiv.textContent = new Date().toLocaleTimeString(); setTimeout(updateClock, 1000); }
      updateClock();
    } else if (state.screensaver.type === 'video' && state.screensaver.mediaUrl) {
      const video = document.createElement('video'); video.autoplay = true; video.muted = true; video.loop = true; video.src = state.screensaver.mediaUrl; screensaverEl.appendChild(video);
    } else if (state.screensaver.type === 'image' && state.screensaver.mediaUrl) {
      const img = document.createElement('img'); img.src = state.screensaver.mediaUrl; screensaverEl.appendChild(img);
    }
    const hint = document.createElement('div'); hint.className = 'ss-dismiss-hint'; hint.textContent = 'Move mouse or press any key to dismiss'; screensaverEl.appendChild(hint);
    screensaverEl.classList.add('active'); $('stopScreensaver').style.display = 'block'; $('statusScreensaver').textContent = 'Active';
  }
  function deactivateScreensaver() { state.screensaver.active = false; screensaverEl.classList.remove('active'); screensaverEl.innerHTML = ''; if (state.screensaver.ssAnimationId) { cancelAnimationFrame(state.screensaver.ssAnimationId); state.screensaver.ssAnimationId = null; } $('stopScreensaver').style.display = 'none'; $('statusScreensaver').textContent = state.screensaver.enabled ? 'Enabled' : 'Disabled'; lastActivityTime = Date.now(); }
  screensaverEl.addEventListener('click', deactivateScreensaver);
  screensaverEl.addEventListener('mousemove', deactivateScreensaver);
  $('screensaverToggle').addEventListener('click', () => { state.screensaver.enabled = !state.screensaver.enabled; $('screensaverToggle').classList.toggle('active', state.screensaver.enabled); $('statusScreensaver').textContent = state.screensaver.enabled ? 'Enabled' : 'Disabled'; saveState(); });
  $('screensaverTime').addEventListener('change', (e) => { state.screensaver.idleMinutes = parseInt(e.target.value) || 5; saveState(); });
  $('screensaverType').addEventListener('change', (e) => { state.screensaver.type = e.target.value; $('screensaverMediaInput').style.display = ['video', 'image'].includes(e.target.value) ? 'block' : 'none'; saveState(); });
  $('applyScreensaverUrl').addEventListener('click', () => { state.screensaver.mediaUrl = $('screensaverUrl').value.trim(); saveState(); });
  $('testScreensaver').addEventListener('click', () => activateScreensaver());
  $('stopScreensaver').addEventListener('click', () => deactivateScreensaver());

  // Module loading
  function loadModule(moduleName, containerId) {
    const container = $(containerId);
    if (!container) return;
    const path = state.modules[moduleName];
    if (!path) { container.innerHTML = '<div class="module-error"><div class="error-icon">⚠️</div><div>Module path not configured</div><div class="error-path">' + moduleName + '</div></div>'; return; }
    const iframe = document.createElement('iframe');
    iframe.className = 'module-frame';
    iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups';
    iframe.onerror = () => { container.innerHTML = '<div class="module-error"><div class="error-icon">❌</div><div>Failed to load module</div><div class="error-path">' + path + '</div></div>'; };
    iframe.onload = () => { try { broadcastTheme(); } catch(e) {} };
    iframe.src = path;
    container.innerHTML = '';
    container.appendChild(iframe);
  }
  function renderAppsGrid() {
    const grid = $('appsGrid');
    if (!grid) return;
    const apps = [
      { id: 'calendar', name: 'Calendar', desc: 'Schedule and event management', path: state.modules.calendar },
      { id: 'budget', name: 'Budget', desc: 'Personal finance tracking', path: state.modules.budget },
      { id: 'travels', name: 'LionGate Travels', desc: 'Travel planning and booking', path: state.modules.travels },
      { id: 'rows', name: 'Rows', desc: 'Data grid and spreadsheets', path: state.modules.rows },
      { id: 'smartquote', name: 'SmartQuoteAI', desc: 'AI-powered quoting system', path: state.modules.smartquote }
    ];
    grid.innerHTML = apps.map(app => '<div class="app-card" data-app="' + app.id + '" data-path="' + app.path + '"><h3>' + app.name + '</h3><p>' + app.desc + '</p><div class="status">Click to open</div></div>').join('');
    grid.querySelectorAll('.app-card').forEach(card => { card.addEventListener('click', () => window.open(card.dataset.path, '_blank')); });
  }
  $('pathCalendar').addEventListener('change', (e) => { state.modules.calendar = e.target.value; saveState(); });
  $('pathBudget').addEventListener('change', (e) => { state.modules.budget = e.target.value; saveState(); });
  $('pathTravels').addEventListener('change', (e) => { state.modules.travels = e.target.value; saveState(); });
  $('pathRows').addEventListener('change', (e) => { state.modules.rows = e.target.value; saveState(); });
  $('pathSmartQuote').addEventListener('change', (e) => { state.modules.smartquote = e.target.value; saveState(); });
  $('reloadModules').addEventListener('click', () => { const activeTab = document.querySelector('.tab.active'); if (activeTab) { const target = activeTab.dataset.tab; if (target === 'calendar') loadModule('calendar', 'calendarContainer'); if (target === 'apps') renderAppsGrid(); } });

  // Splash
  const splashOverlay = $('splashOverlay'), splashVideo = $('splashVideo');
  let splashDismissed = false;
  function dismissSplash() { if (splashDismissed) return; splashDismissed = true; if (splashOverlay) { splashOverlay.style.opacity = '0'; splashOverlay.style.pointerEvents = 'none'; setTimeout(() => { try { splashOverlay.remove(); } catch(e) {} }, 500); } }
  document.addEventListener('click', dismissSplash);
  document.addEventListener('keydown', dismissSplash);
  document.addEventListener('touchstart', dismissSplash);
  if (splashVideo) { splashVideo.addEventListener('ended', dismissSplash); splashVideo.addEventListener('error', dismissSplash); }
  setTimeout(dismissSplash, 5000);
  $('splashDim').addEventListener('input', (e) => { document.documentElement.style.setProperty('--lg-splash-dim', e.target.value / 100); saveState(); });
  $('splashBlur').addEventListener('input', (e) => { document.documentElement.style.setProperty('--lg-splash-blur', e.target.value + 'px'); saveState(); });

  // Auth modal
  const authModal = $('authModal'), authTabs = document.querySelectorAll('.auth-tab');
  $('btnSignIn').addEventListener('click', () => authModal.classList.add('open'));
  $('authCancel').addEventListener('click', () => authModal.classList.remove('open'));
  $('authSubmit').addEventListener('click', () => { alert('Auth integration coming soon.'); authModal.classList.remove('open'); });
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      authTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active');
      const mode = tab.dataset.auth;
      $('authTitle').textContent = mode === 'signup' ? 'Create Account' : 'Welcome';
      $('authSubtitle').textContent = mode === 'signup' ? 'Sign up to access your workspace' : 'Sign in to access your workspace';
      $('authSignupFields').style.display = mode === 'signup' ? 'block' : 'none';
      $('authSubmit').textContent = mode === 'signup' ? 'Create Account' : 'Continue';
    });
  });

  // AI orb
  const aiContainer = $('aiContainer'), aiOrb = $('aiOrb');
  let aiLottie = null;
  try {
    if (typeof lottie !== 'undefined') {
      const lottieEl = document.getElementById('aiLottieContainer');
      if (lottieEl) {
        aiLottie = lottie.loadAnimation({
          container: lottieEl,
          renderer: 'canvas',
          loop: true,
          autoplay: true,
          animationData: {"nm":"Image Playground Animation","ddd":0,"h":425,"w":425,"meta":{"g":"LottieFiles Figma v70"},"layers":[{"ty":0,"nm":"Group 1321319189","sr":1,"st":0,"op":253,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,"ks":{"a":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[96.25,98.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[112.74,96.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":162},{"s":[96.25,98.5],"t":252}]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[211.75,212.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[210.26,212.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[212.73,212.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[212.73,212.5],"t":162},{"s":[211.75,212.5],"t":252}]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"w":425,"h":425,"refId":"1","ind":1},{"ty":4,"nm":"BLUR L","sr":1,"st":0,"op":253,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,"ks":{"a":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[96,98.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[113,96.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.5,111.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.5,111.5],"t":162},{"s":[96,98.5],"t":252}]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[213.5,215],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[212.5,215],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[215,215],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[215,215],"t":162},{"s":[213.5,215],"t":252}]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"ef":[{"ty":29,"nm":"","en":1,"ef":[{"ty":0,"nm":"sigma","v":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[17.100000381469727],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[17.100000381469727],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[17.100000381469727],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[17.100000381469727],"t":162},{"s":[17.100000381469727],"t":252}]}},{"ty":0,"nm":"","v":{"a":0,"k":1}},{"ty":0,"nm":"","v":{"a":0,"k":0}}]}],"shapes":[{"ty":"sh","bm":0,"hd":false,"nm":"","d":1,"ks":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[50.38286458333333,0],[0,50.21238578680204],[-50.38286458333333,0],[0,-50.21238578680204]],"o":[[0,50.21238578680204],[-37.79932291666667,0],[0,-76.18598984771575],[50.38286458333333,0],[0,0]],"v":[[187,89.90862944162437],[80.14703125000001,192],[0,114.79065989847716],[99.80151041666667,0],[187,89.90862944162437]]}],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[59.552654867256635,0],[0,49.16248704663212],[-59.552654867256635,0],[0,-49.17222797927461]],"o":[[0,49.17222797927461],[-44.67915929203539,0],[0,-74.60580310880829],[59.552654867256635,0],[0,0]],"v":[[221,88.02880829015545],[94.7170796460177,188],[0,112.40062176165803],[117.94163716814158,0],[221,88.02880829015545]]}],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[52.81273631840796,0],[0,57.012376681614356],[-52.81273631840796,0],[0,-57.012376681614356]],"o":[[0,57.012376681614356],[-39.619303482587064,0],[0,-86.50591928251121],[52.81273631840796,0],[0,0]],"v":[[196,102.07874439461884],[83.99721393034827,218],[0,130.34053811659194],[104.60159203980099,0],[196,102.07874439461884]]}],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[52.81273631840796,0],[0,57.012376681614356],[-52.81273631840796,0],[0,-57.012376681614356]],"o":[[0,57.012376681614356],[-39.619303482587064,0],[0,-86.50591928251121],[52.81273631840796,0],[0,0]],"v":[[196,102.07874439461884],[83.99721393034827,218],[0,130.34053811659194],[104.60159203980099,0],[196,102.07874439461884]]}],"t":162},{"s":[{"c":true,"i":[[0,0],[50.38286458333333,0],[0,50.21238578680204],[-50.38286458333333,0],[0,-50.21238578680204]],"o":[[0,50.21238578680204],[-37.79932291666667,0],[0,-76.18598984771575],[50.38286458333333,0],[0,0]],"v":[[187,89.90862944162437],[80.14703125000001,192],[0,114.79065989847716],[99.80151041666667,0],[187,89.90862944162437]]}],"t":252}]}},{"ty":"gs","bm":0,"hd":false,"nm":"","e":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[305.6639643635242,217.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[354.1564121246338,45],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[477.2239990234375,-56],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[477.2239990234375,-56],"t":162},{"s":[305.6639643635242,217.5],"t":252}]},"g":{"p":4,"k":{"a":0,"k":[0.0,0.0,1.0,1.0,0.33,1.0,0.0,1.0,0.66,0.749,0.0,1.0,1.0,0.0,1.0,1.0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[88.81410217285156,217.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[33.23240089416504,45],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[133,-56],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[133,-56],"t":162},{"s":[88.81410217285156,217.5],"t":252}]},"lc":1,"lj":1,"ml":4,"o":{"a":0,"k":100},"w":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[5],"t":162},{"s":[5],"t":252}]}}],"ind":2},{"ty":4,"nm":"BLUR X","sr":1,"st":0,"op":253,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,"ks":{"a":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[96,98.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[113,96.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.5,111.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.5,111.5],"t":162},{"s":[96,98.5],"t":252}]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[218,219.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[217,219.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[219.5,219.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[219.5,219.5],"t":162},{"s":[218,219.5],"t":252}]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"ef":[{"ty":29,"nm":"","en":1,"ef":[{"ty":0,"nm":"sigma","v":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[30.200000762939453],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[30.200000762939453],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[30.200000762939453],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[30.200000762939453],"t":162},{"s":[30.200000762939453],"t":252}]}},{"ty":0,"nm":"","v":{"a":0,"k":1}},{"ty":0,"nm":"","v":{"a":0,"k":0}}]}],"shapes":[{"ty":"sh","bm":0,"hd":false,"nm":"","d":1,"ks":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[47.95802083333333,0],[0,47.85868020304569],[-47.95802083333333,0],[0,-47.85868020304569]],"o":[[0,47.85868020304569],[-35.98010416666667,0],[0,-72.61477157360406],[47.95802083333333,0],[0,0]],"v":[[178,85.69416243654823],[76.28968750000001,183],[0,109.40984771573605],[94.99822916666668,0],[178,85.69416243654823]]}],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[57.127433628318585,0],[0,46.80896373056994],[-57.127433628318585,0],[0,-46.81823834196891]],"o":[[0,46.81823834196891],[-42.85964601769911,0],[0,-71.03424870466321],[57.127433628318585,0],[0,0]],"v":[[212,83.81466321243524],[90.85982300884956,179],[0,107.01974093264248],[113.13858407079645,0],[212,83.81466321243524]]}],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[50.387661691542284,0],[0,54.65865470852018],[-50.387661691542284,0],[0,-54.65865470852018]],"o":[[0,54.65865470852018],[-37.80004975124378,0],[0,-82.93457399103139],[50.387661691542284,0],[0,0]],"v":[[187,97.86448430493274],[80.14019900497513,209],[0,124.95950672645742],[99.79845771144278,0],[187,97.86448430493274]]}],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[50.387661691542284,0],[0,54.65865470852018],[-50.387661691542284,0],[0,-54.65865470852018]],"o":[[0,54.65865470852018],[-37.80004975124378,0],[0,-82.93457399103139],[50.387661691542284,0],[0,0]],"v":[[187,97.86448430493274],[80.14019900497513,209],[0,124.95950672645742],[99.79845771144278,0],[187,97.86448430493274]]}],"t":162},{"s":[{"c":true,"i":[[0,0],[47.95802083333333,0],[0,47.85868020304569],[-47.95802083333333,0],[0,-47.85868020304569]],"o":[[0,47.85868020304569],[-35.98010416666667,0],[0,-72.61477157360406],[47.95802083333333,0],[0,0]],"v":[[178,85.69416243654823],[76.28968750000001,183],[0,109.40984771573605],[94.99822916666668,0],[178,85.69416243654823]]}],"t":252}]}},{"ty":"gs","bm":0,"hd":false,"nm":"","e":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[382.76933904347686,283.989013671875],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[381.65821456909174,74.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[339.885986328125,17.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[339.885986328125,17.5],"t":162},{"s":[382.76933904347686,283.989013671875],"t":252}]},"g":{"p":4,"k":{"a":0,"k":[0.0,0.749,0.0,1.0,0.33,0.0,1.0,1.0,0.66,1.0,0.0,1.0,1.0,0.749,0.0,1.0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[81.47260284423828,283.989013671875],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[-20.356800079345703,74.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[67.5,17.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[67.5,17.5],"t":162},{"s":[81.47260284423828,283.989013671875],"t":252}]},"lc":1,"lj":1,"ml":4,"o":{"a":0,"k":100},"w":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[14],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[14],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[14],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[14],"t":162},{"s":[14],"t":252}]}}],"ind":3},{"ty":4,"nm":"BLUR XL","sr":1,"st":0,"op":253,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,"ks":{"a":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[96,98.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[113,96.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.5,111.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.5,111.5],"t":162},{"s":[96,98.5],"t":252}]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[222,223.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[221,223.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[223.5,223.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[223.5,223.5],"t":162},{"s":[222,223.5],"t":252}]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"ef":[{"ty":29,"nm":"","en":1,"ef":[{"ty":0,"nm":"sigma","v":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[108.5999984741211],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[108.5999984741211],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[108.5999984741211],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[108.5999984741211],"t":162},{"s":[108.5999984741211],"t":252}]}},{"ty":0,"nm":"","v":{"a":0,"k":1}},{"ty":0,"nm":"","v":{"a":0,"k":0}}]}],"shapes":[{"ty":"sh","bm":0,"hd":false,"nm":"","d":1,"ks":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[45.80260416666666,0],[0,45.766497461928935],[-45.80260416666666,0],[0,-45.766497461928935]],"o":[[0,45.766497461928935],[-34.36302083333334,0],[0,-69.44035532994924],[45.80260416666666,0],[0,0]],"v":[[170,81.94796954314721],[72.8609375,175],[0,104.6269035532995],[90.72864583333333,0],[170,81.94796954314721]]}],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[54.9716814159292,0],[0,44.71694300518135],[-54.9716814159292,0],[0,-44.725803108808286]],"o":[[0,44.725803108808286],[-41.242300884955746,0],[0,-67.85953367875648],[54.9716814159292,0],[0,0]],"v":[[204,80.06875647668394],[87.43115044247787,171],[0,102.23673575129534],[108.869203539823,0],[204,80.06875647668394]]}],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[48.232039800995025,0],[0,52.56645739910314],[-48.232039800995025,0],[0,-52.56645739910314]],"o":[[0,52.56645739910314],[-36.18293532338309,0],[0,-79.76004484304933],[48.232039800995025,0],[0,0]],"v":[[179,94.11847533632287],[76.71174129353234,201],[0,120.1763677130045],[95.52900497512438,0],[179,94.11847533632287]]}],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[48.232039800995025,0],[0,52.56645739910314],[-48.232039800995025,0],[0,-52.56645739910314]],"o":[[0,52.56645739910314],[-36.18293532338309,0],[0,-79.76004484304933],[48.232039800995025,0],[0,0]],"v":[[179,94.11847533632287],[76.71174129353234,201],[0,120.1763677130045],[95.52900497512438,0],[179,94.11847533632287]]}],"t":162},{"s":[{"c":true,"i":[[0,0],[45.80260416666666,0],[0,45.766497461928935],[-45.80260416666666,0],[0,-45.766497461928935]],"o":[[0,45.766497461928935],[-34.36302083333334,0],[0,-69.44035532994924],[45.80260416666666,0],[0,0]],"v":[[170,81.94796954314721],[72.8609375,175],[0,104.6269035532995],[90.72864583333333,0],[170,81.94796954314721]]}],"t":252}]}},{"ty":"gs","bm":0,"hd":false,"nm":"","e":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[491.95711219129225,102.80159759521484],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[798.1640014648438,120],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[601.7170104980469,369],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[601.7170104980469,369],"t":162},{"s":[491.95711219129225,102.80159759521484],"t":252}]},"g":{"p":7,"k":{"a":0,"k":[0.0,0.0,1.0,1.0,0.167,0.0,0.25,1.0,0.333,0.749,0.0,1.0,0.5,1.0,0.0,1.0,0.667,1.0,0.0,0.5,0.833,0.749,0.0,1.0,1.0,0.0,1.0,1.0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[176.92799377441406,102.80159759521484],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[378.36199951171875,120],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[297,369],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[297,369],"t":162},{"s":[176.92799377441406,102.80159759521484],"t":252}]},"lc":1,"lj":1,"ml":4,"o":{"a":0,"k":100},"w":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[22],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[22],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[22],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[22],"t":162},{"s":[22],"t":252}]}}],"ind":4},{"ty":4,"nm":"BLUR XXL","sr":1,"st":0,"op":253,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,"ks":{"a":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[96,98.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[113,96.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.5,111.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.5,111.5],"t":162},{"s":[96,98.5],"t":252}]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[222,223.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[221,223.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[223.5,223.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[223.5,223.5],"t":162},{"s":[222,223.5],"t":252}]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"ef":[{"ty":29,"nm":"","en":1,"ef":[{"ty":0,"nm":"sigma","v":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[60],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[60],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[60],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[60],"t":162},{"s":[60],"t":252}]}},{"ty":0,"nm":"","v":{"a":0,"k":1}},{"ty":0,"nm":"","v":{"a":0,"k":0}}]}],"shapes":[{"ty":"sh","bm":0,"hd":false,"nm":"","d":1,"ks":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[45.80260416666666,0],[0,45.766497461928935],[-45.80260416666666,0],[0,-45.766497461928935]],"o":[[0,45.766497461928935],[-34.36302083333334,0],[0,-69.44035532994924],[45.80260416666666,0],[0,0]],"v":[[170,81.94796954314721],[72.8609375,175],[0,104.6269035532995],[90.72864583333333,0],[170,81.94796954314721]]}],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[54.9716814159292,0],[0,44.71694300518135],[-54.9716814159292,0],[0,-44.725803108808286]],"o":[[0,44.725803108808286],[-41.242300884955746,0],[0,-67.85953367875648],[54.9716814159292,0],[0,0]],"v":[[204,80.06875647668394],[87.43115044247787,171],[0,102.23673575129534],[108.869203539823,0],[204,80.06875647668394]]}],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[48.232039800995025,0],[0,52.56645739910314],[-48.232039800995025,0],[0,-52.56645739910314]],"o":[[0,52.56645739910314],[-36.18293532338309,0],[0,-79.76004484304933],[48.232039800995025,0],[0,0]],"v":[[179,94.11847533632287],[76.71174129353234,201],[0,120.1763677130045],[95.52900497512438,0],[179,94.11847533632287]]}],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[48.232039800995025,0],[0,52.56645739910314],[-48.232039800995025,0],[0,-52.56645739910314]],"o":[[0,52.56645739910314],[-36.18293532338309,0],[0,-79.76004484304933],[48.232039800995025,0],[0,0]],"v":[[179,94.11847533632287],[76.71174129353234,201],[0,120.1763677130045],[95.52900497512438,0],[179,94.11847533632287]]}],"t":162},{"s":[{"c":true,"i":[[0,0],[45.80260416666666,0],[0,45.766497461928935],[-45.80260416666666,0],[0,-45.766497461928935]],"o":[[0,45.766497461928935],[-34.36302083333334,0],[0,-69.44035532994924],[45.80260416666666,0],[0,0]],"v":[[170,81.94796954314721],[72.8609375,175],[0,104.6269035532995],[90.72864583333333,0],[170,81.94796954314721]]}],"t":252}]}},{"ty":"gs","bm":0,"hd":false,"nm":"","e":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[442.9571198206868,53.80160140991211],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[750.3730163574219,110.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[634.7990112304688,284.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[634.7990112304688,284.5],"t":162},{"s":[442.9571198206868,53.80160140991211],"t":252}]},"g":{"p":7,"k":{"a":0,"k":[0.0,0.749,0.0,1.0,0.167,1.0,0.0,1.0,0.333,0.0,1.0,1.0,0.5,0.0,0.25,1.0,0.667,0.749,0.0,1.0,0.833,1.0,0.0,0.5,1.0,1.0,0.0,1.0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[127.9280014038086,53.80160140991211],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[333.07501220703125,110.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[306,284.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[306,284.5],"t":162},{"s":[127.9280014038086,53.80160140991211],"t":252}]},"lc":1,"lj":1,"ml":4,"o":{"a":0,"k":100},"w":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[22],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[22],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[22],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[22],"t":162},{"s":[22],"t":252}]}}],"ind":5},{"ty":4,"nm":"BLUR XXXL","sr":1,"st":0,"op":253,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,"ks":{"a":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[96,98.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[112,96.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[99,111.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[99,111.5],"t":162},{"s":[96,98.5],"t":252}]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[200,201.5]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"ef":[{"ty":29,"nm":"","en":1,"ef":[{"ty":0,"nm":"sigma","v":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[106.69999694824219],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[106.69999694824219],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[122],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[122],"t":162},{"s":[106.69999694824219],"t":252}]}},{"ty":0,"nm":"","v":{"a":0,"k":1}},{"ty":0,"nm":"","v":{"a":0,"k":0}}]}],"shapes":[{"ty":"sh","bm":0,"hd":false,"nm":"","d":1,"ks":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[57.657395833333325,0],[0,57.27350253807108],[-57.657395833333325,0],[0,-57.27350253807108]],"o":[[0,57.27350253807108],[-43.25697916666667,0],[0,-86.89964467005078],[57.657395833333325,0],[0,0]],"v":[[214,102.5520304568528],[91.7190625,219.00000000000003],[0,130.93309644670052],[114.21135416666665,0],[214,102.5520304568528]]}],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[66.28821428571429,0],[0,56.22305699481865],[-66.28821428571429,0],[0,-56.23419689119171]],"o":[[0,56.23419689119171],[-49.727142857142866,0],[0,-85.32046632124353],[66.28821428571429,0],[0,0]],"v":[[246.00000000000003,100.67124352331606],[105.42857142857144,215],[0,128.54326424870467],[131.29151785714288,0],[246.00000000000003,100.67124352331606]]}],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[59.27777777777778,0],[0,64.07354260089687],[-59.27777777777778,0],[0,-64.07354260089687]],"o":[[0,64.07354260089687],[-44.47777777777778,0],[0,-97.21995515695068],[59.27777777777778,0],[0,0]],"v":[[220,114.72152466367714],[94.28888888888889,245],[0,146.48363228699554],[117.41111111111111,0],[220,114.72152466367714]]}],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[59.27777777777778,0],[0,64.07354260089687],[-59.27777777777778,0],[0,-64.07354260089687]],"o":[[0,64.07354260089687],[-44.47777777777778,0],[0,-97.21995515695068],[59.27777777777778,0],[0,0]],"v":[[220,114.72152466367714],[94.28888888888889,245],[0,146.48363228699554],[117.41111111111111,0],[220,114.72152466367714]]}],"t":162},{"s":[{"c":true,"i":[[0,0],[57.657395833333325,0],[0,57.27350253807108],[-57.657395833333325,0],[0,-57.27350253807108]],"o":[[0,57.27350253807108],[-43.25697916666667,0],[0,-86.89964467005078],[57.657395833333325,0],[0,0]],"v":[[214,102.5520304568528],[91.7190625,219.00000000000003],[0,130.93309644670052],[114.21135416666665,0],[214,102.5520304568528]]}],"t":252}]}},{"ty":"gs","bm":0,"hd":false,"nm":"","e":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[645.0978247937817,343],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[424.9639892578125,323.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[425.0039978027344,147.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[425.0039978027344,147.5],"t":162},{"s":[645.0978247937817,343],"t":252}]},"g":{"p":7,"k":{"a":0,"k":[0.0,1.0,0.0,1.0,0.167,0.749,0.0,1.0,0.333,0.0,0.25,1.0,0.5,0.0,1.0,1.0,0.667,0.749,0.0,1.0,0.833,1.0,0.0,1.0,1.0,0.749,0.0,1.0]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[294,343],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[60.5,323.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[153.5,147.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[153.5,147.5],"t":162},{"s":[294,343],"t":252}]},"lc":1,"lj":1,"ml":4,"o":{"a":0,"k":100},"w":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[22],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[22],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[22],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[22],"t":162},{"s":[22],"t":252}]}}],"ind":6}],"v":"5.7.0","fr":60,"op":252,"ip":0,"assets":[{"nm":"[Asset] Group 1321319189","id":"1","layers":[{"ty":4,"nm":"BLUR M Mask","sr":1,"st":0,"op":253,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"td":1,"ao":0,"ks":{"a":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[96.25,98.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[112.74,96.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":162},{"s":[96.25,98.5],"t":252}]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[96.25,98.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[112.74,96.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":162},{"s":[96.25,98.5],"t":252}]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"shapes":[{"ty":"sh","bm":0,"hd":false,"nm":"","d":1,"ks":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[51.87,0],[0,51.52],[-51.87,0],[0,-51.52]],"o":[[0,51.52],[-38.92,0],[0,-78.17],[51.87,0],[0,0]],"v":[[192.5,92.25],[82.5,197],[0,117.78],[102.74,0],[192.5,92.25]]}],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[60.75,0],[0,50.47],[-60.75,0],[0,-50.48]],"o":[[0,50.48],[-45.58,0],[0,-76.59],[60.75,0],[0,0]],"v":[[225.47,90.37],[96.63,193],[0,115.39],[120.33,0],[225.47,90.37]]}],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[54.03,0],[0,58.32],[-54.03,0],[0,-58.32]],"o":[[0,58.32],[-40.54,0],[0,-88.49],[54.03,0],[0,0]],"v":[[200.53,104.42],[85.94,223],[0,133.33],[107.02,0],[200.53,104.42]]}],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[54.03,0],[0,58.32],[-54.03,0],[0,-58.32]],"o":[[0,58.32],[-40.54,0],[0,-88.49],[54.03,0],[0,0]],"v":[[200.53,104.42],[85.94,223],[0,133.33],[107.02,0],[200.53,104.42]]}],"t":162},{"s":[{"c":true,"i":[[0,0],[51.87,0],[0,51.52],[-51.87,0],[0,-51.52]],"o":[[0,51.52],[-38.92,0],[0,-78.17],[51.87,0],[0,0]],"v":[[192.5,92.25],[82.5,197],[0,117.78],[102.74,0],[192.5,92.25]]}],"t":252}]}},{"ty":"fl","bm":0,"hd":false,"nm":"","c":{"a":0,"k":[0.1,0.0,0.15]},"r":1,"o":{"a":0,"k":80}}],"ind":1},{"ty":4,"nm":"BLUR M","sr":1,"st":0,"op":253,"ip":0,"hd":false,"ddd":0,"bm":0,"tt":1,"hasMask":false,"ao":0,"ks":{"a":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[96.25,98.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[112.74,96.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":162},{"s":[96.25,98.5],"t":252}]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[96.25,98.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[112.74,96.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":162},{"s":[96.25,98.5],"t":252}]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"ef":[{"ty":29,"nm":"","en":1,"ef":[{"ty":0,"nm":"sigma","v":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[10.699999809265137],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[10.699999809265137],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[10.699999809265137],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[10.699999809265137],"t":162},{"s":[10.699999809265137],"t":252}]}},{"ty":0,"nm":"","v":{"a":0,"k":1}},{"ty":0,"nm":"","v":{"a":0,"k":0}}]}],"shapes":[{"ty":"sh","bm":0,"hd":false,"nm":"","d":1,"ks":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[51.87,0],[0,51.52],[-51.87,0],[0,-51.52]],"o":[[0,51.52],[-38.92,0],[0,-78.17],[51.87,0],[0,0]],"v":[[192.5,92.25],[82.5,197],[0,117.78],[102.74,0],[192.5,92.25]]}],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[60.75,0],[0,50.47],[-60.75,0],[0,-50.48]],"o":[[0,50.48],[-45.58,0],[0,-76.59],[60.75,0],[0,0]],"v":[[225.47,90.37],[96.63,193],[0,115.39],[120.33,0],[225.47,90.37]]}],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[54.03,0],[0,58.32],[-54.03,0],[0,-58.32]],"o":[[0,58.32],[-40.54,0],[0,-88.49],[54.03,0],[0,0]],"v":[[200.53,104.42],[85.94,223],[0,133.33],[107.02,0],[200.53,104.42]]}],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[54.03,0],[0,58.32],[-54.03,0],[0,-58.32]],"o":[[0,58.32],[-40.54,0],[0,-88.49],[54.03,0],[0,0]],"v":[[200.53,104.42],[85.94,223],[0,133.33],[107.02,0],[200.53,104.42]]}],"t":162},{"s":[{"c":true,"i":[[0,0],[51.87,0],[0,51.52],[-51.87,0],[0,-51.52]],"o":[[0,51.52],[-38.92,0],[0,-78.17],[51.87,0],[0,0]],"v":[[192.5,92.25],[82.5,197],[0,117.78],[102.74,0],[192.5,92.25]]}],"t":252}]}},{"ty":"gs","bm":0,"hd":false,"nm":"","e":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[331.0114255402034,212.1479949951172],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[337.7618770599365,-1.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[598.6940002441406,18],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[598.6940002441406,18],"t":162},{"s":[331.0114255402034,212.1479949951172],"t":252}]},"g":{"p":4,"k":{"a":0,"k":[0.0,0.0,1.0,1.0,0.33,0.749,0.0,1.0,0.66,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.044487226754426956,1,0.36180227994918823,0,0.6967133283615112,0.33,1,1]}},"t":2,"a":{"a":0,"k":0},"h":{"a":0,"k":0},"s":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[9.424400329589844,212.1479949951172],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[1.9548702239990234,-1.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[260.031005859375,18],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[260.031005859375,18],"t":162},{"s":[9.424400329589844,212.1479949951172],"t":252}]},"lc":1,"lj":1,"ml":4,"o":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[89.99999761581421],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[50],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[50],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[50],"t":162},{"s":[89.99999761581421],"t":252}]},"w":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[7],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[7],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[7],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[7],"t":162},{"s":[7],"t":252}]}}],"ind":2},{"ty":4,"nm":"BLUR M Mask","sr":1,"st":0,"op":253,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"td":1,"ao":0,"ks":{"a":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[96.25,98.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[112.74,96.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":162},{"s":[96.25,98.5],"t":252}]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[96.25,98.5],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[112.74,96.5],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[100.27,111.5],"t":162},{"s":[96.25,98.5],"t":252}]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"shapes":[{"ty":"sh","bm":0,"hd":false,"nm":"","d":1,"ks":{"a":1,"k":[{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[51.87,0],[0,51.52],[-51.87,0],[0,-51.52]],"o":[[0,51.52],[-38.92,0],[0,-78.17],[51.87,0],[0,0]],"v":[[192.5,92.25],[82.5,197],[0,117.78],[102.74,0],[192.5,92.25]]}],"t":0},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[60.75,0],[0,50.47],[-60.75,0],[0,-50.48]],"o":[[0,50.48],[-45.58,0],[0,-76.59],[60.75,0],[0,0]],"v":[[225.47,90.37],[96.63,193],[0,115.39],[120.33,0],[225.47,90.37]]}],"t":78},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[54.03,0],[0,58.32],[-54.03,0],[0,-58.32]],"o":[[0,58.32],[-40.54,0],[0,-88.49],[54.03,0],[0,0]],"v":[[200.53,104.42],[85.94,223],[0,133.33],[107.02,0],[200.53,104.42]]}],"t":156},{"o":{"x":0,"y":0},"i":{"x":1,"y":1},"s":[{"c":true,"i":[[0,0],[54.03,0],[0,58.32],[-54.03,0],[0,-58.32]],"o":[[0,58.32],[-40.54,0],[0,-88.49],[54.03,0],[0,0]],"v":[[200.53,104.42],[85.94,223],[0,133.33],[107.02,0],[200.53,104.42]]}],"t":162},{"s":[{"c":true,"i":[[0,0],[51.87,0],[0,51.52],[-51.87,0],[0,-51.52]],"o":[[0,51.52],[-38.92,0],[0,-78.17],[51.87,0],[0,0]],"v":[[192.5,92.25],[82.5,197],[0,117.78],[102.74,0],[192.5,92.25]]}],"t":252}]}},{"ty":"fl","bm":0,"hd":false,"nm":"","c":{"a":0,"k":[0.1,0.0,0.15]},"r":1,"o":{"a":0,"k":80}}],"ind":3}]}],"markers":[]}
        });
        aiLottie.addEventListener('DOMLoaded', function() { console.log('AI Orb: Lottie animation loaded'); });
      } else { console.warn('AI Orb: #aiLottieContainer element not found'); }
    } else { console.warn('AI Orb: lottie-web library not loaded'); }
  } catch(e) { console.warn('AI Orb: Lottie init error', e); }
  function setAiOrbSpeed(s) { if (aiLottie) aiLottie.setSpeed(s); }
  function applyAiState(st) { aiOrb.setAttribute('data-state', st); if (st !== 'listening') setAiOrbSpeed(st === 'thinking' ? 2.5 : st === 'speaking' ? 4 : 1); }
  $('aiOrbToggle').classList.add('active');
  $('aiOrbToggle').addEventListener('click', () => { state.ai.visible = !state.ai.visible; $('aiOrbToggle').classList.toggle('active', state.ai.visible); aiContainer.classList.toggle('hidden', !state.ai.visible); if (!state.ai.visible) stopVoiceReact(); saveState(); });
  $('aiStateDemo').addEventListener('change', (e) => { state.ai.state = e.target.value; applyAiState(state.ai.state); if (e.target.value === 'listening') startVoiceReact(); else stopVoiceReact(); });
  aiOrb.addEventListener('click', () => { alert('AI Assistant integration coming soon.'); });

  // Voice React (audio-reactive AI orb)
  let voiceCtx = null, voiceAnalyser = null, voiceStream = null, voiceAnimId = null, voiceDataArray = null;
  function startVoiceReact() {
    if (state.ai.voiceActive) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
      voiceStream = stream;
      voiceCtx = new (window.AudioContext || window.webkitAudioContext)();
      voiceAnalyser = voiceCtx.createAnalyser();
      voiceAnalyser.fftSize = 256;
      const source = voiceCtx.createMediaStreamSource(stream);
      source.connect(voiceAnalyser);
      voiceDataArray = new Uint8Array(voiceAnalyser.frequencyBinCount);
      state.ai.voiceActive = true;
      state.ai.state = 'listening';
      $('aiStateDemo').value = 'listening';
      applyAiState('listening');
      $('voiceToggle').classList.add('active');
      voiceAnimLoop();
      saveState();
    }).catch(function(err) {
      console.warn('Voice React: mic access denied', err);
    });
  }
  function voiceAnimLoop() {
    if (!state.ai.voiceActive) return;
    voiceAnalyser.getByteFrequencyData(voiceDataArray);
    let sum = 0;
    for (let i = 0; i < voiceDataArray.length; i++) sum += voiceDataArray[i] * voiceDataArray[i];
    const rms = Math.sqrt(sum / voiceDataArray.length);
    const level = Math.min(rms / 128, 1);
    setAiOrbSpeed(1 + level * 4);
    const baseGlow = state.frames.glowIntensity;
    document.documentElement.style.setProperty('--lg-frame-glow-intensity', baseGlow + level * 40);
    voiceAnimId = requestAnimationFrame(voiceAnimLoop);
  }
  function stopVoiceReact() {
    if (!state.ai.voiceActive) return;
    state.ai.voiceActive = false;
    if (voiceAnimId) { cancelAnimationFrame(voiceAnimId); voiceAnimId = null; }
    if (voiceStream) { voiceStream.getTracks().forEach(function(t) { t.stop(); }); voiceStream = null; }
    if (voiceCtx) { voiceCtx.close().catch(function(){}); voiceCtx = null; voiceAnalyser = null; voiceDataArray = null; }
    document.documentElement.style.setProperty('--lg-frame-glow-intensity', state.frames.glowIntensity);
    $('voiceToggle').classList.remove('active');
    if (state.ai.state === 'listening') { state.ai.state = 'idle'; $('aiStateDemo').value = 'idle'; applyAiState('idle'); }
    saveState();
  }
  $('voiceToggle').addEventListener('click', function() { state.ai.voiceActive ? stopVoiceReact() : startVoiceReact(); });

  // Developer
  $('githubSave').addEventListener('click', () => { if (confirm('GitHub save/commit is a stub. Continue?')) alert('GitHub integration not implemented.'); });

  // Persistence
  function saveState() {
    try {
      localStorage.setItem(STORAGE.appearance, JSON.stringify({ theme: state.theme, bgType: $('bgType').value, bgUrl: $('bgUrl').value, bgVideoUrl: $('bgVideoUrl').value, bgOpacity: $('bgOpacity').value, splashDim: $('splashDim').value, splashBlur: $('splashBlur').value }));
      localStorage.setItem(STORAGE.particles, JSON.stringify(state.particles));
      localStorage.setItem(STORAGE.tracers, JSON.stringify(state.tracers));
      localStorage.setItem(STORAGE.screensaver, JSON.stringify(state.screensaver));
      localStorage.setItem(STORAGE.modules, JSON.stringify(state.modules));
      localStorage.setItem(STORAGE.frames, JSON.stringify(state.frames));
      localStorage.setItem(STORAGE.ai, JSON.stringify(state.ai));
    } catch(e) {}
  }
  function loadState() {
    try {
      const appearance = JSON.parse(localStorage.getItem(STORAGE.appearance) || '{}');
      if (appearance.theme) { Object.assign(state.theme, appearance.theme); $('themePreset').value = state.theme.preset; $('accentColor').value = state.theme.accent; $('accent2Color').value = state.theme.accent2; $('bgBaseColor').value = state.theme.bgBase; $('surfaceColor').value = state.theme.surface; $('textColor').value = state.theme.text; $('mutedColor').value = state.theme.muted; $('strokeColor').value = state.theme.stroke; $('glowStrength').value = state.theme.glow; }
      if (appearance.bgType) $('bgType').value = appearance.bgType;
      if (appearance.bgUrl) $('bgUrl').value = appearance.bgUrl;
      if (appearance.bgVideoUrl) $('bgVideoUrl').value = appearance.bgVideoUrl;
      if (appearance.bgOpacity) $('bgOpacity').value = appearance.bgOpacity;
      if (appearance.splashDim) $('splashDim').value = appearance.splashDim;
      if (appearance.splashBlur) $('splashBlur').value = appearance.splashBlur;
      const particles = JSON.parse(localStorage.getItem(STORAGE.particles) || '{}');
      if (particles.count) { Object.assign(state.particles, particles); state.particles.enabled = false; state.particles.animationId = null; $('particleCount').value = state.particles.count; $('particleSpeed').value = state.particles.speed; $('particleDistance').value = state.particles.distance; $('particleBrightness').value = state.particles.brightness; $('particleSizeVar').value = state.particles.sizeVar || 3; $('particleColorMode').value = state.particles.colorMode || 'single'; $('particleColor').value = state.particles.color; $('particleColorLabel').style.display = state.particles.colorMode === 'single' ? 'flex' : 'none'; }
      const tracers = JSON.parse(localStorage.getItem(STORAGE.tracers) || '{}');
      if (tracers.color) { Object.assign(state.tracers, tracers); state.tracers.enabled = false; state.tracers.animationId = null; $('tracerCount').value = state.tracers.count || 1; $('tracerColor').value = state.tracers.color; $('tracerSpeed').value = state.tracers.speed; $('tracerSpeedVar').value = state.tracers.speedVar || 10; $('tracerThickness').value = state.tracers.thickness; $('tracerGlow').value = state.tracers.glow; $('tracerGlowVar').value = state.tracers.glowVar || 10; $('tracerTrail').value = state.tracers.trail; $('tracerDirection').value = state.tracers.direction || 'clockwise'; $('tracerTarget').value = state.tracers.target || 'perimeter'; }
      const screensaver = JSON.parse(localStorage.getItem(STORAGE.screensaver) || '{}');
      if (screensaver.type) { Object.assign(state.screensaver, screensaver); state.screensaver.active = false; state.screensaver.ssAnimationId = null; $('screensaverToggle').classList.toggle('active', state.screensaver.enabled); $('screensaverTime').value = state.screensaver.idleMinutes; $('screensaverType').value = state.screensaver.type; $('screensaverUrl').value = state.screensaver.mediaUrl || ''; $('statusScreensaver').textContent = state.screensaver.enabled ? 'Enabled' : 'Disabled'; }
      const modules = JSON.parse(localStorage.getItem(STORAGE.modules) || '{}');
      if (modules.calendar) { Object.assign(state.modules, modules); $('pathCalendar').value = state.modules.calendar; $('pathBudget').value = state.modules.budget; $('pathTravels').value = state.modules.travels; $('pathRows').value = state.modules.rows; $('pathSmartQuote').value = state.modules.smartquote; }
      const frames = JSON.parse(localStorage.getItem(STORAGE.frames) || '{}');
      if (frames.style) { Object.assign(state.frames, frames); $('frameStyle').value = state.frames.style; $('frameRadius').value = state.frames.radius; $('frameGlowColor').value = state.frames.glowColor; $('frameGlowIntensity').value = state.frames.glowIntensity; }
      const ai = JSON.parse(localStorage.getItem(STORAGE.ai) || '{}');
      if (ai.visible !== undefined) { ai.visible = true; Object.assign(state.ai, ai); $('aiOrbToggle').classList.toggle('active', state.ai.visible); aiContainer.classList.toggle('hidden', !state.ai.visible); $('aiStateDemo').value = state.ai.state; applyAiState(state.ai.state); localStorage.setItem(STORAGE.ai, JSON.stringify(state.ai)); }
      applyTheme(); applyFrames();
    } catch(e) {}
  }

  // Export/Import
  $('exportSettings').addEventListener('click', () => {
    const settings = { appearance: JSON.parse(localStorage.getItem(STORAGE.appearance) || '{}'), particles: JSON.parse(localStorage.getItem(STORAGE.particles) || '{}'), tracers: JSON.parse(localStorage.getItem(STORAGE.tracers) || '{}'), screensaver: JSON.parse(localStorage.getItem(STORAGE.screensaver) || '{}'), modules: JSON.parse(localStorage.getItem(STORAGE.modules) || '{}'), frames: JSON.parse(localStorage.getItem(STORAGE.frames) || '{}'), ai: JSON.parse(localStorage.getItem(STORAGE.ai) || '{}') };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'liongateos-settings.json'; a.click();
  });
  $('importSettings').addEventListener('click', () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const settings = JSON.parse(event.target.result);
            if (settings.appearance) localStorage.setItem(STORAGE.appearance, JSON.stringify(settings.appearance));
            if (settings.particles) localStorage.setItem(STORAGE.particles, JSON.stringify(settings.particles));
            if (settings.tracers) localStorage.setItem(STORAGE.tracers, JSON.stringify(settings.tracers));
            if (settings.screensaver) localStorage.setItem(STORAGE.screensaver, JSON.stringify(settings.screensaver));
            if (settings.modules) localStorage.setItem(STORAGE.modules, JSON.stringify(settings.modules));
            if (settings.frames) localStorage.setItem(STORAGE.frames, JSON.stringify(settings.frames));
            if (settings.ai) localStorage.setItem(STORAGE.ai, JSON.stringify(settings.ai));
            loadState(); $('registryStatus').textContent = 'Status: Settings imported!';
          } catch (err) { $('registryStatus').textContent = 'Status: Import failed'; }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  });

  $('btnExport').addEventListener('click', () => alert('Export functionality placeholder.'));
  $('btnReset').addEventListener('click', () => { if (confirm('Reset all settings to defaults?')) { localStorage.clear(); location.reload(); } });

  // Init
  loadState();
  renderAppsGrid();
  console.log('LionGateOS Enhanced v3 initialized');
})();
