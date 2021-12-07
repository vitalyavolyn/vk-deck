import { BrowserWindow } from 'electron'
import { autoUpdater, UpdateInfo } from 'electron-updater'

export async function checkForUpdatesAndNotify(
  win: BrowserWindow,
): Promise<void> {
  try {
    autoUpdater.autoDownload = false
    autoUpdater.on('update-available', (info: UpdateInfo) => {
      win.webContents.send('update-available', info)
    })

    await autoUpdater.checkForUpdates()
  } catch (error) {
    console.error('Failed to check for updates:', error)
  }
}
