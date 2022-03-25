import { ReactChild, VFC } from 'react'
import { NotificationsNotification, WallWallpostFull } from '@vkontakte/api-schema-typescript'
import { Icon20AddCircleFillBlue, Icon20LikeCircleFillRed } from '@vkontakte/icons'
import { calcInitialsAvatarColor } from '@vkontakte/vkui'
import { MeasureRef } from 'react-cool-virtual'
import { AsyncAvatar } from '@/components/async-avatar'
import { WithColumnStack } from '@/components/column-container'
import { WallPostColumn } from '@/components/columns/wall-post-column'
import { WallPost } from '@/components/wall-post'
import { useColumn } from '@/hooks/use-column'
import { useStore } from '@/hooks/use-store'
import { getInitials } from '@/utils/get-initials'
import { getName } from '@/utils/get-name'

import './notification.css'

interface NotificationProps {
  data: NotificationsNotification
  measureRef?: MeasureRef
}

interface CardProps {
  avatar: ReactChild
  before?: ReactChild
  content?: ReactChild
  measureRef?: MeasureRef
}

/*
 * Напоминает пост, использует его стили, но отображает уведомление
 */
const Card: VFC<CardProps> = ({ avatar, before, content, measureRef }) => {
  return (
    <article className="wall-post-wrap notification-card" ref={measureRef}>
      {before}
      <div className="wall-post">
        <div className="left">{avatar}</div>
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
        reply
      />
    )
  } else if (['like_photo', 'like_comment'].includes(data.type!)) {
    const firstPersonId = data.feedback!.items![0].from_id
    const profile = apiStore.getOwner(firstPersonId)

    return (
      <Card
        avatar={
          <div className="wall-post-avatar" /* onClick={openOwnerModal} */>
            <AsyncAvatar
              gradientColor={calcInitialsAvatarColor(profile.id)}
              size={36}
              src={profile.photo_50}
              initials={getInitials(profile)}
              badge={<Icon20LikeCircleFillRed width={16} height={16} />}
            />
          </div>
        }
        measureRef={measureRef}
        content={
          data.feedback!.items!.map(({ from_id: id }) => getName(apiStore.getOwner(id))).join(',') +
          `\n\n${data.type}`
        }
        // TODO onClick
      />
    )
  } else if (data.type! === 'follow') {
    const firstPersonId = data.feedback!.items![0].from_id
    const profile = apiStore.getOwner(firstPersonId)

    return (
      <Card
        avatar={
          <div className="wall-post-avatar" /* onClick={openOwnerModal} */>
            <AsyncAvatar
              gradientColor={calcInitialsAvatarColor(profile.id)}
              size={36}
              src={profile.photo_50}
              initials={getInitials(profile)}
              badge={<Icon20AddCircleFillBlue width={16} height={16} />}
            />
          </div>
        }
        measureRef={measureRef}
        content={
          data.feedback!.items!.map(({ from_id: id }) => getName(apiStore.getOwner(id))).join(',') +
          `\n\n${data.type}`
        }
        // TODO onClick
      />
    )
  }

  return <div ref={measureRef}>{data.type}</div>
}
