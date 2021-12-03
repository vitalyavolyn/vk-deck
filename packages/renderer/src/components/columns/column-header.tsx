import { FC, MouseEvent } from 'react'
import { Icon24Filter } from '@vkontakte/icons'
import { Subhead, Title } from '@vkontakte/vkui'
import { classNames } from '@vkontakte/vkjs'
import { IconProps } from '@/components/navbar'

import './column-header.css'

interface ColumnHeaderProps {
  icon: FC<IconProps>
  showSettingsButton?: boolean
  onSettingsClick?(e: MouseEvent<HTMLDivElement>): void
  subtitle?: string
  onClick?(e: MouseEvent<HTMLDivElement>): void
}

export const ColumnHeader: FC<ColumnHeaderProps> = ({
  children,
  icon,
  showSettingsButton = false,
  onSettingsClick,
  onClick,
  subtitle,
}) => {
  const _onClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const isSettingsClick = target.closest('.column-settings-toggle')
    if (isSettingsClick) {
      if (onSettingsClick) onSettingsClick(e)
    } else {
      if (onClick) onClick(e)
    }
  }

  const Icon = icon

  return (
    <header
      className={classNames('column-header', { clickable: !!onClick })}
      onClick={_onClick}
    >
      <Icon width={26} height={26} />
      <div className="column-title">
        <Title level="3" weight="semibold">
          {children}
        </Title>
        <Subhead weight="medium">{subtitle}</Subhead>
      </div>
      {showSettingsButton && (
        <Icon24Filter
          className="column-settings-toggle"
          onClick={(e) => {
            if (onSettingsClick) onSettingsClick(e)
          }}
        />
      )}
    </header>
  )
}
