import { FC, useState } from 'react'
import {
  PanelSpinner,
  SplitCol,
  SplitLayout,
  useAdaptivity,
  ViewWidth,
} from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { Navbar } from '../components/navbar'
import { Columns } from '../components/columns'
import { useStore } from '../hooks/use-store'
import { ModalContainer, ModalName } from '../components/modal-container'

export const Dashboard: FC = observer(() => {
  const { viewWidth } = useAdaptivity()
  const { snackbar } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<ModalName | undefined>()
  if (!viewWidth) return <PanelSpinner />

  const openModal = (name: ModalName) => {
    setActiveModal(name)
    setIsModalOpen(true)
  }

  const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET

  return (
    <SplitLayout
      style={{ justifyContent: 'center' }}
    >
      <SplitCol fixed width="64px" maxWidth="64px" style={{ zIndex: 1 }}>
        <Navbar
          onColumnClick={() => { console.log('click!') }}
          onComposeButtonClick={() => !isModalOpen ? openModal('compose') : setIsModalOpen(false)}
          isComposerOpened={isModalOpen && activeModal === 'compose'}
        />
      </SplitCol>

      <SplitCol
        spaced={isDesktop}
        style={{
          transform: `translateX(${isModalOpen ? 'var(--modal-width)' : 0})`,
          transitionDuration: '200ms',
        }}
      >
        <ModalContainer modal={activeModal} />
        <Columns />
      </SplitCol>
      {snackbar.element}
    </SplitLayout>
  )
})
