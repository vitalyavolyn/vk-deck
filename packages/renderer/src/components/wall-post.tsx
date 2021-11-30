import { FC } from 'react'
import {
  GroupsGroupFull,
  NewsfeedItemWallpost,
  UsersUserFull,
} from '@vkontakte/api-schema-typescript'
import './wall-post.css'
import { shortRelativeTime } from '@/utils/short-relative-time'
import { AsyncAvatar } from '@/components/async-avatar'
import { getInitials } from '@/utils/get-initials'

interface WallPostProps {
  data: NewsfeedItemWallpost
  groups: GroupsGroupFull[]
  profiles: UsersUserFull[]
}

/**
 * Показывает запись из ленты, принимает информацию из newsfeed.get
 */
export const WallPost: FC<WallPostProps> = ({ data, groups, profiles }) => {
  const owner =
    data.source_id > 0
      ? profiles.find((e) => e.id === data.source_id)
      : groups.find((value) => -value.id === data.source_id)

  if (!owner) {
    return null
  }

  const getName = () => {
    return 'name' in owner
      ? owner.name
      : `${owner.first_name} ${owner.last_name}`
  }

  return (
    <div
      className="wall-post-wrap"
      data-id={`${data.source_id}_${data.post_id}`}
    >
      <div className="wall-post">
        <div className="wall-post-avatar">
          <AsyncAvatar
            gradientColor={(owner.id % 6) + 1}
            size={36}
            src={'a' + owner.photo_50}
            initials={getInitials(owner)}
          />
        </div>
        <div className="wall-post-content">
          <header className="wall-post-header">
            <a className="wall-post-author">
              <span className="full-name" title={getName()}>
                {getName()}
              </span>
              <span className="screen-name" title={`@${owner.screen_name}`}>
                @{owner.screen_name}
              </span>
            </a>
            <time>{shortRelativeTime(new Date(data.date * 1000))}</time>
          </header>
          {/* wtf */}
          <div className="wall-post-real-content">
            {data.text} {data.attachments?.map((e) => e.type).join(',')}
          </div>
        </div>
      </div>
    </div>
  )
}
