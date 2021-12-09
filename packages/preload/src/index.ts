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
  openViewer(data) {
    ipcRenderer.send('open-viewer', data)
  },
  closeViewer() {
    ipcRenderer.send('close-viewer')
  },
  setUpdateAvailableHandler(func: UpdateAvailableHandler) {
    ipcRenderer.on('update-available', (event, arg) => func(arg))
  },

  // эти специфичны для просмотрщика
  getViewerParams() {
    return ipcRenderer.invoke('get-viewer-params')
  },
}

contextBridge.exposeInMainWorld(apiKey, api)
