import { SoundEngine } from "./SoundEngine";

export function attachClickSound() {
  document.addEventListener("click", () => {
    SoundEngine.playClick();
  });
}
