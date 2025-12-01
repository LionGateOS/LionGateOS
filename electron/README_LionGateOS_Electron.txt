LionGateOS Electron Starter

This folder provides:
- electron/main.mjs   (Electron entry file for LionGateOS shell)
- electron/preload.js (preload bridge)
- electron/icons/icon_256.png (placeholder icon)

The LionGateOS development chat should:
- Wire npm scripts so that `npm run electron` builds the app and then runs Electron.
- Ensure the OS shell builds to dist/index.html or adjust main.mjs load path accordingly.