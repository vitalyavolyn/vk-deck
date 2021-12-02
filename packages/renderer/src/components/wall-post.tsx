import { FC, HTMLAttributes, useEffect, useRef } from 'react'
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
  Icon16RepostOutline,
  Icon16LinkOutline,
  Icon16Poll,
  Icon20PictureOutline,
  Icon20VideoOutline,
  Icon20MusicOutline,
} from '@vkontakte/icons'
import { classNames } from '@vkontakte/vkjs'
import { useTranslation } from 'react-i18next'
import { AsyncAvatar } from './async-avatar'
import { shortRelativeTime } from '@/utils/short-relative-time'
import { getInitials } from '@/utils/get-initials'
import { numberFormatter } from '@/utils/number-formatter'
import './wall-post.css'
import { MediaBadge } from '@/components/media-badge'

interface WallPostProps extends HTMLAttributes<HTMLDivElement> {
  data: NewsfeedItemWallpost
  groups: GroupsGroupFull[]
  profiles: UsersUserFull[]
}

/**
 * Показывает запись из ленты, принимает информацию из newsfeed.get
 */
export const WallPost: FC<WallPostProps> = ({
  data,
  groups,
  profiles,
  ...rest
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

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

  const hasRepost = data.copy_history?.length
  const hasLink = data.attachments?.find((e) => e.type === 'link')
  const hasPoll = data.attachments?.find((e) => e.type === 'poll')
  // TODO: нормально отбражать картинки (и видео...)
  const photosCount = data.attachments?.filter((e) => e.type === 'photo').length
  const videos = data.attachments?.filter((e) => e.type === 'video')
  const audiosCount = data.attachments?.filter((e) => e.type === 'audio').length

  const date = new Date(data.date * 1000)

  return (
    <div
      className="wall-post-wrap"
      data-id={`${data.source_id}_${data.post_id}`}
      {...rest}
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
            {/* TODO: попробовать новый `badge` в Avatar */}
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
              title={
                date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
              }
            >
              {shortRelativeTime(date)}
            </a>
          </header>
          <div className="wall-post-content" ref={contentRef}>
            {data.text}
            {/* Убираем "поддерживаемые" аттачи для дебага */}
            {/* TODO: убрать это */}
            {data.attachments
              ?.filter(
                (e) =>
                  !['link', 'poll', 'photo', 'video', 'audio'].includes(e.type),
              )
              .map((e) => e.type)
              .join(',')}
          </div>
          <div className="wall-post-badges">
            {hasRepost && (
              <MediaBadge>
                <Icon16RepostOutline />
                Репост {/* TODO: кого? */}
              </MediaBadge>
            )}
            {!!photosCount && (
              <MediaBadge>
                <Icon20PictureOutline width={16} height={16} />
                {t('wallPost.mediaBadge.photo', { count: photosCount })}
              </MediaBadge>
            )}
            {!!videos?.length && (
              <MediaBadge>
                <Icon20VideoOutline width={16} height={16} />
                {/* TODO: может, это все же можно решить через i18n?  */}
                {videos.length > 1 ? (
                  t('wallPost.mediaBadge.video', {
                    count: videos.length,
                  })
                ) : (
                  <>
                    {t('wallPost.mediaBadge.video', { count: 1 })}
                    <b>{videos[0].video!.title}</b>
                  </>
                )}
              </MediaBadge>
            )}
            {!!audiosCount && (
              <MediaBadge>
                <Icon20MusicOutline width={16} height={16} />
                {t('wallPost.mediaBadge.audio', { count: audiosCount })}
              </MediaBadge>
            )}
            {hasLink && (
              <MediaBadge>
                {/* TODO: открывать сразу ссылку? */}
                <Icon16LinkOutline />
                Ссылка
              </MediaBadge>
            )}
            {hasPoll && (
              <MediaBadge>
                {/* TODO: проверить клики, когда посты можно будет открывать */}
                <Icon16Poll />
                Опрос
              </MediaBadge>
            )}
          </div>
          <div className="wall-post-footer">
            <div className="wall-post-actions">
              <div
                title={t('wallPost.actions.like')}
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
                title={t('wallPost.actions.comment')}
              >
                <Icon20CommentOutline width={18} height={18} />
                {numberFormatter(data.comments?.count)}
              </div>
              <div
                className="wall-post-action-item action-share"
                title={t('wallPost.actions.share')}
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
