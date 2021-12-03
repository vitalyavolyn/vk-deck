import { FC } from 'react'
import './media-badge.css'

interface MediaBadgeProps {
  icon: JSX.Element
  type: string
  subject?: string
}

export const MediaBadge: FC<MediaBadgeProps> = ({ icon, type, subject }) => {
  return (
    <div className="media-badge">
      {icon} {type} <b title={subject}>{subject}</b>
    </div>
  )
}
