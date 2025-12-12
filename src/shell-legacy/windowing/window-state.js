// Window State Logic Placeholder
// Tracks z-index plan and basic window states.

export const WindowStateEnum = {
  MINIMIZED: 'minimized',
  NORMAL: 'normal',
  EXPANDED: 'expanded'
};

export function createWindowState(windowId) {
  return {
    id: windowId,
    state: WindowStateEnum.NORMAL,
    zIndex: 0,
    isActive: false,
    bounds: { x: 0, y: 0, width: 640, height: 400 }
  };
}

export function setWindowState(windowState, nextState) {
  // Placeholder: update minimized/normal/expanded.
  return { ...windowState, state: nextState };
}

export function setWindowActive(windowState, isActive, zIndex) {
  // Placeholder: mark window as active and adjust stacking.
  return { ...windowState, isActive, zIndex };
}

export function computeNextZIndex(windows, activeWindowId) {
  // Placeholder: compute z-index plan for all windows.
  return windows.map((w, index) => ({
    ...w,
    zIndex: index + 1,
    isActive: w.id === activeWindowId
  }));
}
