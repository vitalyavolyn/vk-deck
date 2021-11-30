import { FC, MouseEvent } from 'react'
import { Avatar, Cell, classNames, Panel, Tappable } from '@vkontakte/vkui'
import {
  Icon28WriteOutline,
  Icon28CancelOutline,
  Icon28SettingsOutline,
  Icon24Fire,
} from '@vkontakte/icons'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/hooks/use-store'

import './navbar.css'

interface NavbarProps {
  onColumnClick(e: MouseEvent<HTMLElement>): void
  onComposeButtonClick(): void
  isComposerOpened: boolean
  onSettingsClick(): void
}

const columnIcons = {
  test: <Icon24Fire />,
}

export const Navbar: FC<NavbarProps> = observer(
  ({
    onColumnClick,
    onComposeButtonClick,
    isComposerOpened,
    onSettingsClick,
  }) => {
    const { userStore, settingsStore } = useStore()
    const { user } = userStore.data

    return (
      <Panel id="nav">
        <div className="navbar">
          <Tappable
            onClick={onComposeButtonClick}
            activeMode="opacity"
            className={classNames('composer-button', {
              active: isComposerOpened,
            })}
          >
            {isComposerOpened ? (
              <Icon28CancelOutline />
            ) : (
              <Icon28WriteOutline />
            )}
          </Tappable>

          <div className="column-navigator">
            {settingsStore.columns.map((col) => (
              <Cell key={col.id} data-column={col.id} onClick={onColumnClick}>
                {columnIcons[col.type]}
              </Cell>
            ))}
          </div>
          <div className="bottom-links">
            <Cell onClick={onSettingsClick}>
              <Icon28SettingsOutline />
            </Cell>
            <Avatar
              size={40}
              src={user.photo_50}
              title={`${user.first_name} ${user.last_name}`}
              onClick={() => window.open(`https://vk.com/id${user.id}`)}
            />
          </div>
        </div>
      </Panel>
    )
  },
)
