import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let startupWindow;
let mainWindow;

// remove legacy splash files
["splash.png", "splash@2x.png", "splash.html"].forEach(f => {
  const p = join(__dirname, f);
  if (fs.existsSync(p)) {
    try { fs.unlinkSync(p); } catch (e) {}
  }
});

function createStartup() {
  startupWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    backgroundColor: "#000000",
    fullscreen: false,
    alwaysOnTop: true,
    resizable: false,
    show: true,
    center: true
  });

  startupWindow.loadFile(join(__dirname, "startup.html"));
}

function createMain() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    backgroundColor: "#050816",
    opacity: 0,
    icon: join(__dirname, "icons", "icon_256.png"),
    webPreferences: {
      preload: join(__dirname, "preload.js")
    }
  });

  const appPath = join(__dirname, "..", "dist", "index.html");
  mainWindow.loadFile(appPath);

  function fadeIn() {
    let op = 0;
    const step = 0.06;
    const interval = setInterval(() => {
      op += step;
      if (op >= 1) {
        op = 1;
        clearInterval(interval);
      }
      mainWindow.setOpacity(op);
    }, 16);
  }

  startupWindow.on("closed", () => {
    mainWindow.show();
    fadeIn();
    mainWindow.webContents.openDevTools();
  });
}

app.whenReady().then(() => {
  createStartup();
  createMain();
});