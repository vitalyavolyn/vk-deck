import { ReactChild, VFC } from 'react'
import { NotificationsNotification, WallWallpostFull } from '@vkontakte/api-schema-typescript'
import { Icon20Like } from '@vkontakte/icons'
import { MeasureRef } from 'react-cool-virtual'
import { WithColumnStack } from '@/components/column-container'
import { WallPostColumn } from '@/components/columns/wall-post-column'
import { WallPost } from '@/components/wall-post'
import { useColumn } from '@/hooks/use-column'
import { useStore } from '@/hooks/use-store'
import { getName } from '@/utils/get-name'

import './notification.css'

interface NotificationProps {
  data: NotificationsNotification
  measureRef?: MeasureRef
}

interface CardProps {
  icon: ReactChild
  before?: ReactChild
  content?: ReactChild
  measureRef?: MeasureRef
}

/*
 * Напоминает пост, использует его стили, но отображает уведомление
 */
const Card: VFC<CardProps> = ({ icon, before, content, measureRef }) => {
  return (
    <article className="wall-post-wrap notification-card" ref={measureRef}>
      {before}
      <div className="wall-post">
        <div className="left">{icon}</div>
        <div className="wall-post-main">
          <div className="wall-post-header">
            <div className="wall-post-author"></div>
            <div className="wall-post-header-right"></div>
          </div>
          <div className="wall-post-content">{content}</div>
        </div>
      </div>
    </article>
  )
}

// eslint-disable-next-line react/no-multi-comp
export const Notification: VFC<NotificationProps> = ({ data, measureRef }) => {
  const { apiStore } = useStore()
  // const { t } = useTranslation()
  const { columnStack } = useColumn<WithColumnStack>()

  if (['reply_comment', 'comment_post'].includes(data.type!)) {
    return (
      <WallPost
        data={data.feedback as WallWallpostFull}
        measureRef={measureRef}
        onClick={() => {
          columnStack?.push(
            <WallPostColumn postId={`${data.feedback!.owner_id}_${data.feedback!.post_id}`} />,
          )
        }}
      />
    )
  } else if (['like_photo', 'like_comment'].includes(data.type!)) {
    return (
      <Card
        icon={<Icon20Like width={16} height={16} fill="var(--dynamic_red)" />}
        measureRef={measureRef}
        content={
          data.feedback!.items!.map(({ from_id: id }) => getName(apiStore.getOwner(id))).join(',') +
          `\n\n${data.type}`
        }
      />
    )
  }

  return <div ref={measureRef}>{data.type}</div>
}
