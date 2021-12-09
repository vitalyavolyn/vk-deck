import { FC } from 'react'

import './media-badge.css'

interface MediaBadgeProps {
  icon: JSX.Element
  type: string
  subject?: string
  title?: string
  href?: string
  onClick?(): void
}

export const MediaBadge: FC<MediaBadgeProps> = ({ icon, type, subject, title, href, onClick }) => {
  const Component = href ? 'a' : 'div'

  const linkProps = href
    ? {
        target: '_blank',
        href,
      }
    : {}

  return (
    <Component className="media-badge" {...linkProps} onClick={onClick}>
      {icon} {type} {subject && <b title={title || subject}>{subject}</b>}
    </Component>
  )
}
