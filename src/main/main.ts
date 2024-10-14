//import { app, BrowserWindow, ipcMain, shell } from "electron";
const { app, BrowserWindow, ipcMain, shell } = require("electron");

//import log from "electron-log";
const log = require("electron-log");


//import { autoUpdater } from "electron-updater";
//import { resolveHtmlPath } from "./util";
const { autoUpdater } = require("electron-updater");
const { resolveHtmlPath } = require("./util");

const { spawn, exec } = require('child_process');
const os = require('os');

//import systeminformation from 'systeminformation';
//import axios from 'axios';
//import AdmZip from 'adm-zip';
//import fs from 'fs';
//import path from 'path';
const systeminformation = require('systeminformation');
const axios = require('axios');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

class AppUpdater {
  constructor() {
    log.transports.file.level = "info";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

module.exports = AppUpdater;


//let mainWindow: BrowserWindow | null = null;
let mainWindow = null;


if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";
if (isDevelopment) {
  require("electron-debug")();
}

// Determine the dynamic extraction path based on the operating system
const getExtractPath = () => {
  if (os.platform() === 'win32') {
    return path.join('C:', 'Program Files', 'xmrig');
  } else if (os.platform() === 'linux') {
    return path.join(os.homedir(), 'xmrig');
  } else if (os.platform() === 'darwin') {
    return path.join('/Users', os.userInfo().username, 'xmrig');
  } else {
    throw new Error('Unsupported platform');
  }
};

//let extractedFolderName: string = "";
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
          // If the folder does not exist. Then unzip the downloaded file.
          exec(`tar -xzf ${downloadPath} -C ${extractPath}`, (error) => {
            extractedFolderName = findExtractedFolderName(extractPath)
            if (error) {
              console.error(`Error extracting file: ${error}`);
              return;
            }
            console.log(`Files extracted to ${extractPath}`);
          });
          // Reassigning the name to extractedFolderName after unzipping the file
          extractedFolderName = findExtractedFolderName(extractPath)
        } else {
          console.log(`Folder ${path.join(extractPath, extractedFolderName)} already exists, skipping extraction.`);
        }
      } else {
        // Check if the extracted folder already exists  
        extractedFolderName = findExtractedFolderName(extractPath)
        if (!extractedFolderName) {
          // If the folder does not exist. Then unzip the downloaded file.
          console.log("Unzipping Process starts");
          const zip = new AdmZip(downloadPath);
          zip.extractAllTo(extractPath, true);
          console.log(`Files extracted to ${extractPath}`);
          // Reassigning the name to extractedFolderName after unzipping the file
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
      return path.join(__dirname, "icons", "icon.ico"); // Windows
    } else if (process.platform === "darwin") {
      return path.join(__dirname, "icons", "icon.icns"); // macOS
    } else {
      return path.join(__dirname, "icons", "icon-512x512.png"); // Linux and others
    }
  }

  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1020,
    frame: true,
    paintWhenInitiallyHidden: true,
    backgroundColor: "#080a0f",
    // show: false,
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

  //const menuBuilder = new MenuBuilder(mainWindow);
  //menuBuilder.buildMenu();
  // Open urls in the user's browser

  mainWindow.webContents.on("new-window", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();

  ipcMain.handle('get-system-info', async () => {
    try {
      // This brings the temperature however the temperature is not shown correctly
      let { main: temperature } = await systeminformation.cpuTemperature()
      // over-riding the temperature variable with a hard coaded string
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

//let appProcess: any;
let appProccess;

ipcMain.on('start-xmrig', (event) => {
  let appPath;
  // For Windows
  if (os.platform() === 'win32') {
    // Path for windows
    appPath = `C:\\Program Files\\xmrig\\${extractedFolderName}\\start.cmd`;
    // For Linux
  } else if (os.platform() === 'linux') {
    // Path for linux
    appPath = `${os.homedir()}/xmrig/${extractedFolderName}/xmrig`;
    // For Mac
  } else if (os.platform() === 'darwin') {
    // Path for Mac
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
    // First, kill the XMRig process
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
      // stdout contains the entire netstat output
      const lines = stdout.split('\n');

      lines.forEach(line => {
        // Match lines with TCP and extract local port and remote port
        const match = line.match(/TCP\s+\S+:(\d+)\s+\S+:8222\s+\S+\s+(\d+)/);

        if (match) {
          const localPort = match[1]; // Local port
          const pid = match[2];        // Process ID
          // Then, kill the specific cmd.exe process using its PID
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

  // Define the new config object
  const newConfig = {
    "autosave": true,
    "cpu": {
      "memory-pool": true
    },
    "donate-level": 0, // Set donate-level to 0 as per your requirement
    "donate-over-proxy": 1,
    "pools": [
      {
        "algo": "rx/0",
        "coin": "monero",
        "url": data.url, // Use data.url
        "user": data.user, // Use data.user
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

  // Write the new config object to the config.json file
  fs.writeFile(configFilePath, JSON.stringify(newConfig, null, 2), 'utf8', (err) => {
    if (err) {
      console.error("Error writing to config.json:", err);
    } else {
      console.log("config.json updated successfully");
    }
  });
});
