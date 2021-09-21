import { FC } from 'react'
import { Separator, Title } from '@vkontakte/vkui'

export const ComposeModal: FC = () => {
  return (
    <div className="modal">
      {/* TODO: ModalHeader? */}
      <Title level="2" weight="semibold">Создать запись</Title>
      <Separator wide style={{ marginTop: 8 }} />
    </div>
  )
}
