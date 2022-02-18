import { FC } from 'react'
import { PanelHeaderBack, Separator, Title } from '@vkontakte/vkui'

import './side-panel-header.css'

interface SidePanelHeaderProps {
  children: string
  onBackButtonClick?(): void
}

export const SidePanelHeader: FC<SidePanelHeaderProps> = ({ children, onBackButtonClick }) => {
  return (
    <div className="side-panel-header">
      <div className="side-panel-header-content">
        {onBackButtonClick && (
          <PanelHeaderBack onClick={onBackButtonClick} className="back-button" />
        )}
        <Title level="2" weight="1">
          {children}
        </Title>
      </div>
      <Separator wide />
    </div>
  )
}
