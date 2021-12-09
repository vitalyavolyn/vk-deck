type UpdateAvailableHandler = (
  info: import('electron-updater').UpdateInfo,
) => void

interface ElectronApi {
  readonly versions: Readonly<NodeJS.ProcessVersions>
  getTokenFromBrowserView(): Promise<string>
  openViewer(): void
  closeViewer(): void
  setUpdateAvailableHandler(func: UpdateAvailableHandler): void
}

declare interface Window {
  electron: Readonly<ElectronApi>
}
