import { ApiStore } from './api-store'
import { SettingsStore } from './settings-store'
import { SnackbarStore } from './snackbar-store'
import { UIStore } from './ui-store'

export class RootStore {
  public apiStore: ApiStore = new ApiStore(this)
  public snackbarStore: SnackbarStore = new SnackbarStore(this)
  public settingsStore: SettingsStore = new SettingsStore(this)
  public uiStore: UIStore = new UIStore(this)

  constructor() {
    // @ts-ignore: для дебага
    window.rootStore = this
  }
}
