import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer';

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  const bounds = screen.getPrimaryDisplay().bounds;

  const width = 1100;
  const height = Math.round(bounds.height * 0.7);

  mainWindow = new BrowserWindow({
    x: bounds.x + (bounds.width - width) / 2,
    y: bounds.y + (bounds.height - height) / 2,
    width: width,
    height: height,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true
    },
    frame: process.env.NODE_ENV === 'development',
    // alwaysOnTop: true,
    movable: true,
    resizable: false,
    center: true,
    modal: true
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000');
  } else {
    mainWindow.on('blur', () => mainWindow?.close());

    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app
  .on('ready', createWindow)
  .whenReady()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
      installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    }
  });
app.allowRendererProcessReuse = true;
