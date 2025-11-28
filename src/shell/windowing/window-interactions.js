// Window interactivity placeholder
// Close/minimize/expand stubs, focus highlight, drag placeholders.

export function handleWindowClose(windowId) {
  // Placeholder: mark window as closed.
  return windowId;
}

export function handleWindowMinimize(windowId) {
  // Placeholder: mark window as minimized.
  return windowId;
}

export function handleWindowExpand(windowId) {
  // Placeholder: toggle window maximized state.
  return windowId;
}

export function handleWindowFocus(windowId) {
  // Placeholder: apply focus highlight and move window to front.
  return windowId;
}

export function beginWindowDrag(windowId, startPosition) {
  // Placeholder: start tracking drag.
  return { windowId, startPosition };
}

export function updateWindowDrag(windowId, currentPosition) {
  // Placeholder: compute new window coordinates.
  return { windowId, currentPosition };
}

export function endWindowDrag(windowId) {
  // Placeholder: finalize drag.
  return windowId;
}
