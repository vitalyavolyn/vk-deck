import { FC, useEffect, useState } from 'react'
import {
  classNames,
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

import './dashboard.css'

export const Dashboard: FC = observer(() => {
  const { viewWidth } = useAdaptivity()
  const { snackbarStore } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<ModalName | undefined>()
  if (!viewWidth) return <PanelSpinner />

  const openModal = (name: ModalName) => {
    setActiveModal(name)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)

    // тайпскрипт и еслинт меня троллят, один не разрешает без параметров, другой против `undefined`
    // eslint-disable-next-line unicorn/no-useless-undefined
    setTimeout(() => setActiveModal(undefined), 200)
  }

  // глобальный шорткат для создания записи
  useEffect(() => {
    window.addEventListener('keypress', (e) => {
      if (e.code === 'KeyN') {
        setActiveModal('compose')
        setIsModalOpen(true)
      }
    }, true)
  }, [])

  const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET

  return (
    <SplitLayout>
      <SplitCol fixed width="64px" maxWidth="64px" style={{ zIndex: 1 }}>
        <Navbar
          onColumnClick={() => { console.log('click!') }}
          onComposeButtonClick={() => (!isModalOpen || activeModal !== 'compose') ? openModal('compose') : setIsModalOpen(false)}
          isComposerOpened={isModalOpen && activeModal === 'compose'}
          onSettingsClick={() => (!isModalOpen || activeModal !== 'settings') ? openModal('settings') : setIsModalOpen(false)}
        />
      </SplitCol>

      <SplitCol
        spaced={isDesktop}
        className={classNames({ 'modal-open': isModalOpen }, 'columns-container')}
      >
        <ModalContainer modal={activeModal} closeModal={closeModal} />
        <Columns />
      </SplitCol>
      {snackbarStore.element}
    </SplitLayout>
  )
})
