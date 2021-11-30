import { FC } from 'react'
import {
  GroupsGroupFull,
  NewsfeedItemWallpost,
} from '@vkontakte/api-schema-typescript'
import './wall-post.css'
import { Avatar } from '@vkontakte/vkui'

interface WallPostProps {
  data: NewsfeedItemWallpost
  groups: GroupsGroupFull[]
}

/**
 * Показывает запись из ленты, принимает информацию из newsfeed.get
 */
export const WallPost: FC<WallPostProps> = ({ data, groups }) => {
  const owner = groups.find((value) => -value.id === data.source_id)!

  return (
    <div className="wall-post-wrap">
      {/* {data.post_id} */}
      <div className="wall-post">
        <div className="wall-post-avatar">
          {/* TODO: прогрессивная загрузка с буквами до загрузки? */}
          <Avatar size={36} src={owner.photo_50} />
        </div>
        <div className="wall-post-content">
          <header className="wall-post-header">
            <a className="wall-post-author">
              <span className="full-name">{owner.name}</span>
              <span className="screen-name">@{owner.screen_name}</span>
            </a>
            <time>16m</time>
          </header>
          {data.text}
        </div>
      </div>
    </div>
  )
}
