import { FC } from 'react'
import { PanelHeaderBack, Separator, Title } from '@vkontakte/vkui'

import './modal-header.css'

interface ModalHeaderProps {
  children: string
  onBackButtonClick?(): void
}

export const ModalHeader: FC<ModalHeaderProps> = ({
  children,
  onBackButtonClick,
}) => {
  return (
    <div className="modal-header">
      <div className="modal-header-content">
        {onBackButtonClick && (
          <PanelHeaderBack
            onClick={onBackButtonClick}
            className="back-button"
          />
        )}
        <Title level="2" weight="semibold">
          {children}
        </Title>
      </div>
      <Separator wide />
    </div>
  )
}
