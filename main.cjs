const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

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
    win.webContents.openDevTools(); // Opcional: ver consola de navegador
  } else {
    // En producción, carga desde dist
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Interceptar apertura de nuevas ventanas para abrir enlaces en navegador externo
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Manejar solicitud para guardar archivo JSON
  ipcMain.handle('guardar-json', async () => {
    try {
      // Ruta del archivo JSON original dentro de la app
      const jsonPath = path.join(__dirname, 'src', 'data', 'preguntas.json');

      // Mostrar diálogo para elegir dónde guardar
      const { filePath, canceled } = await dialog.showSaveDialog(win, {
        title: 'Guardar archivo JSON',
        defaultPath: path.join(app.getPath('downloads'), 'Preguntas_Original.json'),
        filters: [{ name: 'JSON Files', extensions: ['json'] }]
      });

      if (canceled || !filePath) {
        return false;
      }

      // Leer contenido del archivo original
      const data = await fs.promises.readFile(jsonPath, 'utf8');

      // Escribir en la ruta elegida por el usuario
      await fs.promises.writeFile(filePath, data, 'utf8');

      return true;
    } catch (error) {
      return false;
    }
  });

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
