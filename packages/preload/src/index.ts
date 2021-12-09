import { contextBridge, ipcRenderer } from 'electron'

const apiKey = 'electron'

const api: ElectronApi = {
  versions: process.versions,
  getTokenFromBrowserView() {
    return new Promise((resolve) => {
      ipcRenderer.send('create-browser-view')

      ipcRenderer.on('auth-info', (event, data) => {
        resolve(data)
      })
    })
  },
  openViewer() {
    ipcRenderer.send('open-viewer')
  },
  closeViewer() {
    ipcRenderer.send('close-viewer')
  },
  setUpdateAvailableHandler(func: UpdateAvailableHandler) {
    ipcRenderer.on('update-available', (event, arg) => func(arg))
  },
}

contextBridge.exposeInMainWorld(apiKey, api)
