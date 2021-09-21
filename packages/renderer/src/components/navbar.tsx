import { FC, MouseEvent } from 'react'
import { Avatar, Cell, classNames, Panel, Tappable } from '@vkontakte/vkui'
import {
  Icon28ClipOutline,
  Icon28MessageOutline,
  Icon28NewsfeedOutline,
  Icon28ServicesOutline,
  Icon28UserCircleOutline,
  Icon28WriteOutline,
  Icon28CancelOutline,
} from '@vkontakte/icons'
import { observer } from 'mobx-react-lite'
import { useStore } from '../hooks/use-store'

import './navbar.css'

interface NavbarProps {
  onColumnClick(e: MouseEvent<HTMLElement>): void
  onComposeButtonClick(): void
  isComposerOpened: boolean
}

export const Navbar: FC<NavbarProps> = observer(({ onColumnClick, onComposeButtonClick, isComposerOpened }) => {
  const { api } = useStore()
  const { user } = api

  return (
    <Panel id="nav">
      <div className="navbar">
        <Tappable
          onClick={onComposeButtonClick}
          activeMode="opacity"
          className={classNames('composer-button', { active: isComposerOpened })}
        >
          {isComposerOpened ? <Icon28CancelOutline /> : <Icon28WriteOutline />}
        </Tappable>

        <div className="column-navigator">
          <Cell
            data-story="feed"
            onClick={onColumnClick}
          >
            <Icon28NewsfeedOutline />
          </Cell>
          <Cell
            data-story="services"
            onClick={onColumnClick}
          >
            <Icon28ServicesOutline />
          </Cell>
          <Cell
            data-story="messages"
            onClick={onColumnClick}
          >
            <Icon28MessageOutline />
          </Cell>
          <Cell
            data-story="clips"
            onClick={onColumnClick}
          >
            <Icon28ClipOutline />
          </Cell>
          <Cell
            data-story="profile"
            onClick={onColumnClick}
          >
            <Icon28UserCircleOutline />
          </Cell>
          <Cell
            data-story="profile"
            onClick={onColumnClick}
          >
            <Icon28UserCircleOutline />
          </Cell>
        </div>
        <div className="links">
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
})
