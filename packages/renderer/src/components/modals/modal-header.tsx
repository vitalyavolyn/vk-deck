import { FC } from 'react'
import { Separator, Title } from '@vkontakte/vkui'
import './modal-header.css'

interface ModalHeaderProps {
  children: string
}

export const ModalHeader: FC<ModalHeaderProps> = ({ children }) => {
  return (
    <div className="modal-header">
      <Title level="2" weight="semibold">{children}</Title>
      <Separator wide />
    </div>
  )
}
