const path = require("path");
const os = require("os");
const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  globalShortcut,
  Notification,
} = require("electron");
const ytdl = require("ytdl-core");
const fs = require("fs");
const cp = require("child_process");
const Store = require("electron-store");
const dns = require("dns");

const isDev = process.env.IS_DEV == "true" ? true : false;

const store = new Store(); //local storage

let mainWindow = null;
let downloadPath =
  store.get("download_path") !== undefined
    ? store.get("download_path")[0]
    : path.join(os.homedir(), "Downloads");

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 950,
    height: 600,
    minWidth: 720,
    minHeight: 400,
    icon: path.join(__dirname, "../build/app.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  //remove electron default toolbar
  mainWindow.removeMenu();

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

ipcMain.on("toMain", (event, args) => {
  switch (args) {
    case "openDialog":
      const result = dialog.showOpenDialogSync({
        properties: ["openDirectory", "createDirectory"],
      });
      if (result) {
        downloadPath = result[0];
        event.sender.send("fromMain", result); //send path back to renderer process (settings overlay)
        store.set("download_path", result); //set local storage
      }
      break;
    case "initPath":
      event.sender.send("fromMain", downloadPath);
      break;
  }
});

let runningDownloads = [];

//remove item from runningDownloads array by streamId
function removeFromDownloads(id) {
  for (let i = 0; i <= runningDownloads.length - 1; i++) {
    if (runningDownloads[i].streamId == id) {
      runningDownloads.splice(i, 1);
    }
  }
}

//kill download by streamId
function killDownload(id) {
  for (let i = 0; i <= runningDownloads.length - 1; i++) {
    if (runningDownloads[i].streamId == id) {
      runningDownloads[i].type == "video"
        ? runningDownloads[i].stream.close()
        : runningDownloads[i].stream.kill();

      runningDownloads.splice(i, 1);
    }
  }
}

//download video
function download(event, args) {
  try {
    //destination path
    const videoPath = path.join(downloadPath, args.title + ".mp4");

    let stream = ytdl(args.url)
      .on("progress", (_, downloaded, total) => {
        event.sender.send(args.id, {
          downloaded: downloaded,
          total: total,
        });
      })
      .on("end", () => {
        removeFromDownloads(args.id);
        new Notification({
          title: "Download completed!",
          subtitle: "ytdownloader",
          body: args.title,
        }).show();
      })
      .pipe(fs.createWriteStream(videoPath));

    runningDownloads.push({
      streamId: args.id,
      stream: stream,
      type: "video",
    });
  } catch (error) {
    throw new Error(`An error occurred while downloading the video: ${error}`);
  }
}

//download video as auido
function downloadAudio(event, args) {
  try {
    //destination path
    const audioPath = path.join(downloadPath, args.title + ".mp3");
    //ffmpeg path
    const ffmpeg = isDev
      ? path.join(__dirname, "../ffmpeg", "ffmpeg.exe")
      : path.join(__dirname, "../../ffmpeg", "ffmpeg.exe");

    //ytdl stream
    let stream = ytdl(args.url).on("progress", (_, downloaded, total) => {
      event.sender.send(args.id, {
        downloaded: downloaded,
        total: total,
      });
    });

    //child process for ffmpeg
    //extract audio from stream
    const ffmpegProcess = cp.spawn(
      ffmpeg,
      ["-loglevel", "8", "-hide_banner", "-i", "pipe:3", audioPath],
      { windowsHide: true, stdio: ["inherit", "inherit", "inherit", "pipe"] }
    );

    //when child process has done
    ffmpegProcess.on("close", (code) => {
      stream.destroy();
      if (code == 0) {
        removeFromDownloads(args.id);
        new Notification({
          title: "Download completed!",
          subtitle: "ytdownloader",
          body: args.title,
        }).show();
      }
    });

    //handle child process's error
    ffmpegProcess.on("error", (err) => {
      throw new Error(`ffmpeg process error: ${err}`);
    });

    //ytdl stream pipe
    stream.pipe(ffmpegProcess.stdio[3]);

    runningDownloads.push({
      streamId: args.id,
      stream: ffmpegProcess,
      type: "music",
    });
  } catch (error) {
    throw new Error(`An error occurred while downloading the music: ${error}`);
  }
}

//for video download
ipcMain.on("toDownload", (event, args) => {
  download(event, args);
});

//for audio download
ipcMain.on("toDownloadAudio", (event, args) => {
  downloadAudio(event, args);
});

ipcMain.on("killDownload", (event, args) => {
  killDownload(args);
});

//check internet connection
function checkInternet() {
  dns.resolve("www.google.com", (err) => {
    if (err) {
      mainWindow.webContents.send("connection", false);
    } else {
      mainWindow.webContents.send("connection", true);
    }
  });
}

setInterval(() => {
  checkInternet();
}, 5000);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  //disable default browser shortcuts in production mode
  if (!isDev) {
    globalShortcut.register("ctrl+shift+i", () => {});
    globalShortcut.register("ctrl+shift+r", () => {});
    globalShortcut.register("ctrl+r", () => {});
    globalShortcut.register("f12", () => {});
    globalShortcut.register("f11", () => {});
    globalShortcut.register("f5", () => {});
  }

  globalShortcut.register("ctrl+shift+i", () => {
    mainWindow.webContents.openDevTools();
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
