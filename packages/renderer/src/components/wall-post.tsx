import { FC, useEffect, useRef } from 'react'
import {
  GroupsGroupFull,
  NewsfeedItemWallpost,
  UsersUserFull,
} from '@vkontakte/api-schema-typescript'
import {
  Icon20RoubleCircleFillBlue,
  Icon20LikeOutline,
  Icon20CommentOutline,
  Icon20ShareOutline,
  Icon20View,
  Icon20Like,
} from '@vkontakte/icons'
import { classNames } from '@vkontakte/vkjs'
import { AsyncAvatar } from './async-avatar'
import { shortRelativeTime } from '@/utils/short-relative-time'
import { getInitials } from '@/utils/get-initials'
import { numberFormatter } from '@/utils/number-formatter'
import './wall-post.css'

interface WallPostProps {
  data: NewsfeedItemWallpost
  groups: GroupsGroupFull[]
  profiles: UsersUserFull[]
}

/**
 * Показывает запись из ленты, принимает информацию из newsfeed.get
 */
export const WallPost: FC<WallPostProps> = ({ data, groups, profiles }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current
      if (el.scrollHeight > el.clientHeight) {
        el.classList.add('overflow')
      }
    }
  }, [contentRef])

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
        <div className="left">
          <div className="wall-post-avatar">
            <AsyncAvatar
              gradientColor={(owner.id % 6) + 1}
              size={36}
              src={owner.photo_50}
              initials={getInitials(owner)}
            />
            {!!data.marked_as_ads && (
              <Icon20RoubleCircleFillBlue
                width={16}
                height={16}
                className="ad-icon"
                title="Реклама"
              />
            )}
          </div>
        </div>
        <div className="wall-post-main">
          <header className="wall-post-header">
            <a
              className="wall-post-author"
              title={`${getName()} @${owner.screen_name}`}
            >
              <span className="full-name">{getName()}</span>
              <span className="screen-name">@{owner.screen_name}</span>
            </a>
            <a
              className="time"
              href={`https://vk.com/wall${data.source_id}_${data.post_id}`}
              target="_blank"
            >
              {shortRelativeTime(new Date(data.date * 1000))}
            </a>
          </header>
          {/* wtf */}
          <div className="wall-post-content" ref={contentRef}>
            {data.text}
            {data.attachments?.map((e) => e.type).join(',')}
          </div>
          <div className="wall-post-footer">
            <div className="wall-post-actions">
              <div
                title="Нравится"
                className={classNames('wall-post-action-item', 'action-like', {
                  'user-likes': !!data.likes?.user_likes,
                })}
              >
                {data.likes?.user_likes ? (
                  <Icon20Like width={18} height={18} />
                ) : (
                  <Icon20LikeOutline width={18} height={18} />
                )}
                {numberFormatter(data.likes?.count)}
              </div>
              <div
                className="wall-post-action-item action-comment"
                title="Комментарии"
              >
                <Icon20CommentOutline width={18} height={18} />
                {numberFormatter(data.comments?.count)}
              </div>
              <div
                className="wall-post-action-item action-share"
                title="Поделиться"
              >
                <Icon20ShareOutline width={18} height={18} />
                {numberFormatter(data.reposts?.count)}
              </div>
            </div>
            <div className="wall-post-action-item views">
              <Icon20View width={18} height={18} />
              {numberFormatter(data.views?.count)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
