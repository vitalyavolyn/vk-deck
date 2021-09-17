import qs from 'querystring'
import { URL } from 'url'
import { BrowserView, BrowserWindow, ipcMain } from 'electron'

/* eslint-disable camelcase */
interface AuthResponseRaw {
  access_token: string
  user_id: string
  expires_in: string
}
/* eslint-enable camelcase */

export function initIpc (win: BrowserWindow): void {
  ipcMain.on('create-browser-view', (e) => {
    const view = new BrowserView({
      webPreferences: {
        nativeWindowOpen: true,
        nodeIntegration: false
      }
    })

    win.addBrowserView(view)
    view.setBounds({
      x: 100,
      y: 100,
      height: 500,
      width: 500
    })
    view.setAutoResize({
      horizontal: true,
      vertical: true
    })

    const authURL = 'https://oauth.vk.com/authorize'
    const redirectURL = 'https://oauth.vk.com/blank.html'
    const params = {
      client_id: 7446716,
      redirect_uri: redirectURL,
      response_type: 'token',
      scope: 'offline,wall,friends',
      revoke: '1',
      display: 'mobile'
    }

    view.webContents.loadURL(`${authURL}?${qs.stringify(params)}`)
    view.webContents.on('will-navigate', (_, url) => {
      if (url.startsWith(redirectURL)) {
        win.removeBrowserView(view)

        // TODO: kill me
        const result = qs.parse(new URL(url).hash.slice(1)) as unknown as AuthResponseRaw

        e.reply('auth-info', {
          userId: Number(result.user_id),
          token: result.access_token
        })
      }
    })
  })
}
