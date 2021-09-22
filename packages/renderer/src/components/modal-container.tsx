import { FC } from 'react'
import { ComposeModal } from './modals/compose-modal'

import './modal-container.css'

const modals = {
  compose: ComposeModal,
}

export type ModalName = keyof typeof modals // lmao

interface ModalContainerProps {
  modal?: ModalName
  closeModal(): void
}

export interface ModalProps {
  closeModal(): void
}

export const ModalContainer: FC<ModalContainerProps> = ({ modal, closeModal }) => {
  const Component = modal ? modals[modal] : undefined

  return (
    <div className="modal-container">
      {Component && <Component closeModal={closeModal} />}
    </div>
  )
}
