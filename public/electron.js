const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const childProcess = require("child_process");

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

let { fork } = require("child_process");
let serverProcess = fork(__dirname + "/../src/_server/index.js");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    titleBarStyle: "hidden"
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
  //mainWindow.maximize();
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
