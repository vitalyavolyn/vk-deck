import { Avatar, Snackbar, SnackbarProps } from '@vkontakte/vkui'
import { makeAutoObservable } from 'mobx'
import { Icon16ErrorCircleFill } from '@vkontakte/icons'
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

  showError(content: string) {
    this.show(
      <Snackbar
        {...this.defaultProps}
        before={
          <Avatar size={24}>
            <Icon16ErrorCircleFill width={24} height={24} />
          </Avatar>
        }
      >
        {content}
      </Snackbar>,
    )
  }

  constructor(public root: RootStore) {
    makeAutoObservable(this)
  }
}
