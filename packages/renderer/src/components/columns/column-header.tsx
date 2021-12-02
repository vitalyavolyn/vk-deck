import { FC, ReactNode, MouseEvent } from 'react'
import './column-header.css'
import { Icon24Filter } from '@vkontakte/icons'
import { Subhead, Title } from '@vkontakte/vkui'

interface ColumnHeaderProps {
  icon: ReactNode
  showSettingsButton?: boolean
  onSettingsClick?(e: MouseEvent<HTMLDivElement>): void
  subtitle?: string
}

export const ColumnHeader: FC<ColumnHeaderProps> = ({
  children,
  icon,
  showSettingsButton = false,
  onSettingsClick,
  subtitle,
}) => {
  return (
    <header className="column-header">
      {icon}
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
