import { UserStore } from './user-store'
import { SnackbarStore } from './snackbar-store'
import { SettingsStore } from './settings-store'

export class RootStore {
  public userStore: UserStore = new UserStore(this)
  public snackbarStore: SnackbarStore = new SnackbarStore(this)
  public settingsStore: SettingsStore = new SettingsStore(this)
}
