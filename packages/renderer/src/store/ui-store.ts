import { makeAutoObservable, observable } from 'mobx'
import { RootStore } from './root-store'

// TODO: сунуть сюда SnackbarStore
export class UIStore {
  public modal?: JSX.Element
  public photoPopup?: JSX.Element

  public modalProps = {
    onClose: () => {
      this.closeModal()
    },
  }

  constructor(public root: RootStore) {
    makeAutoObservable(this, {
      photoPopup: observable.shallow,
      modal: observable.shallow,
    })
  }

  public showModal(modal: JSX.Element): void {
    this.modal = modal
  }

  public closeModal(): void {
    this.modal = undefined
  }
}
