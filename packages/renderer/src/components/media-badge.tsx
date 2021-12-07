import { FC } from 'react'

import './media-badge.css'

interface MediaBadgeProps {
  icon: JSX.Element
  type: string
  subject?: string
  title?: string
}

export const MediaBadge: FC<MediaBadgeProps> = ({
  icon,
  type,
  subject,
  title,
}) => {
  return (
    <div className="media-badge">
      {icon} {type} {subject && <b title={title || subject}>{subject}</b>}
    </div>
  )
}
