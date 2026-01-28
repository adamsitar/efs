const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const windowStateKeeper = require('electron-window-state');

// Environment detection
const isDev = process.env.NODE_ENV === 'development';
const VITE_DEV_SERVER = 'http://localhost:1420';

class WindowManager {
  constructor() {
    this.windows = new Map();
  }

  createWindow(type = 'main', options = {}) {
    // Restore window state
    const stateKeeper = windowStateKeeper({
      file: `window-${type}.json`,
      defaultWidth: options.width || 1200,
      defaultHeight: options.height || 800,
    });

    const win = new BrowserWindow({
      x: stateKeeper.x,
      y: stateKeeper.y,
      width: stateKeeper.width,
      height: stateKeeper.height,
      title: options.title || 'iBross EFS',
      webPreferences: {
        preload: path.join(__dirname, 'preload.cjs'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    stateKeeper.manage(win);

    // Load app
    if (isDev) {
      win.loadURL(VITE_DEV_SERVER);
      win.webContents.openDevTools();
    } else {
      win.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Store reference
    const id = win.id;
    this.windows.set(id, { type, win, options });

    win.on('closed', () => {
      this.windows.delete(id);
    });

    return win;
  }

  getWindow(id) {
    return this.windows.get(id)?.win;
  }

  getAllWindows() {
    return Array.from(this.windows.values()).map((w) => w.win);
  }
}

const windowManager = new WindowManager();

// App lifecycle
app.whenReady().then(() => {
  windowManager.createWindow('main');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.createWindow('main');
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for multi-window management (future use)
ipcMain.handle('create-window', (event, type, options) => {
  const win = windowManager.createWindow(type, options);
  return win.id;
});

ipcMain.handle('get-windows', () => {
  return Array.from(windowManager.windows.entries()).map(([id, { type, options }]) => ({
    id,
    type,
    options,
  }));
});
