import { FC, Fragment, useEffect, useState } from 'react'
import {
  WallGetByIdExtendedResponse,
  WallGetByIdParams,
  WallGetCommentsExtendedResponse,
  WallGetCommentsParams,
  WallWallComment,
  WallWallpostAttachment,
  WallWallpostFull,
} from '@vkontakte/api-schema-typescript'
import { Icon28ArrowLeftOutline } from '@vkontakte/icons'
import { PanelSpinner, WriteBar, WriteBarIcon } from '@vkontakte/vkui'
import { useTranslation } from 'react-i18next'
import { AsyncAvatar } from '@/components/async-avatar'
import { WithColumnStack } from '@/components/column-container'
import { WallPost } from '@/components/wall-post'
import { useColumn } from '@/hooks/use-column'
import { useStore } from '@/hooks/use-store'
import { getInitials } from '@/utils/get-initials'
import { getName } from '@/utils/get-name'
import { ColumnHeader } from './common/column-header'

import './wall-post-column.css'

// TODO: хранить в одном месте для всего приложения?
const fields = 'photo_50,verified,screen_name'

interface WallPostColumnProps {
  post?: WallWallpostFull
  /// обязательно, если нет полной информации о посте
  postId?: string
}

const commentToWallPost = (comment: WallWallComment): WallWallpostFull => {
  /* eslint-disable camelcase */
  const { id, owner_id, from_id, attachments, text, date, likes } = comment

  return {
    id,
    owner_id,
    from_id,
    attachments: attachments as WallWallpostAttachment[],
    text,
    date,
    likes,
  }
  /* eslint-enable camelcase */
}

// TODO: прикрепление картинок
export const WallPostColumn: FC<WallPostColumnProps> = ({ post, postId }) => {
  const { apiStore } = useStore()
  const { columnStack } = useColumn<WithColumnStack>()
  const { t } = useTranslation()

  const [postData, setPostData] = useState<WallWallpostFull | undefined>(post)
  // const [isAttachmentsShown, setIsAttachmentsShown] = useState(false)
  const [text, setText] = useState('')
  const [comments, setComments] = useState<WallWallComment[] | null>(null)

  const { user } = apiStore.initData

  const fetchPostData = async () => {
    try {
      const { items, profiles, groups } = await apiStore.api.call<
        WallGetByIdExtendedResponse,
        WallGetByIdParams
      >('wall.getById', {
        extended: 1,
        posts: postId!,
        fields,
      })

      apiStore.add('profiles', profiles)
      apiStore.add('groups', groups)

      if (items[0]) {
        setPostData(items[0])
      } else {
        // ???
      }
    } catch {
      // TODO
    }
  }

  const fetchComments = async () => {
    // TODO: auto-update
    if (!postData) return

    try {
      const { items, profiles, groups } = await apiStore.api.call<
        WallGetCommentsExtendedResponse,
        WallGetCommentsParams
      >('wall.getComments', {
        owner_id: postData.owner_id,
        post_id: postData.id,
        extended: 1,
        count: 100,
        need_likes: 1,
        thread_items_count: 10,
        fields,
      })

      apiStore.add('profiles', profiles)
      apiStore.add('groups', groups)

      setComments(items)
    } catch {
      // TODO
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postData])

  useEffect(() => {
    if (!post && postId) {
      fetchPostData()
    }
  }, [])

  return (
    <>
      <ColumnHeader onIconClick={() => columnStack.pop()} icon={Icon28ArrowLeftOutline}>
        {t`columns.wallPost`}
      </ColumnHeader>
      <div className="column-list-content">
        {postData ? (
          <WallPost
            data={postData}
            fullSize
            updateData={(post: WallWallpostFull) => {
              setPostData(post)
              // TODO: обновить в компоненте, создавшем колонку?
            }}
          />
        ) : (
          <PanelSpinner />
        )}
        {comments ? (
          <>
            {!!comments.length && (
              <div className="comments-header">
                {/* счетчик то не тот */}
                {t('wallPostColumn.commentsCount', { count: comments.length })}
              </div>
            )}
            {comments
              .map((comment) => ({
                post: commentToWallPost(comment),
                thread: comment.thread,
              }))
              .map(({ post: fakePost, thread }) => (
                <Fragment key={fakePost.id}>
                  <WallPost data={fakePost} fullSize />
                  {thread?.items?.map(commentToWallPost).map((fakePost) => (
                    <WallPost data={fakePost} key={fakePost.id} fullSize className="thread-item" />
                    // TODO: "load more"
                  ))}
                </Fragment>
              ))}
          </>
        ) : (
          postData && <PanelSpinner />
        )}
      </div>
      {!!postData?.comments?.can_post && (
        <>
          <div style={{ position: 'sticky' }}>
            <WriteBar
              className="comment-input"
              before={
                <WriteBarIcon aria-label="send as">
                  <AsyncAvatar
                    initials={getInitials(user)}
                    gradientColor={(user.id % 6) + 1}
                    size={32}
                    src={user.photo_50}
                    title={getName(user)}
                  />
                </WriteBarIcon>
              }
              after={<>{text.length > 0 && <WriteBarIcon disabled={true} mode="send" />}</>}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t`wallPostColumn.commentPlaceholder`}
            />
          </div>
        </>
      )}
    </>
  )
}
