import { join } from 'path'
import { URL } from 'url'
import { app, BrowserView, BrowserWindow, Menu, MenuItem } from 'electron'
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
      REACT_DEVELOPER_TOOLS
    }) => installExtension(REACT_DEVELOPER_TOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true
      }
    }))
    .catch(e => console.error('Failed install extension:', e))
}

let mainWindow: BrowserWindow | null = null

const createWindow = async () => {
  // сохраняет позицию и размер окна
  const windowState = windowStateKeeper({})

  mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    ...windowState
  })

  const view = new BrowserView({
    webPreferences: {
      nativeWindowOpen: true,
      preload: join(__dirname, '../../preload/dist/index.cjs')
    }
  })

  view.setBounds({ ...windowState, x: 0, y: 0 })
  view.setAutoResize({ vertical: true, horizontal: true })

  mainWindow.setBrowserView(view)

  windowState.manage(mainWindow)
  initIpc(mainWindow)

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  view.webContents.on('dom-ready', () => {
    mainWindow?.show()

    if (import.meta.env.MODE === 'development') {
      view?.webContents.openDevTools()
    }
  })

  const pageUrl = import.meta.env.MODE === 'development' && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString()

  // подсказки исправлений слов
  view.webContents.on('context-menu', (event, params) => {
    const menu = new Menu()

    for (const suggestion of params.dictionarySuggestions) {
      menu.append(new MenuItem({
        label: suggestion,
        click: () => mainWindow?.webContents.replaceMisspelling(suggestion)
      }))
    }

    if (params.misspelledWord) {
      menu.append(
        new MenuItem({
          label: 'Добавить в словарь',
          click: () => mainWindow?.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
        })
      )
    }

    if (menu.items.length) menu.popup()
  })

  await view.webContents.loadURL(pageUrl)
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
  .catch((e) => console.error('Failed create window:', e))

if (import.meta.env.PROD) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e))
}
