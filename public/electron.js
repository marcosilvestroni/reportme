const path = require("path");
const { fork } = require("child_process");
const os = require("os");
const electron = require("electron");
const isDev = require("electron-is-dev");
require("v8-compile-cache");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const findOpenSocket = require("./find-open-socket");
const { ipcMain } = electron;

let clientWin;
let serverProcess;

ipcMain.on("close-app", () => {
  app.quit();
});
ipcMain.on("min-app", () => {
  clientWin.minimize();
});
ipcMain.on("max-app", () => {
  clientWin.maximize();
});

function createWindow(socketName) {
  clientWin = new BrowserWindow({
    width: 1200,
    height: 1080,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + "/preload-client.js"
    }
  });

  clientWin.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  clientWin.on("closed", () => (clientWin = null));

  clientWin.webContents.on("did-finish-load", () => {
    clientWin.webContents.send("set-socket", {
      name: socketName
    });
  });

  //clientWin.webContents.openDevTools()
  //react dev tools
  if (
    isDev &&
    !("React Developer Tools" in BrowserWindow.getDevToolsExtensions())
  ) {
    BrowserWindow.addDevToolsExtension(
      path.join(
        os.homedir(),
        "/.config/chromium/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.2.0_0"
      )
    );
  }
}

function createBackgroundProcess(socketName) {
  serverProcess = fork(__dirname + "/server/index.js", [
    "--subprocess",
    app.getVersion(),
    socketName
  ]);

  serverProcess.on("message", msg => {
    console.log("serverProcess message:", msg);
  });

  return serverProcess;
}

app.on("ready", async () => {
  const serverSocket = await findOpenSocket();
  //createBackgroundProcess(serverSocket);
  setTimeout(function () {
    
    createWindow(serverSocket)
  },2000);
});

app.on("before-quit", () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", async () => {
  if (clientWin === null) {
    createWindow();
  }
});
