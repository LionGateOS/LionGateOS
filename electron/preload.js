// LionGateOS Electron preload
import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("liongate", {
  ping: () => "LionGateOS Electron ready"
});