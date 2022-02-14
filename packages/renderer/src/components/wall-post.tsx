import { FC, HTMLAttributes, Ref, MouseEvent, useEffect, useRef } from 'react'
import {
  FaveAddPostParams,
  FaveAddPostResponse,
  FaveRemovePostParams,
  FaveRemovePostResponse,
  GroupsGroupFull,
  LikesAddParams,
  LikesAddResponse,
  LikesDeleteParams,
  LikesDeleteResponse,
  PhotosPhoto,
  PollsPoll,
  WallWallpostAttachment,
  WallWallpostAttachmentType,
  WallWallpostFull,
  WallCommentAttachment,
  WallCommentAttachmentType,
  BaseStickerNew,
} from '@vkontakte/api-schema-typescript'
import {
  Icon12User,
  Icon16ArticleOutline,
  Icon16BookmarkOutline,
  Icon16Done,
  Icon16LinkOutline,
  Icon16MarketOutline,
  Icon16Poll,
  Icon20CalendarOutline,
  Icon20CommentOutline,
  Icon20CopyOutline,
  Icon20DeleteOutline,
  Icon20DocumentOutline,
  Icon20LightbulbStarOutline,
  Icon20Like,
  Icon20LikeOutline,
  Icon20More,
  Icon20MusicOutline,
  Icon20PictureOutline,
  Icon20PinOutline,
  Icon20RoubleCircleFillBlue,
  Icon20ShareOutline,
  Icon20VideoOutline,
  Icon20View,
  Icon24NarrativeOutline,
  Icon24NewsfeedMusicNoteOutline,
  Icon24PhotosStackOutline,
  Icon24Podcast,
  Icon24TextLiveOutline,
  Icon28DonateOutline,
  Icon28LocationMapOutline,
  Icon28LogoVkOutline,
} from '@vkontakte/icons'
import { classNames } from '@vkontakte/vkjs'
import { AppearanceProvider, Avatar, calcInitialsAvatarColor, Div } from '@vkontakte/vkui'
import { RichTooltip } from '@vkontakte/vkui/unstable'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useColumn } from '@/hooks/use-column'
import { useStore } from '@/hooks/use-store'
import { ColumnType, ImageGridSize } from '@/store/settings-store'
import { getInitials } from '@/utils/get-initials'
import { getName } from '@/utils/get-name'
import { numberFormatter } from '@/utils/number-formatter'
import { shortRelativeTime } from '@/utils/short-relative-time'
import { AsyncAvatar } from './async-avatar'
import { HasImageGridSettings } from './columns/common/column-image-grid-settings-form'
import { DropdownMenu } from './dropdown-menu'
import { DropdownMenuItem } from './dropdown-menu-item'
import { LinkCard } from './link-card'
import { MediaBadge } from './media-badge'
import { MediaGrid } from './media-grid'
import { PagePreviewModal } from './modals/page-preview-modal'
import { Poll } from './poll'
import { SmallWallPost } from './small-wall-post'
import { Sticker } from './sticker'
import { TextProcessor } from './text-processor'

import './wall-post.css'

export interface WallPostProps extends HTMLAttributes<HTMLElement> {
  data: WallWallpostFull
  updateData?: (data: WallWallpostFull) => void
  small?: boolean
  fullSize?: boolean
  threadItem?: boolean
  comment?: boolean
}

const isArticleLink = (url?: string) => /\/\/(?:m\.)?vk\.com\/@/.test(url || '')

/**
 * Показывает запись по объекту записи на стене
 */
export const WallPost: FC<WallPostProps & { measureRef?: Ref<HTMLElement> }> = observer(
  ({
    data,
    measureRef,
    updateData,
    small,
    fullSize,
    className,
    threadItem,
    comment,
    ...restProps
  }) => {
    const { settings } = useColumn<Partial<HasImageGridSettings>>()
    const mediaSize = settings?.imageGridSize || ImageGridSize.medium
    const { apiStore, snackbarStore, settingsStore, uiStore } = useStore()
    const { getOwner } = apiStore

    const contentRef = useRef<HTMLDivElement>(null)
    const { t } = useTranslation()

    useEffect(() => {
      if (contentRef.current) {
        const el = contentRef.current
        if (el.scrollHeight > el.clientHeight && !fullSize) {
          el.classList.add('overflow')
        }
      }
    }, [contentRef, data.text])

    const owner = getOwner(data.from_id!)

    if (!owner && comment && data.from_id === 0) {
      return <Div style={{ color: 'var(--text_secondary)' }}>{t`wallPost.deletedComment`}</Div>
    }

    if (!owner) {
      console.log('no owner', data)

      return null
    }

    const hasRepost = data.copy_history?.length

    const getAttachments = (
      type:
        | WallWallpostAttachmentType
        | WallCommentAttachmentType
        | 'podcast'
        | 'textpost_publish'
        | 'narrative'
        | 'curator',
    ) => _.filter(data.attachments, { type }) as (WallWallpostAttachment & WallCommentAttachment)[]

    const link = getAttachments('link')[0]?.link
    const poll = getAttachments('poll')[0]?.poll
    const podcast = getAttachments('podcast')[0]?.podcast
    const event = getAttachments('event')[0]?.event
    const situationalTheme = getAttachments('situational_theme')[0]?.situational_theme
    const donutLink = getAttachments('donut_link')[0]?.donut_link
    // структура у них почти одна
    const textlive =
      getAttachments('textlive')[0]?.textlive ||
      getAttachments('textpost')[0]?.textpost ||
      getAttachments('textpost_publish')[0]?.textpost_publish
    const narrative = getAttachments('narrative')[0]?.narrative
    // их может быть несколько, но кому до этого есть дело?
    const curator = getAttachments('curator')[0]?.curator

    // следующие два для комментариев
    const sticker = getAttachments('sticker')[0]?.sticker as BaseStickerNew
    const graffiti = getAttachments('graffiti')[0]?.graffiti

    const photos = getAttachments('photo')
    const albumsCount = getAttachments('album').length
    const videos = getAttachments('video')
    const audiosCount = getAttachments('audio').length
    const docsCount = getAttachments('doc').length
    const productsCount = getAttachments('market').length

    const hasMap = !!data?.geo
    const hasArticle = isArticleLink(link?.url)
    const hasPhotos = photos.length > 0
    const showMediaGrid = hasPhotos && mediaSize !== ImageGridSize.badges

    const eventGroup = event && (apiStore.getOwner(-event.id) as GroupsGroupFull)

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
            'podcast',
            'event',
            'situational_theme',
            'donut_link',
            'textlive',
            'textpost',
            'textpost_publish',
            'sticker',
            'graffiti',
            'narrative',
            'curator',
          ].includes(e.type),
      )
      .map((e) => e.type)

    if (unsupportedAttachments?.length) {
      console.warn('Unsupported attachments', unsupportedAttachments)
    }

    const date = new Date(data.date! * 1000)

    const onLikeClick = async () => {
      const { api } = apiStore

      const params = {
        type: comment ? 'comment' : 'post',
        owner_id: data.owner_id,
        item_id: data.id!,
      }

      const updateLikeState = (state: boolean) =>
        updateData?.(_.set({ ...data }, 'likes.user_likes', state))
      const updateLikeCount = (count: number) =>
        updateData?.(_.set({ ...data }, 'likes.count', count))

      // следующие две ветки почти одинаковые, как-то тупо
      if (!data.likes?.user_likes) {
        updateLikeState(true)
        try {
          const { likes } = await api.call<LikesAddResponse, LikesAddParams>('likes.add', params)
          updateLikeCount(likes)
        } catch (error) {
          console.error(error)
          if (error instanceof Error) snackbarStore.showError(error.toString())
          updateLikeState(false)
        }
      } else {
        updateLikeState(false)
        try {
          const { likes } = await api.call<LikesDeleteResponse, LikesDeleteParams>(
            'likes.delete',
            params,
          )
          updateLikeCount(likes)
        } catch (error) {
          console.error(error)
          if (error instanceof Error) snackbarStore.showError(error.toString())
          updateLikeState(true)
        }
      }

      // обновляем колонки с лайкнутыми постами
      for (const column of settingsStore.columns) {
        if (column.type === ColumnType.likedPosts) {
          settingsStore.refreshColumn(column.id)
        }
      }
    }

    const postUrl = `https://vk.com/wall${data.owner_id}_${data.id}`

    const isAd = !!data.marked_as_ads || data.header?.type === 'ads'

    const _onClick = (e: MouseEvent<HTMLElement>) => {
      const clickable = [
        '.wall-post-actions',
        '.media-grid',
        'a',
        '.poll',
        '.dropdown-menu',
        '.wall-post-avatar',
        '.link-card',
      ]
      for (const clickableSelector of clickable) {
        if ((e.target as HTMLElement).closest(clickableSelector)) return
      }

      restProps.onClick?.(e)
    }

    const openOwnerModal = () => {
      uiStore.showModal(<PagePreviewModal pageId={data.from_id!} {...uiStore.modalProps} />)
    }

    return (
      <article
        className={classNames('wall-post-wrap', className, {
          'blurred-ad': isAd && settingsStore.blurAds,
          clickable: !!restProps.onClick,
          'full-size': fullSize,
          'thread-item': threadItem,
        })}
        data-id={`${data.owner_id}_${data.id}`}
        ref={measureRef}
        {...restProps}
        onClick={_onClick}
      >
        <div className="wall-post">
          {!small && (
            <div className="left">
              <div className="wall-post-avatar" onClick={openOwnerModal}>
                <AsyncAvatar
                  gradientColor={calcInitialsAvatarColor(owner.id)}
                  size={threadItem ? 24 : 36}
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
                  <Avatar title={t`wallPost.verified`} size={16} className="badge verified-badge">
                    <Icon16Done width={12} height={12} className="verified-icon" />
                  </Avatar>
                )}
              </div>
            </div>
          )}
          <div className="wall-post-main">
            <header className="wall-post-header">
              <a
                className="wall-post-author"
                title={`${getName(owner)} @${owner.screen_name}`}
                onClick={openOwnerModal}
              >
                <span className="full-name">{getName(owner)}</span>
                <span className="screen-name">@{owner.screen_name}</span>
              </a>
              <div className="wall-post-header-right">
                {data.is_pinned && (
                  <span title={t`wallPost.pinned`}>
                    <Icon20PinOutline className="pin" width={12} height={12} />
                  </span>
                )}
                {!small && (
                  <a
                    className="time"
                    href={postUrl}
                    target="_blank"
                    title={date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}
                  >
                    {shortRelativeTime(date)}
                  </a>
                )}
              </div>
            </header>
            {data.post_source?.data === 'profile_photo' && (
              // если репостнуть новую фотографию, это будет и на репосте
              <div className="wall-post-source">{t`wallPost.photoUpdated`}</div>
            )}
            {data.final_post && (
              <div className="wall-post-source">
                {t('wallPost.deletedPage', {
                  context: ('sex' in owner && owner.sex) === 1 ? 'female' : 'male',
                })}
              </div>
            )}
            <div
              className={classNames('wall-post-content', {
                'full-size': fullSize,
              })}
              ref={contentRef}
            >
              <TextProcessor content={data.text || ''} parseInternalLinks />
            </div>
            {sticker && <Sticker sticker={sticker} />}
            {graffiti && <img src={graffiti.url} style={{ width: '60%' }} />}
            {showMediaGrid && mediaSize === ImageGridSize.medium && (
              <MediaGrid photos={_.map(photos, 'photo') as PhotosPhoto[]} />
            )}
            {hasRepost && !small && <SmallWallPost data={data.copy_history![0]} />}
            <div className="wall-post-badges">
              {hasPhotos && !showMediaGrid && (
                <MediaBadge
                  icon={<Icon20PictureOutline width={16} height={16} />}
                  type={t('wallPost.mediaBadge.photo', {
                    count: photos.length,
                  })}
                  // TODO: get it back
                  // onClick={() => {
                  //   openPhotosInViewer()
                  // }}
                />
              )}
              {!!videos.length && (
                <MediaBadge
                  icon={<Icon20VideoOutline width={16} height={16} />}
                  type={t('wallPost.mediaBadge.video', {
                    count: videos.length,
                  })}
                  subject={videos.length === 1 ? videos[0].video!.title : undefined}
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
              {!!podcast && (
                <MediaBadge
                  icon={<Icon24Podcast width={16} height={16} />}
                  type={t`wallPost.mediaBadge.podcast`}
                  subject={podcast.title}
                />
              )}
              {!!donutLink && (
                <MediaBadge
                  icon={<Icon28DonateOutline width={16} height={16} />}
                  type={t`wallPost.mediaBadge.donutLink`}
                  subject={donutLink.button.title}
                  href={donutLink.button.action.url}
                />
              )}
              {poll && (
                <AppearanceProvider appearance="dark">
                  <RichTooltip
                    content={
                      <Poll
                        data={poll}
                        updateData={(poll: PollsPoll) => {
                          const pollIndex = _.findIndex(data.attachments, { type: 'poll' })
                          updateData?.(
                            _.set({ ...data }, `attachments.${pollIndex}`, {
                              type: 'poll',
                              poll,
                            }),
                          )
                        }}
                      />
                    }
                  >
                    <MediaBadge
                      icon={<Icon16Poll />}
                      type={t`wallPost.mediaBadge.poll`}
                      subject={poll.question}
                    />
                  </RichTooltip>
                </AppearanceProvider>
              )}
              {hasMap && (
                <MediaBadge
                  icon={<Icon28LocationMapOutline width={16} height={16} />}
                  type={t`wallPost.mediaBadge.map`}
                />
              )}
              {!!eventGroup && (
                <MediaBadge
                  icon={<Icon20CalendarOutline width={16} height={16} />}
                  type={t`wallPost.mediaBadge.event`}
                  subject={eventGroup.name}
                />
              )}
              {!!situationalTheme && (
                <MediaBadge
                  icon={<Icon20LightbulbStarOutline width={16} height={16} />}
                  type={t`wallPost.mediaBadge.situationalTheme`}
                  subject={situationalTheme.title}
                  href={situationalTheme.link}
                />
              )}
              {!!textlive && (
                <MediaBadge
                  icon={<Icon24TextLiveOutline width={16} height={16} />}
                  type={t`wallPost.mediaBadge.textlive`}
                  subject={textlive.title}
                  href={textlive.attach_url}
                />
              )}
              {!!narrative && (
                <MediaBadge
                  icon={<Icon24NarrativeOutline width={16} height={16} />}
                  type={t`wallPost.mediaBadge.narrative`}
                  subject={narrative.title}
                />
              )}
              {!!curator && (
                <MediaBadge
                  icon={<Icon24NewsfeedMusicNoteOutline width={16} height={16} />}
                  type={t`wallPost.mediaBadge.curator`}
                  subject={curator.name}
                  href={curator.url}
                />
              )}
              {link && (showMediaGrid || small) && (
                <MediaBadge
                  icon={hasArticle ? <Icon16ArticleOutline /> : <Icon16LinkOutline />}
                  type={hasArticle ? t`wallPost.mediaBadge.article` : t`wallPost.mediaBadge.link`}
                  subject={hasArticle ? link.title : new URL(link.url).hostname}
                  title={hasArticle ? link.title : link.url}
                  href={link.url}
                />
              )}
            </div>
            {link && !showMediaGrid && !small && <LinkCard link={link} />}
            {!small && (
              <>
                {data.signer_id && (
                  <a
                    className="wall-post-signer"
                    onClick={() => {
                      uiStore.showModal(
                        <PagePreviewModal pageId={data.signer_id!} {...uiStore.modalProps} />,
                      )
                    }}
                  >
                    <Icon12User />
                    {getName(getOwner(data.signer_id))}
                  </a>
                )}
                {/* TODO: источник? */}
                <div className="wall-post-footer">
                  <div className="wall-post-actions">
                    <div
                      title={t`wallPost.actions.like`}
                      className={classNames('wall-post-action-item', 'action-like', {
                        'user-likes': !!data.likes?.user_likes,
                      })}
                      // TODO: likes.can_like (0 при удалении страницы, например)
                      onClick={onLikeClick}
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
                      title={t`wallPost.actions.comment`}
                      // TODO: comments.can_post
                      // TODO: открывать блок для быстрого комментария?
                    >
                      <Icon20CommentOutline width={18} height={18} />
                      {numberFormatter(data.comments?.count)}
                    </div>
                    <div
                      className="wall-post-action-item action-share"
                      title={t`wallPost.actions.share`}
                    >
                      <Icon20ShareOutline width={18} height={18} />
                      {numberFormatter(data.reposts?.count)}
                    </div>
                    <DropdownMenu
                      items={[
                        <DropdownMenuItem
                          key="copy"
                          onClick={async () => {
                            await navigator.clipboard.writeText(postUrl)
                            snackbarStore.show(t`wallPost.linkCopied`)
                          }}
                        >
                          <Icon20CopyOutline width={16} height={16} />
                          {t`wallPost.actions.copyLink`}
                        </DropdownMenuItem>,
                        !comment && (
                          <DropdownMenuItem
                            key="favorite"
                            onClick={async () => {
                              await (data.is_favorite
                                ? apiStore.api.call<FaveRemovePostResponse, FaveRemovePostParams>(
                                    'fave.removePost',
                                    {
                                      id: data.id!,
                                      owner_id: data.owner_id!,
                                    },
                                  )
                                : apiStore.api.call<FaveAddPostResponse, FaveAddPostParams>(
                                    'fave.addPost',
                                    {
                                      id: data.id!,
                                      owner_id: data.owner_id!,
                                      access_key: data.access_key,
                                    },
                                  ))

                              updateData?.({
                                ...data,
                                is_favorite: !data.is_favorite,
                              })
                              snackbarStore.show(
                                data.is_favorite
                                  ? t`wallPost.actions.removeBookmarkSuccess`
                                  : t`wallPost.actions.addBookmarkSuccess`,
                              )

                              // обновляем колонки с закладками
                              // TODO: почти такое же есть выше. может, выделить в метод SettingsStore?
                              for (const column of settingsStore.columns) {
                                if (column.type === ColumnType.bookmarks) {
                                  settingsStore.refreshColumn(column.id)
                                }
                              }
                            }}
                          >
                            <Icon16BookmarkOutline />
                            {!data.is_favorite
                              ? t`wallPost.actions.addBookmark`
                              : t`wallPost.actions.removeBookmark`}
                          </DropdownMenuItem>
                        ),
                        <DropdownMenuItem key="open" onClick={() => window.open(postUrl)}>
                          <Icon28LogoVkOutline width={16} height={16} />
                          {t`wallPost.actions.openInBrowser`}
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
                            <Icon20DeleteOutline width={16} height={16} />
                            {t`wallPost.actions.delete`}
                          </DropdownMenuItem>
                        ),
                      ]}
                    >
                      <div
                        className="wall-post-action-item action-menu"
                        title={t`wallPost.actions.menu`}
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
              </>
            )}
          </div>
        </div>
        {!!photos.length && mediaSize === ImageGridSize.large && (
          <MediaGrid photos={_.map(photos, 'photo') as PhotosPhoto[]} />
        )}
      </article>
    )
  },
)
