const {
    app,
    BrowserWindow
  } = require('electron');
  



let appWindow;

if (require('electron-squirrel-startup')) app.quit();
  
function createWindow() {
    appWindow = new BrowserWindow({
    width: 1000,
    height: 800
  });
  
  appWindow.loadFile('./src/renderer/index.html');
  
  appWindow.on('closed', function () {
  appWindow = null;
  });
}
  
app.whenReady().then(() => {
  createWindow();
});
  
