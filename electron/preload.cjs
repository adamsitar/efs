const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Window management
  createWindow: (type, options) => ipcRenderer.invoke('create-window', type, options),
  getWindows: () => ipcRenderer.invoke('get-windows'),

  // Future: Native Rust modules via Napi-rs will be exposed here
  // asterix: {
  //   parse: (buffer) => nativeModule.parseAsterix(buffer)
  // }
});
