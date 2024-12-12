// const {
//   default: installExtension,
//   REACT_DEVELOPER_TOOLS,
//   REDUX_DEVTOOLS,
// } = require("electron-devtools-installer");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const fs = require("fs");
const isDev = require("electron-is-dev");
const Store = require("electron-store");
const {
  app,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  globalShortcut,
  Notification,
} = require("electron");
const { dialog } = require("electron");
const { powerMonitor } = require("electron");
let mainWindow;
let idleTime = 0;
const store = new Store();
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    show: false,
    autoHideMenuBar: true,
    frame: false,
    icon: path.join(__dirname, "../assets/icons/win/icon.ico"),
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.show();

  // download

  // mainWindow.webContents.session.on("will-download", (event, item) => {
  //   const options = {
  //     // download folder user
  //     directory: app.getPath("downloads"),
  //     filename: "desktopper.msi",
  //     saveAs: false,
  //     onCancel: () => {
  //       // Handle download cancellation
  //       console.log("Download canceled");
  //     },
  //     onProgress: (progress) => {
  //       // Handle download progress
  //       console.log(`Download progress: ${progress}%`);
  //       mainWindow.webContents.send("download-progress", progress); // Send progress to renderer process
  //     },
  //   };
  //   download(BrowserWindow.getFocusedWindow(), item.getURL(), options)
  //     .then((dl) => console.log(dl.getSavePath()))
  //     .catch(console.error);
  // });

  mainWindow.on("close", (event) => {
    mainWindow.webContents.send("stop_all_timer");
    const dialogOptions = {
      type: "info",
      buttons: ["Ok"],
      title: "desktopper",
      message: "Please Wait Your Data is Syncing",
      detail: `Uploading Data to Server`,
    };
    dialog.showMessageBox(dialogOptions);
    event.preventDefault();
    setTimeout(() => {
      mainWindow.destroy();
    }, 2000);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

const ScreenshotNotificationOptions = {
  title: "desktopper",
  subtitle: "",
  body: "Screenshot Captured",
  icon: path.join(__dirname, "../assets/icons/win/icon.ico"),
  sound: path.join(__dirname, "../assets/sound/ScreenshotNotification.mp3"),
};

app.setAsDefaultProtocolClient("desktopper");
app.setAppUserModelId("desktopper");
app.on("ready", createWindow);
// IPC METHODS
ipcMain.handle("get_current_app_version", (event, opts) => {
  const version = app.getVersion();
  return version;
});
ipcMain.handle("get_user_data", async (event, opts) => {
  const userData = await store.get("user_data");
  return userData;
});
ipcMain.handle("set_user_data", async (event, opts) => {
  store.set("user_data", opts);
  return true;
});
ipcMain.handle("get_user_token", async (event, opts) => {
  const userToken = await store.get("user_token");
  return userToken;
});
ipcMain.handle("set_user_token", async (event, opts) => {
  store.set("user_token", opts);
  return true;
});
ipcMain.handle("get_user_session_expiry", async (event, opts) => {
  const userSessionExpiry = await store.get("user_session_expiry");
  return userSessionExpiry;
});
ipcMain.handle("set_user_session_expiry", async (event, opts) => {
  store.set("user_session_expiry", opts);
  return true;
});

ipcMain.handle("get_redux_state", async (event, opts) => {
  const reduxState = await store.get("redux_state");
  return reduxState;
});
ipcMain.handle("set_redux_state", async (event, opts) => {
  store.set("redux_state", opts);
  return true;
});

ipcMain.handle("show_idle_message", async (event, opts) => {
  const dialogOptions = {
    type: "info",
    buttons: ["continue", "Stop"],
    title: "desktopper",
    message: "Timer Stoped Due to Inactivity",
    detail: "You were idle for 5 minutes",
  };
  const focusWindow = BrowserWindow.getFocusedWindow();
  const dialogWindow = new BrowserWindow({
    show: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    parent: focusWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  const res = await dialog
    .showMessageBox(dialogWindow, dialogOptions)
    .then((result) => {
      if (result.response === 0) {
        return true;
      } else {
        return false;
      }
    });
  // close the dialog window
  dialogWindow.close();
  return res;
});
ipcMain.handle("wrong_credentials", async (event, opts) => {
  const response = await dialog
    .showMessageBox(mainWindow, {
      type: "info",
      buttons: ["Ok"],
      title: "desktopper",
      message: "Wrong Credentials",
      detail: `Please Enter Correct Credentials`,
    })
    .then((result) => {
      if (result.response === 0) {
        return true;
      } else {
        return false;
      }
    });
});
ipcMain.handle("project_time_tracker_start", async (event, taskName) => {
  const notification = new Notification({
    title: "desktopper",
    subtitle: "",
    body: `Task:  ${taskName} Started`,
    icon: path.join(__dirname, "../assets/icons/win/icon.ico"),
    sound: path.join(__dirname, "../assets/sound/ProjectStart.mp3"),
  });
  notification.show();
});
ipcMain.handle("project_time_tracker_ended", async (event, taskName) => {
  const notification = new Notification({
    title: "desktopper",
    subtitle: "",
    body: `Task: ${taskName} Stopped`,
    icon: path.join(__dirname, "../assets/icons/win/icon.ico"),
    sound: path.join(__dirname, "../assets/sound/ProjectStart.mp3"),
  });
  notification.show();
});

ipcMain.handle("systemIdleTime", async (event) => {
  idleTime = powerMonitor.getSystemIdleTime();
  return idleTime;
});
ipcMain.handle("DESKTOP_CAPTURER_GET_SOURCES", async (event, opts) => {
  const sources = await desktopCapturer.getSources(opts);
  return sources;
});
ipcMain.handle("screenshot_notification", async (event) => {
  const notification = new Notification(ScreenshotNotificationOptions);
  notification.show();
});
ipcMain.handle("show_timerrunning", async (event) => {
  const dialogOptions = {
    type: "info",
    buttons: ["Ok"],
    title: "desktopper",
    message: "Timer is Running",
    detail: `Please Stop the Timer First`,
  };
  const response = await dialog
    .showMessageBox(mainWindow, dialogOptions)
    .then((result) => {
      if (result.response === 0) {
        return true;
      } else {
        return false;
      }
    });
  return response;
});
ipcMain.on("minimize-app", () => {
  mainWindow.minimize();
});
ipcMain.on("full-screen-app", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    return;
  }
  mainWindow.maximize();
});
ipcMain.on("close-app", () => {
  mainWindow.close();
});

app.on("browser-window-focus", function() {
  globalShortcut.register("CommandOrControl+R", () => {
    console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  });
  globalShortcut.register("F5", () => {
    console.log("F5 is pressed: Shortcut Disabled");
  });
  globalShortcut.register("CommandOrControl+Shift+R", () => {
    console.log("CommandOrControl+Shift+R is pressed: Shortcut Disabled");
  });
  globalShortcut.register("CommandOrControl+Shift+I", () => {
    console.log("CommandOrControl+Shift+I is pressed: Shortcut Disabled");
  });
  // zoom In disabled
  globalShortcut.register("CommandOrControl+=", () => {
    console.log("CommandOrControl+= is pressed: Shortcut Disabled");
  });
  globalShortcut.register("CommandOrControl+Shift+=", () => {
    console.log("CommandOrControl+= is pressed: Shortcut Disabled");
  });
  // zoom out disabled
  globalShortcut.register("CommandOrControl+-", () => {
    console.log("CommandOrControl+- is pressed: Shortcut Disabled");
  });
  globalShortcut.register("CommandOrControl+Shift+-", () => {
    console.log("CommandOrControl+= is pressed: Shortcut Disabled");
  });
  // zoom reset disabled
  globalShortcut.register("CommandOrControl+0", () => {
    console.log("CommandOrControl+0 is pressed: Shortcut Disabled");
  });
});
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", function() {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
// app.on("ready", () => {
//   installExtension(REDUX_DEVTOOLS)
//     .then((name) => console.log(`Added Extension:  ${name}`))
//     .catch((err) => console.log("An error occurred: ", err));
// });
