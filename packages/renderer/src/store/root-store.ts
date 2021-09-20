import { ApiStore } from './api-store'
import { SnackbarStore } from './snackbar-store'

export class RootStore {
  public api: ApiStore = new ApiStore(this)
  public snackbar: SnackbarStore = new SnackbarStore(this)
}
