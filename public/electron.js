const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const os = require("os");

const path = require("path");

const isDev = require("electron-is-dev");
if (!isDev) {
  let { fork } = require("child_process");
  fork(__dirname + "/../src/_server/index.js");
}

let mainWindow;

const { ipcMain } = electron;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1080,
    frame: false,
    webPreferences: {
      preload: __dirname + "/preload.js"
    }
  });

  //mainWindow.setMenuBarVisibility(false)

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));

  ipcMain.on("close-app", () => {
    mainWindow.close();
  });
  ipcMain.on("min-app", () => {
    mainWindow.minimize();
  });
  ipcMain.on("max-app", () => {
    mainWindow.maximize();
  });

  //react dev tools
  if (isDev) {
    BrowserWindow.addDevToolsExtension(
      path.join(
        os.homedir(),
        "/.config/chromium/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.2.0_0"
      )
    );
  }
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
