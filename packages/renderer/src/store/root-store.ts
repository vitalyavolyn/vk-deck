import { ApiStore } from '.'

export class RootStore {
  public api: ApiStore = new ApiStore(this)
}
