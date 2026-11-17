const { app, BrowserWindow, systemPreferences } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess = null;

// Start the Express backend server
function startServer() {
  const serverPath = path.join(__dirname, '../server/src/index.js');
  serverProcess = spawn(process.execPath, [serverPath], {
    env: { ...process.env, PORT: '8787' },
    stdio: 'inherit',
  });

  serverProcess.on('error', (err) => {
    console.error('[Electron] Failed to start server:', err);
  });
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

  // Load dev server or built production file
  const devUrl = 'http://localhost:5173';
  const prodPath = path.join(__dirname, '../client/dist/index.html');

  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    mainWindow.loadURL(devUrl).catch(() => {
      // If dev server not running yet, load production dist
      mainWindow.loadFile(prodPath);
    });
  } else {
    mainWindow.loadFile(prodPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
