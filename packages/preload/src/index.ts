import { contextBridge, ipcRenderer } from 'electron'

const apiKey = 'electron'

const api: ElectronApi = {
  versions: process.versions,
  getTokenFromBrowserView () {
    return new Promise((resolve) => {
      ipcRenderer.send('create-browser-view')

      ipcRenderer.on('auth-info', (event, data) => {
        resolve(data)
      })
    })
  },
}

contextBridge.exposeInMainWorld(apiKey, api)
