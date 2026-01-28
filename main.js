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
    ai: { visible: false, state: 'idle' }
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
    const margin = 14, innerW = w - margin * 2, innerH = h - margin * 2, perimeter = (innerW + innerH) * 2;
    ctx.clearRect(0, 0, w, h);
    function getPoint(p) {
      p = ((p % perimeter) + perimeter) % perimeter;
      if (p < innerW) return { x: margin + p, y: margin };
      else if (p < innerW + innerH) return { x: margin + innerW, y: margin + (p - innerW) };
      else if (p < innerW * 2 + innerH) return { x: margin + innerW - (p - innerW - innerH), y: margin + innerH };
      else return { x: margin, y: margin + innerH - (p - innerW * 2 - innerH) };
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
  $('aiOrbToggle').addEventListener('click', () => { state.ai.visible = !state.ai.visible; $('aiOrbToggle').classList.toggle('active', state.ai.visible); aiContainer.classList.toggle('visible', state.ai.visible); saveState(); });
  $('aiStateDemo').addEventListener('change', (e) => { state.ai.state = e.target.value; aiOrb.setAttribute('data-state', state.ai.state); });
  aiOrb.addEventListener('click', () => { alert('AI Assistant integration coming soon.'); });

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
      if (ai.visible !== undefined) { Object.assign(state.ai, ai); $('aiOrbToggle').classList.toggle('active', state.ai.visible); aiContainer.classList.toggle('visible', state.ai.visible); $('aiStateDemo').value = state.ai.state; aiOrb.setAttribute('data-state', state.ai.state); }
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
