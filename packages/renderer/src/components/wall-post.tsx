import { FC, HTMLAttributes, Ref, useEffect, useRef, useState } from 'react'
import {
  GroupsGroupFull,
  LikesAddParams,
  LikesAddResponse,
  LikesDeleteParams,
  LikesDeleteResponse,
  UsersUserFull,
  WallWallpostAttachment,
  WallWallpostAttachmentType,
  WallWallpostFull,
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
  Icon28LocationMapOutline,
  Icon12User,
  Icon16MarketOutline,
  Icon24PhotosStackOutline,
  Icon20More,
  Icon16Done,
  Icon16ArticleOutline,
} from '@vkontakte/icons'
import { classNames } from '@vkontakte/vkjs'
import { Avatar } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/hooks/use-store'
import { getInitials } from '@/utils/get-initials'
import { getOwner } from '@/utils/get-owner'
import { numberFormatter } from '@/utils/number-formatter'
import { shortRelativeTime } from '@/utils/short-relative-time'
import { AsyncAvatar } from './async-avatar'
import { DropdownMenu } from './dropdown-menu'
import { DropdownMenuItem } from './dropdown-menu-item'
import { MediaBadge } from './media-badge'

import './wall-post.css'

interface WallPostProps extends HTMLAttributes<HTMLDivElement> {
  data: WallWallpostFull
  groups: GroupsGroupFull[]
  profiles: UsersUserFull[]
}

const isArticleLink = (url?: string) => /\/\/(?:m\.)?vk\.com\/@/.test(url || '')

/**
 * Показывает запись из ленты, принимает информацию из newsfeed.get
 *
 * Возможно, было бы лучшей идеей как-то конвертировать `NewsfeedItemWallpost`
 * в `WallWallpostFull` и принимать его. Все равно они похожи. TODO, в общем
 */
export const WallPost: FC<
  WallPostProps & { measureRef?: Ref<HTMLDivElement> }
> = observer(({ data, groups, profiles, measureRef, ...rest }) => {
  const { userStore, snackbarStore, settingsStore } = useStore()

  const contentRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const [likeState, setLikeState] = useState(!!data.likes?.user_likes)
  const [likeCount, setLikeCount] = useState(data.likes?.count)

  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current
      if (el.scrollHeight > el.clientHeight) {
        el.classList.add('overflow')
      }
    }
  }, [contentRef])

  const owner = getOwner(data.from_id!, profiles, groups)

  if (!owner) {
    console.log('no owner')

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
  const poll = getAttachments('poll')?.[0]?.poll
  // TODO: нормально отбражать картинки (и видео...)
  const photosCount = getAttachments('photo')?.length
  const albumsCount = getAttachments('album')?.length
  const videos = getAttachments('video')
  const audiosCount = getAttachments('audio')?.length
  const docsCount = getAttachments('doc')?.length
  const productsCount = getAttachments('market')?.length

  const hasMap = !!data?.geo
  const hasArticle = isArticleLink(link?.url)

  const unsupportedAttachments = data.attachments
    ?.filter(
      (e) =>
        ![
          'link',
          'poll',
          'photo',
          'video',
          'audio',
          'doc',
          'market',
          'album',
        ].includes(e.type),
    )
    .map((e) => e.type)

  if (unsupportedAttachments?.length) {
    console.warn('Unsupported attachments', unsupportedAttachments)
  }

  const date = new Date(data.date! * 1000)

  const onLikeClick = async () => {
    const { api } = userStore

    const params = {
      type: 'post',
      owner_id: data.owner_id,
      item_id: data.id!,
    }

    // следующие две ветки почти одинаковые, как-то тупо
    if (!likeState) {
      setLikeState(true)
      try {
        const { likes } = await api.call<LikesAddResponse, LikesAddParams>(
          'likes.add',
          params,
        )
        setLikeCount(likes)
      } catch (error) {
        console.error(error)
        if (error instanceof Error) snackbarStore.showError(error.toString())
        setLikeState(false)
      }
    } else {
      setLikeState(false)
      try {
        const { likes } = await api.call<
          LikesDeleteResponse,
          LikesDeleteParams
        >('likes.delete', params)
        setLikeCount(likes)
      } catch (error) {
        console.error(error)
        if (error instanceof Error) snackbarStore.showError(error.toString())
        setLikeState(true)
      }
    }
  }

  const postUrl = `https://vk.com/wall${data.owner_id}_${data.id}`

  const isAd = !!data.marked_as_ads

  return (
    <div
      className="wall-post-wrap"
      data-id={`${data.owner_id}_${data.id}`}
      ref={measureRef}
      {...rest}
    >
      <div
        className={classNames('wall-post', {
          'blurred-ad': isAd && settingsStore.blurAds,
        })}
      >
        <div className="left">
          <div className="wall-post-avatar">
            <AsyncAvatar
              gradientColor={(owner.id % 6) + 1}
              size={36}
              src={owner.photo_50}
              initials={getInitials(owner)}
            />
            {/* TODO: попробовать новый `badge` в Avatar */}
            {isAd && (
              <Icon20RoubleCircleFillBlue
                width={16}
                height={16}
                className="ad-icon badge"
                title={t`wallPost.ad`}
              />
            )}
            {!!owner.verified && (
              <Avatar
                title={t`wallPost.verified`}
                size={16}
                className="badge verified-badge"
              >
                <Icon16Done width={12} height={12} className="verified-icon" />
              </Avatar>
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
              href={postUrl}
              target="_blank"
              title={
                date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
              }
            >
              {shortRelativeTime(date)}
            </a>
          </header>
          {data.post_source?.data === 'profile_photo' && (
            <div className="wall-post-source">{t`wallPost.photoUpdated`}</div>
          )}
          <div className="wall-post-content" ref={contentRef}>
            {data.text}
          </div>
          <div className="wall-post-badges">
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
                subject={
                  videos.length === 1 ? videos[0].video!.title : undefined
                }
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
            {!!albumsCount && (
              <MediaBadge
                icon={<Icon24PhotosStackOutline width={16} height={16} />}
                type={t('wallPost.mediaBadge.album', { count: albumsCount })}
              />
            )}
            {!!productsCount && (
              <MediaBadge
                icon={<Icon16MarketOutline />}
                type={t('wallPost.mediaBadge.product', {
                  count: productsCount,
                })}
              />
            )}
            {link && (
              <MediaBadge
                icon={
                  hasArticle ? <Icon16ArticleOutline /> : <Icon16LinkOutline />
                }
                type={
                  hasArticle
                    ? t`wallPost.mediaBadge.article`
                    : t`wallPost.mediaBadge.link`
                }
                subject={hasArticle ? link.title : new URL(link.url).hostname}
                title={hasArticle ? link.title : link.url}
                href={link.url}
              />
            )}
            {poll && (
              <MediaBadge
                icon={<Icon16Poll />}
                type={t`wallPost.mediaBadge.poll`}
                subject={poll.question}
              />
            )}
            {hasMap && (
              <MediaBadge
                icon={<Icon28LocationMapOutline width={16} height={16} />}
                type={t`wallPost.mediaBadge.map`}
              />
            )}
            {hasRepost && (
              <MediaBadge
                icon={<Icon16RepostOutline />}
                type={t`wallPost.mediaBadge.repost`}
                subject={getName(
                  getOwner(data.copy_history![0]!.owner_id!, profiles, groups)!,
                )}
              />
            )}
          </div>
          {data.signer_id && (
            // TODO: ссылка?
            <div className="wall-post-signer">
              <Icon12User />
              {getName(getOwner(data.signer_id, profiles, groups))}
            </div>
          )}
          <div className="wall-post-footer">
            <div className="wall-post-actions">
              <div
                title={t('wallPost.actions.like')}
                className={classNames('wall-post-action-item', 'action-like', {
                  'user-likes': likeState,
                })}
                onClick={onLikeClick}
              >
                {likeState ? (
                  <Icon20Like width={18} height={18} />
                ) : (
                  <Icon20LikeOutline width={18} height={18} />
                )}
                {numberFormatter(likeCount)}
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
              <DropdownMenu
                items={[
                  <DropdownMenuItem
                    key="copy"
                    onClick={() => {
                      navigator.clipboard.writeText(postUrl)
                    }}
                  >
                    Копировать ссылку
                  </DropdownMenuItem>,
                  !!data.can_delete && (
                    <DropdownMenuItem
                      key="delete"
                      onClick={() => {
                        // TODO
                        navigator.clipboard.writeText(postUrl)
                      }}
                      style={{ color: 'var(--destructive)' }}
                    >
                      Удалить
                    </DropdownMenuItem>
                  ),
                ]}
              >
                <div
                  className="wall-post-action-item action-menu"
                  title={t('wallPost.actions.menu')}
                >
                  <Icon20More width={18} height={18} />
                </div>
              </DropdownMenu>
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
