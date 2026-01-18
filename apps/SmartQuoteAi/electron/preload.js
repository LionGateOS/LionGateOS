// SmartQuoteAi Pro Electron preload (CommonJS version)
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("smartquoteEnv", {
  env: "electron-desktop",
  versionLabel: "SmartQuoteAi Pro"
});
