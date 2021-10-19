import { Snackbar, SnackbarProps } from '@vkontakte/vkui'
import { makeAutoObservable } from 'mobx'
import { RootStore } from './root-store'

export class SnackbarStore {
  public element?: JSX.Element
  public defaultProps = { onClose: this.defaultOnClose }

  defaultOnClose(): void {
    console.log('Snackbar closed (default onClose)')
  }

  show(
    content: string | JSX.Element,
    snackbarProps: SnackbarProps = this.defaultProps,
  ): void {
    this.element =
      typeof content === 'string' ? (
        <Snackbar {...snackbarProps}>{content}</Snackbar>
      ) : (
        content
      )
  }

  constructor(public root: RootStore) {
    makeAutoObservable(this)
  }
}
