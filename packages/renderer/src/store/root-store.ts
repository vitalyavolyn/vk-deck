import { UserStore } from './user-store'
import { SnackbarStore } from './snackbar-store'

export class RootStore {
  public userStore: UserStore = new UserStore(this)
  public snackbarStore: SnackbarStore = new SnackbarStore(this)
}
