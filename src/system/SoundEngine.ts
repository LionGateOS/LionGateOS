
export const SoundEngine = {
  boot: new Audio("/sounds/boot.wav"),
  click: new Audio("/sounds/click.wav"),
  notify: new Audio("/sounds/notify.wav"),
  error: new Audio("/sounds/error.wav"),

  playBoot() { this.boot.currentTime = 0; this.boot.play(); },
  playClick() { this.click.currentTime = 0; this.click.play(); },
  playNotify() { this.notify.currentTime = 0; this.notify.play(); },
  playError() { this.error.currentTime = 0; this.error.play(); }
};
