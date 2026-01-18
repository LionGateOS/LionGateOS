export type InteractionMode = "wheel" | "slider";

/**
 * Device-context default:
 * - Touch-first devices -> wheel
 * - Pointer/keyboard -> slider
 *
 * LionGateOS may override by passing an explicit mode.
 * SmartQuoteAI must not persist this locally.
 */
export function resolveInteractionMode(lionGateOverride?: InteractionMode): InteractionMode {
  if (lionGateOverride === "wheel" || lionGateOverride === "slider") return lionGateOverride;

  const hasTouch =
    typeof window !== "undefined" &&
    (("ontouchstart" in window) ||
      (navigator?.maxTouchPoints ?? 0) > 0 ||
      (navigator as any)?.msMaxTouchPoints > 0);

  return hasTouch ? "wheel" : "slider";
}
