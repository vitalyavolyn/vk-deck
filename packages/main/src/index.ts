import path from 'path'
import { URL, fileURLToPath } from 'url'
import { app, BrowserWindow, Menu, MenuItem } from 'electron'
import windowStateKeeper from 'electron-window-state'
import { initIpc } from './ipc'

const isSingleInstance = app.requestSingleInstanceLock()

if (!isSingleInstance) {
  app.quit()
  process.exit(0)
}

app.disableHardwareAcceleration()

if (import.meta.env.MODE === 'development') {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
    }) => installExtension(REACT_DEVELOPER_TOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    }))
    .catch(error => console.error('Failed install extension:', error))
}

let mainWindow: BrowserWindow | undefined

const createWindow = async () => {
  // сохраняет позицию и размер окна
  const windowState = windowStateKeeper({})

  mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nativeWindowOpen: true,
      webSecurity: false,
      preload: path.join(path.dirname(fileURLToPath(import.meta.url)), '../../preload/dist/index.cjs'),
    },
    ...windowState,
  })

  // const contentBounds = mainWindow.getContentBounds()
  // view.setBounds({ x: 0, y: 0, width: contentBounds.width, height: contentBounds.height })
  // view.setAutoResize({ vertical: true, horizontal: true })

  // mainWindow.setBrowserView(view)

  windowState.manage(mainWindow)
  initIpc(mainWindow)

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()

    if (import.meta.env.MODE === 'development') {
      mainWindow?.webContents.openDevTools()
    }
  })

  const pageUrl = import.meta.env.MODE === 'development' && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL(
      '../renderer/dist/index.html',
      'file://' + path.dirname(fileURLToPath(import.meta.url)),
    ).toString()

  // подсказки исправлений слов
  mainWindow.webContents.on('context-menu', (event, params) => {
    const menu = new Menu()

    for (const suggestion of params.dictionarySuggestions) {
      menu.append(new MenuItem({
        label: suggestion,
        click: () => mainWindow?.webContents.replaceMisspelling(suggestion),
      }))
    }

    if (params.misspelledWord) {
      menu.append(
        new MenuItem({
          label: 'Добавить в словарь',
          click: () => mainWindow?.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord),
        }),
      )
    }

    if (menu.items.length) menu.popup()
  })

  await mainWindow.webContents.loadURL(pageUrl)
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady()
  .then(createWindow)
  .catch((error) => console.error('Failed create window:', error))

if (import.meta.env.PROD) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((error) => console.error('Failed check updates:', error))
}
