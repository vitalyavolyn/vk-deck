import path from 'path'
import { fileURLToPath, URL, URLSearchParams } from 'url'
import { BrowserView, BrowserWindow, ipcMain } from 'electron'
import { preloadPath } from '@/index'

let viewerWindow: BrowserWindow | undefined

const closeViewer = () => {
  viewerWindow?.close()
  viewerWindow = undefined
}

export function initIpc(win: BrowserWindow): void {
  ipcMain.on('create-browser-view', (e) => {
    const view = new BrowserView({
      webPreferences: {
        nativeWindowOpen: true,
        nodeIntegration: false,
      },
    })

    win.addBrowserView(view)
    view.setBounds({ ...win.getBounds(), x: 0, y: 0 })
    view.setAutoResize({ horizontal: true, vertical: true })

    const authURL = 'https://oauth.vk.com/authorize'
    const redirectURL = 'https://oauth.vk.com/blank.html'
    const params = {
      client_id: '7446716',
      redirect_uri: redirectURL,
      response_type: 'token',
      scope: 'offline,wall,friends,groups',
      revoke: '1',
      display: 'mobile',
    }

    view.webContents.loadURL(`${authURL}?${new URLSearchParams(params)}`)
    view.webContents.on('will-navigate', (_, url) => {
      if (url.startsWith(redirectURL)) {
        win.removeBrowserView(view)

        const result = new URLSearchParams(new URL(url).hash.slice(1))

        e.reply('auth-info', result.get('access_token'))
      }
    })
  })

  ipcMain.on('close-viewer', () => {
    closeViewer()
  })

  ipcMain.on('open-viewer', () => {
    closeViewer()

    const pageName = 'viewer.html'
    // как-то объединить с кодом в index.ts
    const url =
      import.meta.env.MODE === 'development' &&
      import.meta.env.VITE_DEV_SERVER_URL !== undefined
        ? new URL(pageName, import.meta.env.VITE_DEV_SERVER_URL)
        : new URL(
            `../renderer/dist/${pageName}`,
            'file://' + path.dirname(fileURLToPath(import.meta.url)),
          )

    viewerWindow = new BrowserWindow({
      // minWidth: e.width,
      // minHeight: e.height,
      frame: false,
      show: false,
      maximizable: false,
      minimizable: false,
      resizable: false,
      movable: false,
      hasShadow: false,
      transparent: true,
      alwaysOnTop: true,
      // backgroundColor: (0, _.getFullscreenBackgroundColor)(),
      type: 'toolbar',
      skipTaskbar: true,
      webPreferences: {
        preload: preloadPath,
      },
    })

    // on mac
    // win.setAlwaysOnTop(!0,"screen-saver")

    viewerWindow.webContents.loadURL(url.toString())

    viewerWindow.on('ready-to-show', () => {
      // открывается не всегда на том же мониторе, где приложение
      viewerWindow?.show()
      viewerWindow?.setFullScreen(true)

      // if (import.meta.env.MODE === 'development') {
      //   viewerWindow.webContents.openDevTools()
      // }
    })
  })
}
