import { app, protocol, BrowserWindow, ipcMain, Menu, MenuItem, shell, dialog, globalShortcut } from 'electron'
import {
  createProtocol
  // installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { autoUpdater } from 'electron-updater'
import getMAC from 'getmac'
import os from 'os'
var path = require('path')
var feedUrl = ''
var versionUrl = ''
const pf = os.platform()
let platform = ''
switch (pf) {
  case 'darwin':
    platform = 'macOS'
    break
  case 'win32':
    platform = 'Windows'
    break
  default:
    break
}
if (process.env.VUE_APP_API == 'https://www.pageguo.com/api-test/') {
  if (platform == 'macOS') {
    feedUrl = 'https://storage.pageguo.com/download/crm_v2_mac/' // 更新包位置
  } else {
    feedUrl = 'https://storage.pageguo.com/download/crm_v2_win/' // 更新包位置
  }
  versionUrl = 'https://www.pageguo.com/version.html'
} else {
  if (platform == 'macOS') {
    feedUrl = 'https://storage3.wallstreettequila.com/download/crm_v2_mac/' // 更新包位置
  } else {
    feedUrl = 'https://storage3.wallstreettequila.com/download/crm_v2_win/' // 更新包位置
  }
  versionUrl = 'https://www.wallstreettequila.com/version.html'
}
const isDevelopment = process.env.NODE_ENV !== 'production'
const exec = require('child_process').exec // 执行cmd命令
const packageMsg = require('../package.json')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}])

function createWindow () {
  const pf = os.platform()
  let platform = ''
  switch (pf) {
    case 'darwin':
      platform = 'macOS'
      break
    case 'win32':
      platform = 'Windows'
      break
    default:
      break
  }
  win = new BrowserWindow({
    show: false,
    width: 1270,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      plugins: true,
      nativeWindowOpen: true
    }
  })
  win.maximize()
  win.show()
  // 设置打开窗体
  win.webContents.setWindowOpenHandler(data => {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        width: 1270,
        height: 900,
        webPreferences: {
          contextIsolation: false,
          nodeIntegration: true
        }
      }
    }
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}?mac=${uniqueId}&hostname=${os.hostname() || ''}&platform=${platform || ''}`)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL(`app://./index.html?mac=${uniqueId}&hostname=${os.hostname() || ''}&platform=${platform || ''}`)
  }
  win.on('closed', () => {
    win = null
  })
  win.on('focus', () => {
    globalShortcut.register('CommandOrControl+F', function () {
      if (win && win.webContents) {
        win.webContents.send('on-find', '')
      }
    })
  })
  win.on('blur', () => {
    globalShortcut.unregister('CommandOrControl+F')
  })
  createMenu()
  function handleUpdate () {
    const returnData = {
      error: { status: -1, msg: '检测更新查询异常' },
      checking: { status: 0, msg: '正在检查应用程序更新' },
      updateAva: { status: 1, msg: '正在下载,请稍后' },
      updateNotAva: { status: -2, msg: '服务器版本未最新,请联系管理员!' }
    }
    if (process.env.NODE_ENV === 'development') {
      // autoUpdater.updateConfigPath = path.join(__dirname, '../dist_electron_test_online/win-unpacked/resources/app-update.yml')
      autoUpdater.updateConfigPath = path.join(__dirname, '../app-update.yml')
    } else {
      autoUpdater.updateConfigPath = path.join(__dirname, '../app-update.yml')
    }
    // 和之前package.json配置的一样
    autoUpdater.setFeedURL(feedUrl)

    // 更新错误
    autoUpdater.on('error', function (error) {
      sendUpdateMessage({ err: error, status: 10087 })
    })

    // 检查中
    autoUpdater.on('checking-for-update', function () {
      sendUpdateMessage(returnData.checking)
    })

    // 发现新版本
    autoUpdater.on('update-available', function (info) {
      sendUpdateMessage(returnData.updateAva)
    })

    // 当前版本为最新版本
    autoUpdater.on('update-not-available', function (info) {
      setTimeout(function () {
        sendUpdateMessage(returnData.updateNotAva)
      }, 1000)
    })

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
      sendUpdateMessage({ status: 3, msg: progressObj })
      win.webContents.send('downloadProgress', progressObj)
      win.setProgressBar(progressObj.percent / 100)
    })

    // 下载完毕 旧
    // autoUpdater.on('update-downloaded', function (releaseInfo) {
    //   console.log("更新包说明：",JSON.stringify(releaseInfo));
    //   //退出并进行安装（这里可以做成让用户确认后再调用）
    //   win.webContents.send('downloaded', returnData.downloaded,releaseInfo)
    // });

    // 下载完毕
    autoUpdater.on('update-downloaded', function (event, quitAndUpdate) {
      // 查看日志 更新完毕后安装， 走confirm-update，此处占时注释
      // sendUpdateMessage('下载完成即将关闭并自动更新！！')
      autoUpdater.quitAndInstall()
    })
  }
  handleUpdate()
  function sendUpdateMessage (text) {
    win.webContents.send('message', text)
  }

  ipcMain.on('checkForUpdate', (event, data) => {
    console.log('执行自动更新检查!!!')
    // event.sender.send('reply', 'hi lee my name is yuan, age is 17');
    autoUpdater.checkForUpdates()
  })

  ipcMain.on('confirm-update', (event, data) => {
    autoUpdater.quitAndInstall()
  })
}

function createMenu () {
  const menu = Menu.getApplicationMenu()
  menu.append(new MenuItem({
    label: 'About',
    submenu: [{
      label: 'Update Log',
      click: function () {
        shell.openExternal(versionUrl)
      }
    },
    { type: 'separator' },
    { label: 'Version: ' + packageMsg.version }]
  }))
  Menu.setApplicationMenu(menu)
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
  globalShortcut.unregister('CommandOrControl+F')
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // await installVueDevtools()
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  getUUID.then(function () {
    createWindow()
    require('@electron/remote/main').initialize() // 初始化
    require('@electron/remote/main').enable(win.webContents)
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

let uniqueId = ' '
var getUUID = new Promise(function (resolve, reject) {
  const cmdWin = 'wmic csproduct get UUID'
  const cmdMac = 'your command code'
  const macid = getMAC()
  let uuid = ' '
  if (process.platform == 'darwin') {
    // todo Mac
    uuid = macid
    resolve('get uuid success') // 代码正常执行！
  } else if (process.platform == 'win32') {
    // windows
    let workerProcess
    workerProcess = exec(cmdWin, { cwd: '' })
    workerProcess.stdout.on('data', function (data) {
      console.log('stdout: ' + data)
      uuid = data.split('\r\n')[1]
      // uuid异常的话使用macid
      uuid == 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF' ? uniqueId = macid : uniqueId = uuid
      resolve('get uuid success') // 代码正常执行！
    })
  }
})
