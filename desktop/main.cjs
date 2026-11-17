const { app, BrowserWindow, systemPreferences, session } = require('electron');
const path = require('path');
const http = require('http');

let mainWindow;
let serverInstance = null;

// Start embedded Express backend server
async function startServer() {
  try {
    const serverPath = path.join(__dirname, '../server/src/app.js');
    console.log('[CurioForge Desktop] Starting embedded backend from:', serverPath);
    const { app: expressApp } = await import(`file://${serverPath}`);
    serverInstance = expressApp.listen(8787, '127.0.0.1', () => {
      console.log('[CurioForge Desktop] Embedded Express backend running on http://127.0.0.1:8787');
    });

    serverInstance.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log('[CurioForge Desktop] Port 8787 is already active. Reusing server.');
      } else {
        console.error('[CurioForge Desktop] Server error:', err);
      }
    });
  } catch (err) {
    console.error('[CurioForge Desktop] Failed to start embedded backend:', err);
  }
}

function waitForServer(url, timeoutMs = 8000) {
  const start = Date.now();
  return new Promise((resolve) => {
    function check() {
      const req = http.get(url, (res) => {
        if (res.statusCode < 500) {
          resolve(true);
        } else {
          retry();
        }
      });
      req.on('error', retry);
      req.setTimeout(800, () => {
        req.destroy();
        retry();
      });
    }
    function retry() {
      if (Date.now() - start > timeoutMs) {
        resolve(false);
      } else {
        setTimeout(check, 150);
      }
    }
    check();
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 640,
    backgroundColor: '#080C16',
    titleBarStyle: 'hiddenInset', // Native macOS traffic lights
    title: 'CURIOFORGE — Turning Curiosity into Invention',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Ensures audio streams & local API fetch work reliably
      allowRunningInsecureContent: true,
    },
  });

  // Automatically approve microphone access for live speech recognition
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      return callback(true);
    }
    callback(true);
  });

  session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
    if (permission === 'media') {
      return true;
    }
    return true;
  });

  // Prompt macOS microphone permissions
  if (process.platform === 'darwin' && systemPreferences.askForMediaAccess) {
    systemPreferences.askForMediaAccess('microphone').catch(() => {});
  }

  // Handle load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('[CurioForge Desktop] Load failure:', errorCode, errorDescription);
  });

  // Wait for local backend on port 8787 to be ready
  const serverReady = await waitForServer('http://127.0.0.1:8787/api/health', 7000);
  const prodPath = path.join(__dirname, '../client/dist/index.html');

  if (serverReady) {
    console.log('[CurioForge Desktop] Server verified ready. Loading http://127.0.0.1:8787');
    mainWindow.loadURL('http://127.0.0.1:8787');
  } else {
    console.log('[CurioForge Desktop] Loading local bundle fallback:', prodPath);
    mainWindow.loadFile(prodPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await startServer();
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (serverInstance) {
    try {
      serverInstance.close();
    } catch (_) {}
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (serverInstance) {
    try {
      serverInstance.close();
    } catch (_) {}
  }
});