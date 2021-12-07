import { FC } from 'react'

import './media-badge.css'

interface MediaBadgeProps {
  icon: JSX.Element
  type: string
  subject?: string
  title?: string
  href?: string
}

export const MediaBadge: FC<MediaBadgeProps> = ({
  icon,
  type,
  subject,
  title,
  href,
}) => {
  const Component = href ? 'a' : 'div'

  const linkProps = href
    ? {
        target: '_blank',
        href,
      }
    : {}

  return (
    <Component className="media-badge" {...linkProps}>
      {icon} {type} {subject && <b title={title || subject}>{subject}</b>}
    </Component>
  )
}
