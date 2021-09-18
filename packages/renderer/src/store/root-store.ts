import { ApiStore } from '.'

export class RootStore {
  public api: ApiStore

  constructor () {
    // TODO: api vs apiStore
    this.api = new ApiStore(this)
  }
}
