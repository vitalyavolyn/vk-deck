import { SettingsStore } from './settings-store'
import { SnackbarStore } from './snackbar-store'
import { UserStore } from './user-store'

export class RootStore {
  public userStore: UserStore = new UserStore(this)
  public snackbarStore: SnackbarStore = new SnackbarStore(this)
  public settingsStore: SettingsStore = new SettingsStore(this)

  constructor() {
    // @ts-ignore: для дебага
    window.rootStore = this
  }
}
