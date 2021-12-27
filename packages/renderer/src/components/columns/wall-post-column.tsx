import { FC, useEffect, useState } from 'react'
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
import { FixedLayout, PanelSpinner, Separator, WriteBar, WriteBarIcon } from '@vkontakte/vkui'
import { useTranslation } from 'react-i18next'
import { WithColumnStack } from '@/components/column-container'
import { WallPost } from '@/components/wall-post'
import { useColumn } from '@/hooks/use-column'
import { useStore } from '@/hooks/use-store'
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
  const { id, owner_id, from_id, attachments, text, date } = comment

  return {
    id,
    owner_id,
    from_id,
    attachments: attachments as WallWallpostAttachment[],
    text,
    date,
  }
  /* eslint-enable camelcase */
}

export const WallPostColumn: FC<WallPostColumnProps> = ({ post, postId }) => {
  const { apiStore } = useStore()
  const { columnStack } = useColumn<WithColumnStack>()
  const { t } = useTranslation()

  // загрузить инфу о посте если ее нет
  const [postData, setPostData] = useState<WallWallpostFull | undefined>(post)
  // const [isAttachmentsShown, setIsAttachmentsShown] = useState(false)
  const [text, setText] = useState('')
  const [comments, setComments] = useState<WallWallComment[] | null>(null)

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
        {postData ? <WallPost data={postData} fullSize /> : <PanelSpinner />}
        {comments ? (
          <>
            <div className="comments-header">
              {t('wallPostColumn.commentsCount', { count: comments.length })}
            </div>
            {comments
              .map((comment) => commentToWallPost(comment))
              .map((fakePost) => (
                <WallPost data={fakePost} key={fakePost.id} fullSize />
              ))}
          </>
        ) : (
          postData && <PanelSpinner />
        )}
        <FixedLayout vertical="bottom">
          <div>
            <Separator wide />

            {/* isAttachmentsShown && (
              // TODO
              <div>
                <Div>Интерфейс прикрепления</Div>
                <Separator wide />
              </div>
            ) */}

            <WriteBar
              /* before={
                <WriteBarIcon
                  mode="attach"
                  onClick={() => setIsAttachmentsShown(!isAttachmentsShown)}
                  count={isAttachmentsShown ? undefined : 5}
                />
              } */
              after={<>{text.length > 0 && <WriteBarIcon disabled={true} mode="send" />}</>}
              value={text}
              onChange={(e) => setText(e.target.value)}
              // TODO: padding
              // onHeightChange={() => updateBottomPadding()}
              placeholder={t`wallPostColumn.commentPlaceholder`}
            />
          </div>
        </FixedLayout>
      </div>
    </>
  )
}
