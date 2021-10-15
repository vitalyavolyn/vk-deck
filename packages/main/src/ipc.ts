import { URL, URLSearchParams } from 'url'
import { BrowserView, BrowserWindow, ipcMain } from 'electron'

export function initIpc (win: BrowserWindow): void {
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
      scope: 'offline,wall,friends',
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
}
