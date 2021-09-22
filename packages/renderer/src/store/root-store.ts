import { ApiStore } from './api-store'
import { SnackbarStore } from './snackbar-store'

export class RootStore {
  // TODO: rename `api` or `ApiStore`
  public api: ApiStore = new ApiStore(this)
  public snackbar: SnackbarStore = new SnackbarStore(this)
}
