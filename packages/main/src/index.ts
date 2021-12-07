import path from 'path'
import { URL, fileURLToPath } from 'url'
import { app, BrowserWindow, shell } from 'electron'
import contextMenu from 'electron-context-menu'
import windowStateKeeper from 'electron-window-state'
import i18n from 'i18next'
import { initIpc } from '@/ipc'
import ru from '@/locales/ru.yml'

const isSingleInstance = app.requestSingleInstanceLock()

if (!isSingleInstance) {
  app.quit()
  process.exit(0)
}

app.disableHardwareAcceleration()

i18n.init({
  fallbackLng: 'ru',
  resources: { ru },
})

if (import.meta.env.MODE === 'development') {
  app
    .whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({ default: installExtension, REACT_DEVELOPER_TOOLS }) =>
      installExtension(REACT_DEVELOPER_TOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      }),
    )
    .catch((error) => console.error('Failed install extension:', error))
}

let mainWindow: BrowserWindow | undefined

const createWindow = async () => {
  // сохраняет позицию и размер окна
  const windowState = windowStateKeeper({})

  mainWindow = new BrowserWindow({
    minWidth: 400,
    minHeight: 550,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nativeWindowOpen: true,
      webSecurity: false,
      preload: path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../preload/dist/index.cjs',
      ),
    },
    ...windowState,
  })

  // TODO: меню на макоси
  if (process.platform !== 'darwin') {
    mainWindow.removeMenu()
  }

  windowState.manage(mainWindow)
  initIpc(mainWindow)
  contextMenu({
    labels: {
      copy: i18n.t`contextmenu.copy`,
      paste: i18n.t`contextmenu.paste`,
      cut: i18n.t`contextmenu.cut`,
      learnSpelling: i18n.t`contextmenu.learnSpelling`,
      searchWithGoogle: i18n.t`contextmenu.searchWithGoogle`,
      copyLink: i18n.t`contextmenu.copyLink`,
      copyImage: i18n.t`contextmenu.copyImage`,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()

    if (import.meta.env.MODE === 'development') {
      mainWindow?.webContents.openDevTools()
    }
  })

  const pageUrl =
    import.meta.env.MODE === 'development' &&
    import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL(
          '../renderer/dist/index.html',
          'file://' + path.dirname(fileURLToPath(import.meta.url)),
        ).toString()

  // открытие сторонних ссылок в браузере
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
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

app
  .whenReady()
  .then(createWindow)
  .catch((error) => console.error('Failed create window:', error))

// TODO: проверить, работает ли вообще это
// и хочу ли я обновления
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('./auto-updater'))
    .then(({ checkForUpdatesAndNotify }) =>
      checkForUpdatesAndNotify(mainWindow!),
    )
}
