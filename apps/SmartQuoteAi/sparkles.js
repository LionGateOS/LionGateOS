(function(){
  'use strict';

  // Respect reduced motion.
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const layer = document.getElementById('sparkles');
  if (!layer) return;

  function safeNum(x){ return (typeof x === 'number' && isFinite(x)) ? x : null; }

  function getTier(){
    const nav = navigator || {};
    const hw = safeNum(nav.hardwareConcurrency);
    const mem = safeNum(nav.deviceMemory);

    const conn = nav.connection || nav.mozConnection || nav.webkitConnection || null;
    const saveData = !!(conn && conn.saveData);
    const eff = (conn && typeof conn.effectiveType === 'string') ? conn.effectiveType : '';

    if (saveData) return 'LOW';
    if (eff === 'slow-2g' || eff === '2g') return 'LOW';
    if (eff === '3g') return 'MID';

    if (mem !== null){
      if (mem <= 2) return 'LOW';
      if (mem <= 4) return 'MID';
    }
    if (hw !== null){
      if (hw <= 2) return 'LOW';
      if (hw <= 4) return 'MID';
    }
    return 'HIGH';
  }

  const budgets = { HIGH:40, MID:30, LOW:20 };
  let tier = getTier();

  function setTier(t){
    tier = t;
    document.documentElement.style.setProperty('--sparkleOpacity', (tier === 'HIGH') ? '0.55' : (tier === 'MID') ? '0.45' : '0.35');
  }

  function clear(){
    while (layer.firstChild) layer.removeChild(layer.firstChild);
  }

  function rand(min, max){ return min + Math.random() * (max - min); }

  function build(){
    clear();
    const count = budgets[tier] || 30;
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);

    for (let i=0;i<count;i++){
      const s = document.createElement('span');
      s.className = 'sparkle';
      const size = (Math.random() < 0.35) ? 2 : 3;
      s.style.width = size+'px';
      s.style.height = size+'px';
      s.style.left = Math.floor(rand(0, w)) + 'px';
      // Start somewhere below so first loop isn't a burst.
      s.style.top = Math.floor(rand(h * 0.10, h * 1.25)) + 'px';
      s.style.opacity = String(rand(0.45, (tier === 'LOW') ? 0.70 : 0.85));
      s.style.setProperty('--dur', String(Math.floor(rand(20,24))) + 's');
      layer.appendChild(s);
    }
  }

  // Pause/resume on tab visibility.
  function onVis(){
    if (document.hidden) document.body.classList.add('paused');
    else document.body.classList.remove('paused');
  }
  document.addEventListener('visibilitychange', onVis, { passive:true });
  onVis();

  // Simple stutter detection (privacy-safe, coarse) and degrade once if needed.
  let last = performance.now();
  let acc = 0;
  let frames = 0;
  let degraded = false;

  function tick(now){
    const dt = now - last;
    last = now;
    acc += dt;
    frames++;

    // Evaluate about every 120 frames.
    if (frames >= 120){
      const avg = acc / frames;
      acc = 0; frames = 0;

      if (!degraded && avg > 45){
        degraded = true;
        if (tier === 'HIGH') setTier('MID');
        else if (tier === 'MID') setTier('LOW');
        build();
      }
    }
    requestAnimationFrame(tick);
  }

  // Initialize.
  setTier(tier);
  build();
  window.addEventListener('resize', function(){
    // Rebuild only on resize end-ish.
    clearTimeout(window.__sqSparkleResizeT);
    window.__sqSparkleResizeT = setTimeout(build, 150);
  }, { passive:true });

  requestAnimationFrame(tick);
})();
