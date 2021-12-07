import { FC } from 'react'
import {
  Icon28WriteOutline,
  Icon28CancelOutline,
  Icon28SettingsOutline,
  Icon28NewsfeedOutline,
  Icon28SparkleOutline,
  Icon28AddOutline,
  Icon28GridLayoutOutline,
} from '@vkontakte/icons'
import { Icon28NewsfeedOutlineProps } from '@vkontakte/icons/dist/28/newsfeed_outline'
import { Cell, classNames, Panel, Tappable } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/hooks/use-store'
import { ColumnType } from '@/store/settings-store'
import { getInitials } from '@/utils/get-initials'
import { AsyncAvatar } from './async-avatar'

import './navbar.css'

interface NavbarProps {
  onColumnClick(colId: string): void
  onComposeButtonClick(): void
  isComposerOpened: boolean
  onSettingsClick(): void
  onAddColumnClick(): void
}

// bruh
// TODO: убрать в другое место
export type IconProps = Icon28NewsfeedOutlineProps

export const columnIcons: Record<ColumnType, FC<IconProps>> = {
  [ColumnType.test]: Icon28SparkleOutline,
  [ColumnType.newsfeed]: Icon28NewsfeedOutline,
  // TODO: неоч
  [ColumnType.wall]: Icon28GridLayoutOutline,
}

export const Navbar: FC<NavbarProps> = observer(
  ({
    onColumnClick,
    onComposeButtonClick,
    isComposerOpened,
    onSettingsClick,
    onAddColumnClick,
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
            {settingsStore.columns.map((col) => {
              const Icon = columnIcons[col.type]

              return (
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
                  <Icon width={30} height={30} />
                </Cell>
              )
            })}
          </div>
          <div className="bottom-links">
            <Cell onClick={onAddColumnClick}>
              <Icon28AddOutline width={24} height={24} />
            </Cell>
            <Cell onClick={onSettingsClick}>
              <Icon28SettingsOutline width={24} height={24} />
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
