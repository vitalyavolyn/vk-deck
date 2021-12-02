import { FC } from 'react'
import { Cell, classNames, Panel, Tappable } from '@vkontakte/vkui'
import {
  Icon28WriteOutline,
  Icon28CancelOutline,
  Icon28SettingsOutline,
  Icon24Fire,
  Icon24NewsfeedOutline,
} from '@vkontakte/icons'
import { observer } from 'mobx-react-lite'
import { AsyncAvatar } from './async-avatar'
import { useStore } from '@/hooks/use-store'
import { getInitials } from '@/utils/get-initials'

import './navbar.css'

interface NavbarProps {
  onColumnClick(colId: string): void
  onComposeButtonClick(): void
  isComposerOpened: boolean
  onSettingsClick(): void
}

const columnIcons = {
  test: <Icon24Fire />,
  newsfeed: <Icon24NewsfeedOutline />,
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
              <Cell
                key={col.id}
                data-column={col.id}
                onClick={() => onColumnClick(col.id)}
              >
                {/*
                 * TODO:
                 * Аватарки кроме иконок?
                 * К примеру, на колонке со стеной человека - его аватарку
                 * или микс между иконкой и его аватаркой
                 */}
                {columnIcons[col.type]}
              </Cell>
            ))}
          </div>
          <div className="bottom-links">
            <Cell onClick={onSettingsClick}>
              <Icon28SettingsOutline />
            </Cell>
            <AsyncAvatar
              initials={getInitials(user)}
              gradientColor={(user.id % 6) + 1}
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
