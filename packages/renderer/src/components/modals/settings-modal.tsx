import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalProps } from '../modal-container'
import { ModalHeader } from './modal-header'

export const SettingsModal: FC<ModalProps> = () => {
  const { t } = useTranslation()

  return (
    <div className="modal compose-modal">
      <ModalHeader>{t`settings.title`}</ModalHeader>
    </div>
  )
}
