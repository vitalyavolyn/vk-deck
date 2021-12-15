import path from 'path'
import { fileURLToPath, URL, URLSearchParams } from 'url'
import { BrowserView, BrowserWindow, ipcMain, screen } from 'electron'
import { preloadPath } from '@/index'

let viewerWindow: BrowserWindow | undefined
let viewerParams: ViewerData | undefined

const closeViewer = () => {
  viewerWindow?.close()
  viewerWindow = undefined
}

export const initIpc = (win: BrowserWindow): void => {
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

  ipcMain.on('open-viewer', (e, data: ViewerData) => {
    closeViewer()
    viewerParams = data

    const pageName = 'viewer.html'
    // TODO: как-то объединить с кодом в index.ts
    const url =
      import.meta.env.MODE === 'development' && import.meta.env.VITE_DEV_SERVER_URL !== undefined
        ? new URL(pageName, import.meta.env.VITE_DEV_SERVER_URL)
        : new URL(
            `../renderer/dist/${pageName}`,
            'file://' + path.dirname(fileURLToPath(import.meta.url)),
          )

    // странно, что нет способа проще открыть окно на том же мониторе
    const mainWindow = BrowserWindow.getFocusedWindow()!
    const { x, y } = mainWindow.getBounds()
    const { bounds } = screen.getDisplayNearestPoint({ x, y })

    viewerWindow = new BrowserWindow({
      // TODO: убрать лишнее
      //  все это выдрано из vk messenger,
      //  причем, там их еще больше
      x: bounds.x,
      y: bounds.y,
      frame: false,
      // show: false,
      parent: BrowserWindow.getFocusedWindow() || undefined,
      maximizable: false,
      minimizable: false,
      resizable: false,
      movable: false,
      hasShadow: false,
      transparent: true,
      alwaysOnTop: true,
      type: 'toolbar',
      skipTaskbar: true,
      fullscreen: true,
      webPreferences: {
        preload: preloadPath,
      },
    })

    viewerWindow.webContents.loadURL(url.toString())

    // viewerWindow.on('ready-to-show', () => {
    //   if (import.meta.env.MODE === 'development') {
    //     viewerWindow?.webContents.openDevTools()
    //   }
    // })
  })

  ipcMain.handle('get-viewer-params', () => viewerParams)

  // закрывает окно просмотра картинок при клике на основное окно
  win.on('focus', () => {
    closeViewer()
  })
}
