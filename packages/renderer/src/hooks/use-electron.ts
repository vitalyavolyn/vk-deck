export const useElectron = (): Readonly<ElectronApi> => {
  return window.electron
}
