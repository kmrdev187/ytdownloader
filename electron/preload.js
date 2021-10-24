const { contextBridge, ipcRenderer } = require("electron");
const { validateURL, getBasicInfo } = require("ytdl-core");

contextBridge.exposeInMainWorld("ipc", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});

contextBridge.exposeInMainWorld("ytdl", {
  validate: (url) => {
    return validateURL(url);
  },
  getInfo: (url) => {
    return getBasicInfo(url);
  },
});
