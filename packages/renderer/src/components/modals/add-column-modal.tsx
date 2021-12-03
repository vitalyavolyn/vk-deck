import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalProps } from '../modal-container'
import { ModalHeader } from './modal-header'

import './add-column-modal.css'

export const AddColumnModal: FC<ModalProps> = () => {
  const { t } = useTranslation()

  return (
    <div className="modal add-column-modal">
      <ModalHeader>{t`addColumn.title`}</ModalHeader>
    </div>
  )
}
