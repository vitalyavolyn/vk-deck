type UpdateAvailableHandler = (info: import('electron-updater').UpdateInfo) => void

interface ElectronApi {
  readonly versions: Readonly<NodeJS.ProcessVersions>
  getTokenFromBrowserView(): Promise<string>
  openViewer(data: ViewerData): void
  closeViewer(): void
  setUpdateAvailableHandler(func: UpdateAvailableHandler): void

  getViewerParams(): Promise<ViewerData>
}

declare interface Window {
  electron: Readonly<ElectronApi>
}
