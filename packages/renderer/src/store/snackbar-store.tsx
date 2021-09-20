import { Snackbar, SnackbarProps } from '@vkontakte/vkui'
import { makeAutoObservable } from 'mobx'
import { RootStore } from './root-store'

const defaultProps = {
  onClose () {
    console.log('Snackbar closed (default onClose)')
  },
}

export class SnackbarStore {
  // eslint-disable-next-line unicorn/no-null
  public element: JSX.Element | null = null

  show (content: string | JSX.Element, snackbarProps: SnackbarProps = defaultProps): void {
    this.element = typeof content === 'string'
      ? <Snackbar {...snackbarProps}>{content}</Snackbar>
      : content
  }

  constructor (public root: RootStore) {
    makeAutoObservable(this)
  }
}
