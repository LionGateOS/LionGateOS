// Layering Architecture Placeholder
// Describes stack order for:
// - Wallpaper
// - Branding
// - Windows
// - Dock
// - Sidebar
// - System Alerts

export const shellLayers = {
  WALLPAPER: 'wallpaper',
  BRAND: 'brand',
  WINDOWS: 'windows',
  DOCK: 'dock',
  SIDEBAR: 'sidebar',
  SYSTEM_ALERTS: 'system_alerts'
};

export const shellLayerZIndexPlan = {
  [shellLayers.WALLPAPER]: 0,
  [shellLayers.BRAND]: 10,
  [shellLayers.WINDOWS]: 20,
  [shellLayers.DOCK]: 30,
  [shellLayers.SIDEBAR]: 40,
  [shellLayers.SYSTEM_ALERTS]: 50
};

export function getLayerZIndex(layerKey) {
  return shellLayerZIndexPlan[layerKey] ?? 0;
}
