import { FC, HTMLAttributes, Ref } from 'react'

import './media-badge.css'

interface MediaBadgeProps extends HTMLAttributes<HTMLAnchorElement> {
  icon: JSX.Element
  type: string
  subject?: string
  title?: string
  href?: string
  onClick?(): void
  getRootRef?: Ref<HTMLAnchorElement>
}

export const MediaBadge: FC<MediaBadgeProps> = ({
  icon,
  type,
  subject,
  title,
  href,
  onClick,
  getRootRef,
  ...rest
}) => {
  const linkProps = href
    ? {
        target: '_blank',
        href,
      }
    : {}

  return (
    <a className="media-badge" {...linkProps} onClick={onClick} ref={getRootRef} {...rest}>
      {icon} {type} {subject && <b title={title || subject}>{subject}</b>}
    </a>
  )
}
