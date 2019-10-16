const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const os = require("os");

const path = require("path");

const isDev = require("electron-is-dev");
if (1===2) {
  let { fork } = require("child_process");
  fork(__dirname + "/../src/_server/index.js");
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1080,
    titleBarStyle: "hidden"
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
  //mainWindow.maximize();

  //react dev tools
  BrowserWindow.addDevToolsExtension(
    path.join(
      os.homedir(),
      "/.config/chromium/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.2.0_0"
    )
  );
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
