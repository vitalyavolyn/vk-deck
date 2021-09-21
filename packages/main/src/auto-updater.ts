import { autoUpdater, UpdateInfo } from 'electron-updater'
import { BrowserWindow } from 'electron'

export async function checkForUpdatesAndNotify (win: BrowserWindow): Promise<void> {
  try {
    autoUpdater.on('update-available', (info: UpdateInfo) => {
      win.webContents.send('update-available', info)
    })

    await autoUpdater.checkForUpdates()
  } catch (error) {
    console.error('Failed to check for updates:', error)
  }
}
