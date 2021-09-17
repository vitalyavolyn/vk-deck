interface AuthResponse {
  token: string
  userId: number
}

interface ElectronApi {
  readonly versions: Readonly<NodeJS.ProcessVersions>
  getTokenFromBrowserView(): Promise<AuthResponse>
}

declare interface Window {
  electron: Readonly<ElectronApi>
}
