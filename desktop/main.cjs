const { app, BrowserWindow, systemPreferences } = require('electron');
const path = require('path');

let mainWindow;
let serverInstance = null;

// Start embedded Express backend server
async function startServer() {
  try {
    const serverPath = path.join(__dirname, '../server/src/app.js');
    const { app: expressApp } = await import(`file://${serverPath}`);
    serverInstance = expressApp.listen(8787, () => {
      console.log('[CurioForge Desktop] Embedded Express backend running on http://localhost:8787');
    });

    serverInstance.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log('[CurioForge Desktop] Port 8787 is already in use (external server running). Connecting to it.');
      } else {
        console.error('[CurioForge Desktop] Server error:', err);
      }
    });
  } catch (err) {
    console.error('[CurioForge Desktop] Failed to start embedded backend:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 840,
    minWidth: 860,
    minHeight: 620,
    backgroundColor: '#080C16',
    titleBarStyle: 'hiddenInset', // Native macOS traffic lights
    title: 'CURIOFORGE — Turning Curiosity into Invention',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Prompt macOS microphone permissions if needed
  if (process.platform === 'darwin' && systemPreferences.askForMediaAccess) {
    systemPreferences.askForMediaAccess('microphone').then((granted) => {
      console.log('[macOS Audio] Microphone access:', granted ? 'Granted' : 'Denied');
    });
  }

  // In production (or if packaged), load built client/dist/index.html
  const isDev = !app.isPackaged && process.env.NODE_ENV === 'development';
  const prodPath = path.join(__dirname, '../client/dist/index.html');

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173').catch(() => {
      mainWindow.loadFile(prodPath);
    });
  } else {
    mainWindow.loadFile(prodPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await startServer();
  createWindow();

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
