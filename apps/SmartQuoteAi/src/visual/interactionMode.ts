export type InteractionMode = "wheel" | "slider";

export function getInteractionModeFromLionGateOS(): InteractionMode {
  if (window.matchMedia("(pointer: coarse)").matches) return "wheel";
  return "slider";
}
