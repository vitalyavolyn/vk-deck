import { FC } from 'react'
import { AddColumnModal } from './modals/add-column-modal'
import { ComposeModal } from './modals/compose-modal'
import { SettingsModal } from './modals/settings-modal'

import './modal-container.css'

const modals = {
  compose: ComposeModal,
  settings: SettingsModal,
  'add-column': AddColumnModal,
}

export type ModalName = keyof typeof modals // lmao

interface ModalContainerProps {
  modal?: ModalName
  closeModal(): void
}

export interface ModalProps {
  closeModal(): void
}

export const ModalContainer: FC<ModalContainerProps> = ({
  modal,
  closeModal,
}) => {
  const Component = modal ? modals[modal] : undefined

  return (
    <div className="modal-container">
      {Component && <Component closeModal={closeModal} />}
    </div>
  )
}
