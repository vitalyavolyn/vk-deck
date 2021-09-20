import { FC, MouseEvent } from 'react'
import { Avatar, Cell, Panel } from '@vkontakte/vkui'
import {
  Icon28ClipOutline,
  Icon28MessageOutline,
  Icon28NewsfeedOutline,
  Icon28ServicesOutline,
  Icon28UserCircleOutline,
} from '@vkontakte/icons'
import { observer } from 'mobx-react-lite'
import { useStore } from '../hooks/use-store'

import './navbar.css'

interface NavbarProps {
  onColumnClick(e: MouseEvent<HTMLElement>): void
}

export const Navbar: FC<NavbarProps> = observer(({ onColumnClick }) => {
  const { api } = useStore()
  const { user } = api

  return (
    <Panel id="nav">
      <div className="navBar">
        <Avatar size={40} src={user.photo_50} title={`${user.first_name} ${user.last_name}`} />
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
      </div>
    </Panel>
  )
})