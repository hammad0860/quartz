const { app, BrowserWindow, ipcMain, shell } = require("electron");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");
const { resolveHtmlPath } = require("./util.js");
const { spawn, exec } = require('child_process');
const os = require('os');
const systeminformation = require('systeminformation');
const axios = require('axios');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

app.disableHardwareAcceleration();


class AppUpdater {
  constructor() {
    log.transports.file.level = "info";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

if (require('electron-squirrel-startup')) app.quit();
//Maybe try removing the above if it causes issues later


if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";
if (isDevelopment) {
  require("electron-debug")();
}

const getExtractPath = () => {
  if (os.platform() === 'win32') {
    return path.join('C:', 'Documents', 'xmrig');
  } else if (os.platform() === 'linux') {
    return path.join(os.homedir(), 'xmrig');
  } else if (os.platform() === 'darwin') {
    return path.join('/Users', os.userInfo().username, 'xmrig');
  } else {
    throw new Error('Unsupported platform');
  }
};

let extractedFolderName = "";

const getDownloadPath = () => {
  const tempPath = app.getPath('temp');
  switch (os.platform()) {
    case 'win32':
    case 'linux':
    case 'darwin':
      return path.join(tempPath, 'xmrig.tar.gz');
    default:
      throw new Error('Unsupported platform');
  }
};

const getDownloadUrl = () => {
  switch (os.platform()) {
    case 'win32':
      return 'https://github.com/xmrig/xmrig/releases/download/v6.21.3/xmrig-6.21.3-msvc-win64.zip';
    case 'linux':
      return 'https://github.com/xmrig/xmrig/releases/download/v6.21.3/xmrig-6.21.3-linux-static-x64.tar.gz';
    case 'darwin':
      const arch = os.arch();
      return arch === 'arm64'
        ? 'https://github.com/xmrig/xmrig/releases/download/v6.21.3/xmrig-6.21.3-macos-arm64.tar.gz'
        : 'https://github.com/xmrig/xmrig/releases/download/v6.21.3/xmrig-6.21.3-macos-x64.tar.gz';
    default:
      throw new Error('Unsupported platform');
  }
};

const findExtractedFolderName = (extractPath) => {
  const extractedItems = fs.readdirSync(extractPath);
  return extractedItems.find((item) => {
    return fs.statSync(path.join(extractPath, item)).isDirectory();
  }) || "";
};

const downloadAndExtractFile = async () => {
  const url = getDownloadUrl();
  const downloadPath = getDownloadPath();
  const extractPath = getExtractPath();
  try {
    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath, { recursive: true });
      console.log(`Directory ${extractPath} created if the path does not exist.`);
    }

    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(downloadPath);
    response.data.pipe(writer);

    writer.on('finish', () => {
      if (os.platform() === "darwin" || os.platform() === "linux") {
        extractedFolderName = findExtractedFolderName(extractPath)
        if (!extractedFolderName) {
          exec(`tar -xzf ${downloadPath} -C ${extractPath}`, (error) => {
            extractedFolderName = findExtractedFolderName(extractPath)
            if (error) {
              console.error(`Error extracting file: ${error}`);
              return;
            }
            console.log(`Files extracted to ${extractPath}`);
          });
          extractedFolderName = findExtractedFolderName(extractPath)
        } else {
          console.log(`Folder ${path.join(extractPath, extractedFolderName)} already exists, skipping extraction.`);
        }
      } else {
        extractedFolderName = findExtractedFolderName(extractPath)
        if (!extractedFolderName) {
          console.log("Unzipping Process starts");
          const zip = new AdmZip(downloadPath);
          zip.extractAllTo(extractPath, true);
          console.log(`Files extracted to ${extractPath}`);
          extractedFolderName = findExtractedFolderName(extractPath)
        } else {
          console.log(`Folder ${path.join(extractPath, extractedFolderName)} already exists, skipping extraction.`);
        }
      }
    });

    writer.on('error', (err) => {
      console.error('Error writing the file:', err);
    });
  } catch (error) {
    console.error('Error downloading the file:', error);
  }
};

downloadAndExtractFile()

const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS"];
  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }
  app.commandLine.appendSwitch("enable-features=OverlayScrollbar");

  function getPlatformIcon() {
    if (process.platform === "win32") {
      return path.join(__dirname, "icons", "icon.ico");
    } else if (process.platform() === "darwin") {
      return path.join(__dirname, "icons", "icon.icns");
    } else {
      return path.join(__dirname, "icons", "icon-512x512.png");
    }
  }

  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1020,
    frame: true,
    paintWhenInitiallyHidden: true,
    backgroundColor: "#080a0f",
    title: "Myriade",
    autoHideMenuBar: true,
    resizable: true,
    icon: getPlatformIcon(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,

    },
  });




  mainWindow.loadURL(resolveHtmlPath("index.html"));
  app.on("ready", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  process.on("uncaughtException", function (err) {
    console.log(err, "uncaught exceptions");
  });

  app.on("window-all-closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.on("new-window", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  ipcMain.handle('get-system-info', async () => {
    try {
      let { main: temperature } = await systeminformation.cpuTemperature()
      temperature = "N/A"
      const currentLoad = await systeminformation.currentLoad();
      const cpu = await systeminformation.cpu();
      return {
        temperature,
        load: currentLoad.currentload,
        cpu: cpu.manufacturer + ' ' + cpu.brand
      };
    } catch (error) {
      console.error('Error getting system information:', error);
      return { error: error.message };
    }
  });
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

let appProcess;

ipcMain.on('start-xmrig', (event) => {
  let appPath;
  if (os.platform() === 'win32') {
    appPath = `C:\\Documents\\xmrig\\${extractedFolderName}\\start.cmd`;
  } else if (os.platform() === 'linux') {
    appPath = `${os.homedir()}/xmrig/${extractedFolderName}/xmrig`;
  } else if (os.platform() === 'darwin') {
    appPath = `/Users/${os.userInfo().username}/xmrig/${extractedFolderName}/xmrig`;
  } else {
    console.error('Unsupported platform');
    return;
  }

  appProcess = spawn(appPath, {
    detached: false,
    stdio: ['pipe', 'pipe']
  });

  appProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  appProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  appProcess.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });
  event.reply('xmrig-started', true);
});

ipcMain.on('stop-xmrig', (event) => {
  if (appProcess) {
    appProcess.kill("SIGTERM");
    exec('netstat -ano', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing netstat: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error output from netstat: ${stderr}`);
        return;
      }
      const lines = stdout.split('\n');

      lines.forEach(line => {
        const match = line.match(/TCP\s+\S+:(\d+)\s+\S+:8222\s+\S+\s+(\d+)/);

        if (match) {
          const localPort = match[1];
          const pid = match[2];
          exec(`taskkill /pid ${pid} /t /f`, (err, stdout, stderr) => {
            if (err) {
              console.error(`Error closing cmd window: ${err.message}`);
              return;
            }
            console.log("cmd window closed successfully.");
          });
          console.log("XMRig process terminated.");
        }
      });
    });
  }
});

ipcMain.on('change-config', (event, data) => {
  const extractPath = getExtractPath();
  const configFilePath = path.join(extractPath, extractedFolderName, 'config.json');

  const newConfig = {
    "autosave": true,
    "cpu": {
      "memory-pool": true
    },
    "donate-level": 0,
    "donate-over-proxy": 1,
    "pools": [
      {
        "algo": "rx/0",
        "coin": "monero",
        "url": data.url,
        "user": data.user,
        "rig-id": null,
        "nicehash": false,
        "keepalive": true,
        "enabled": true,
        "tls": false,
        "tls-fingerprint": null,
        "daemon": false,
        "self-select": null
      }
    ],
    "print-time": 10,
    "health-print-time": 60,
    "retries": 5,
    "retry-pause": 5,
    "syslog": false,
    "user-agent": "Myriade Client",
    "watch": true
  };

  fs.writeFile(configFilePath, JSON.stringify(newConfig, null, 2), 'utf8', (err) => {
    if (err) {
      console.error("Error writing to config.json:", err);
    } else {
      console.log("config.json updated successfully");
    }
  });
});
