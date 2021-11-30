import { FC, ReactNode } from 'react'
import './column-header.css'
import { Icon24Filter } from '@vkontakte/icons'
import { Subhead, Title } from '@vkontakte/vkui'

interface ColumnHeaderProps {
  icon: ReactNode
  showSettingsButton?: boolean
  subtitle?: string
}

export const ColumnHeader: FC<ColumnHeaderProps> = ({
  children,
  icon,
  showSettingsButton = true,
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
          onClick={() => {
            console.log('TODO: handle this click')
          }}
        />
      )}
    </header>
  )
}
