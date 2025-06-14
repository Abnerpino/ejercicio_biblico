const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

const isDev = !app.isPackaged; // Si NO está empaquetado, estamos en desarrollo

function createWindow() {
  const win = new BrowserWindow({
    width: 1300,
    height: 800,
    icon: path.join(__dirname, 'dist', 'iasd.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  if (isDev) {
    // En desarrollo, carga desde Vite
    win.loadURL('http://localhost:5173');
    //win.webContents.openDevTools(); // Opcional: ver consola de navegador
  } else {
    // En producción, carga desde dist
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Elimina el menú
  Menu.setApplicationMenu(null);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('cerrar-app', () => {
  app.quit();
});
