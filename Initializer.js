const { app, BrowserWindow, session, ipcMain } = require("electron");
const { accessPython, ObjectToBeExported } = require("./Connections/Linker");
const { handleFileOpen } = require("./IPC_Functions");
var path = require("path");

const loadProcesses = ["CPU", "RAM", "Hard-Drive", "Network", "Battery"];
let loadingScreen;
let mainWindow;

// * Create Window

function createWindow() {
  // * Create browser window
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "NodeJS_Functions.js"),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    },
    show: false,
  });

  loadingScreen = new BrowserWindow({
    width: 300,
    height: 300,
    frame: false,
    resizable: false,
  });

  loadingScreen.loadFile("./Frontend/Loader.html");
  mainWindow.loadFile("./Frontend/Dashboard.html");

  // * Set CSP
  const ContentSecurityProtocol = `default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'none'; require-trusted-types-for 'script'; trusted-types SecureContent dompurify `;

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: Object.assign(
        {
          "Content-Security-Policy": ContentSecurityProtocol,
        },
        details.responseHeaders
      ),
    });
  });

  setTimeout(function () {
    loadingScreen.destroy();
    mainWindow.show();
  }, 5000);
}

// * On Ready

app.whenReady().then(() => {
  ipcMain.handle("openFileAndDirectoriesDialog", handleFileOpen);

  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// * Start the function which gets system load
loadProcesses.forEach((item) => {
  accessPython(item, "Task Manager");
});
