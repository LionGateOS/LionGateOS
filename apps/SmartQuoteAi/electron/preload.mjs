import { contextBridge } from "electron";
contextBridge.exposeInMainWorld("smartquoteEnv", { env: "electron" });
