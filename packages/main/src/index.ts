import path from 'path'
import { URL, fileURLToPath } from 'url'
import { app, BrowserWindow, shell } from 'electron'
import contextMenu from 'electron-context-menu'
import windowStateKeeper from 'electron-window-state'
import i18next from 'i18next'
import ru from '@/locales/ru.yml'
import { initIpc } from './ipc'

const isSingleInstance = app.requestSingleInstanceLock()

if (!isSingleInstance) {
  app.quit()
  process.exit(0)
}

app.disableHardwareAcceleration()

i18next.init({
  fallbackLng: 'ru',
  resources: { ru },
  debug: true,
})

const { t } = i18next

export const preloadPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../preload/dist/index.cjs',
)

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
    .catch((error) => console.error('Failed to install extension:', error))
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
      preload: preloadPath,
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
      copy: t`contextmenu.copy`,
      paste: t`contextmenu.paste`,
      cut: t`contextmenu.cut`,
      learnSpelling: t`contextmenu.learnSpelling`,
      searchWithGoogle: t`contextmenu.searchWithGoogle`,
      copyLink: t`contextmenu.copyLink`,
      copyImage: t`contextmenu.copyImage`,
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
