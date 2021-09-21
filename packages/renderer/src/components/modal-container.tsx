import { FC } from 'react'
import { ComposeModal } from './modals/compose'

import './modal-container.css'

const modals = {
  compose: ComposeModal,
}

export type ModalName = keyof typeof modals // lmao

interface ModalContainerProps {
  modal?: ModalName
}

export const ModalContainer: FC<ModalContainerProps> = ({ modal }) => {
  const Component = modal ? modals[modal] : undefined

  return (
    <div className="modal-container">
      {Component && <Component />}
    </div>
  )
}
