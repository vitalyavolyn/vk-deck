interface ElectronApi {
  readonly versions: Readonly<NodeJS.ProcessVersions>
  getTokenFromBrowserView(): Promise<string>
}

declare interface Window {
  electron: Readonly<ElectronApi>
}
