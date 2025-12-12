// Animation tokens & easing presets for LionGateOS
// Hybrid curve: instant-on response with smooth fade-out.

export const easing = {
  // Fast, snappy entrance
  instantOn: 'cubic-bezier(0.3, 0.9, 0.4, 1)',
  // Softer, smooth exit
  smoothFadeOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  // General purpose
  standard: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)'
};

export const durations = {
  fast: 120,
  normal: 180,
  slow: 260
};
