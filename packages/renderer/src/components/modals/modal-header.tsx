import { FC } from 'react'
import { Separator, Title } from '@vkontakte/vkui'

interface ModalHeaderProps {
  children: string
}

export const ModalHeader: FC<ModalHeaderProps> = ({ children }) => {
  return (
    <>
      <Title level="2" weight="semibold">{children}</Title>
      <Separator wide />
    </>
  )
}
