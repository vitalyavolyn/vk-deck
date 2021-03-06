import { FC, MouseEvent } from 'react'
import { Icon24Filter } from '@vkontakte/icons'
import { classNames } from '@vkontakte/vkjs'
import { Subhead, Title } from '@vkontakte/vkui'
import { IconProps } from '@/components/navbar'

import './column-header.css'

interface ColumnHeaderProps {
  icon: FC<IconProps>
  onSettingsClick?(e: MouseEvent<HTMLDivElement>): void
  subtitle?: string
  onClick?(e: MouseEvent<HTMLDivElement>): void
  onIconClick?(e: MouseEvent<HTMLDivElement>): void
  clickable?: boolean
}

export const ColumnHeader: FC<ColumnHeaderProps> = ({
  children,
  icon,
  onSettingsClick,
  onClick,
  onIconClick,
  subtitle,
  clickable,
}) => {
  const _onClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const isSettingsClick = target.closest('.column-settings-toggle')
    if (isSettingsClick) {
      if (onSettingsClick) onSettingsClick(e)
    } else if (clickable && onClick) {
      onClick(e)
    }
  }

  const Icon = icon

  return (
    <header
      className={classNames('column-header', { clickable: clickable && !!onClick })}
      onClick={_onClick}
    >
      <Icon
        width={26}
        height={26}
        className="column-icon"
        onClick={onIconClick}
        style={{ cursor: onIconClick ? 'pointer' : undefined }}
      />
      <div className="column-title">
        <Title level="3" weight="2">
          {children}
        </Title>
        <Subhead weight="medium">{subtitle}</Subhead>
      </div>
      {onSettingsClick && (
        <Icon24Filter className="column-settings-toggle" onClick={onSettingsClick} />
      )}
    </header>
  )
}
