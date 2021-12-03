import { FC, HTMLAttributes, Ref, useEffect, useRef, memo } from 'react'
import {
  GroupsGroupFull,
  NewsfeedItemWallpost,
  UsersUserFull,
  WallWallpostAttachment,
  WallWallpostAttachmentType,
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
  Icon20DocumentOutline,
} from '@vkontakte/icons'
import { classNames } from '@vkontakte/vkjs'
import { useTranslation } from 'react-i18next'
import { AsyncAvatar } from './async-avatar'
import { MediaBadge } from './media-badge'
import { shortRelativeTime } from '@/utils/short-relative-time'
import { getInitials } from '@/utils/get-initials'
import { numberFormatter } from '@/utils/number-formatter'

import './wall-post.css'

interface WallPostProps extends HTMLAttributes<HTMLDivElement> {
  data: NewsfeedItemWallpost
  groups: GroupsGroupFull[]
  profiles: UsersUserFull[]
}

/**
 * Показывает запись из ленты, принимает информацию из newsfeed.get
 */
export const WallPost: FC<
  WallPostProps & { measureRef?: Ref<HTMLDivElement> }
> = memo(({ data, groups, profiles, measureRef, ...rest }) => {
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

  const getOwner = (id: number) =>
    id > 0
      ? profiles.find((e) => e.id === id)
      : groups.find((value) => -value.id === id)

  const owner = getOwner(data.source_id)

  if (!owner) {
    return null
  }

  const getName = (subject = owner) => {
    return 'name' in subject
      ? subject.name
      : `${subject.first_name} ${subject.last_name}`
  }

  const hasRepost = data.copy_history?.length

  const getAttachments = (
    type: WallWallpostAttachmentType,
  ): WallWallpostAttachment[] | undefined =>
    data.attachments?.filter((e) => e.type === type)

  const link = getAttachments('link')?.[0]?.link
  const hasPoll = Boolean(getAttachments('poll')?.length)
  // TODO: нормально отбражать картинки (и видео...)
  const photosCount = getAttachments('photo')?.length
  const videos = getAttachments('video')
  const audiosCount = getAttachments('audio')?.length
  const docsCount = getAttachments('doc')?.length

  const unsupportedAttachments = data.attachments
    ?.filter(
      (e) =>
        !['link', 'poll', 'photo', 'video', 'audio', 'doc'].includes(e.type),
    )
    .map((e) => e.type)

  if (unsupportedAttachments?.length) {
    console.warn('Unsupported attachments', unsupportedAttachments)
  }

  const date = new Date(data.date * 1000)

  return (
    <div
      className="wall-post-wrap"
      data-id={`${data.source_id}_${data.post_id}`}
      ref={measureRef}
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
                title={t`wallPost.ad`}
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
          </div>
          <div className="wall-post-badges">
            {hasRepost && (
              <MediaBadge
                icon={<Icon16RepostOutline />}
                type={t`wallPost.mediaBadge.repost`}
                subject={getName(getOwner(data.copy_history![0]!.owner_id!)!)}
              />
            )}
            {!!photosCount && (
              <MediaBadge
                icon={<Icon20PictureOutline width={16} height={16} />}
                type={t('wallPost.mediaBadge.photo', { count: photosCount })}
              />
            )}
            {!!videos?.length && (
              <MediaBadge
                icon={<Icon20VideoOutline width={16} height={16} />}
                type={t('wallPost.mediaBadge.video', {
                  count: videos.length,
                })}
                subject={videos[0].video!.title}
              />
            )}
            {!!audiosCount && (
              <MediaBadge
                icon={<Icon20MusicOutline width={16} height={16} />}
                type={t('wallPost.mediaBadge.audio', { count: audiosCount })}
              />
            )}
            {!!docsCount && (
              <MediaBadge
                icon={<Icon20DocumentOutline width={16} height={16} />}
                type={t('wallPost.mediaBadge.doc', { count: docsCount })}
              />
            )}
            {link && (
              <a href={link.url} target="_blank">
                <MediaBadge
                  icon={<Icon16LinkOutline />}
                  type={t`wallPost.mediaBadge.link`}
                  subject={new URL(link.url).hostname}
                />
              </a>
            )}
            {hasPoll && (
              <MediaBadge
                icon={<Icon16Poll />}
                type={t`wallPost.mediaBadge.poll`}
              />
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
            {data.views && (
              <div className="wall-post-action-item views">
                <Icon20View width={18} height={18} />
                {numberFormatter(data.views?.count)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
