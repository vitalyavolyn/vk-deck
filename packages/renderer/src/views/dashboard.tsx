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
import { Columns } from '@/components/columns'
import { Navbar } from '@/components/navbar'
import { SidePanelContainer, SidePanelName } from '@/components/side-panel-container'
import { useStore } from '@/hooks/use-store'

import './dashboard.css'

const scrollToColumn = (id: string) => {
  document.querySelector(`.column[data-id="${id}"]`)?.scrollIntoView({ behavior: 'smooth' })
}

export const Dashboard: FC = observer(() => {
  const { viewWidth } = useAdaptivity()
  const { snackbarStore, settingsStore, uiStore } = useStore()
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [activeSidePanel, setActiveSidePanel] = useState<SidePanelName | undefined>()

  if (!viewWidth) return <PanelSpinner />

  const openSidePanel = (name: SidePanelName) => {
    setActiveSidePanel(name)
    setIsSidePanelOpen(true)
  }

  const closeSidePanel = () => {
    setIsSidePanelOpen(false)
    setTimeout(() => setActiveSidePanel(undefined), 200)
  }

  // глобальный шорткат для
  //  - создания записи
  //  - скролла к определенной колонке
  useEffect(() => {
    window.addEventListener(
      'keypress',
      (e) => {
        if (
          e.code === 'KeyN' &&
          !/textarea|input|select/i.test(document.activeElement?.nodeName || '')
        ) {
          setActiveSidePanel('compose')
          setIsSidePanelOpen(true)
        } else if (/^(Digit)|(Numpad)/.test(e.code)) {
          const index = Number(e.key) - 1
          const id = settingsStore.columns[index]?.id
          if (id) scrollToColumn(id)
        }
      },
      true,
    )
  }, [])

  const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET

  const toggleSidePanel = (name: SidePanelName) => {
    !isSidePanelOpen || activeSidePanel !== name ? openSidePanel(name) : setIsSidePanelOpen(false)
  }

  return (
    <SplitLayout modal={uiStore.modal}>
      <SplitCol fixed width="64px" maxWidth="64px" style={{ zIndex: 1 }}>
        <Navbar
          onColumnClick={scrollToColumn}
          isComposerOpened={isSidePanelOpen && activeSidePanel === 'compose'}
          onComposeButtonClick={() => toggleSidePanel('compose')}
          onSettingsClick={() => toggleSidePanel('settings')}
          onAddColumnClick={() => toggleSidePanel('add-column')}
        />
      </SplitCol>

      <SplitCol
        spaced={isDesktop}
        className={classNames({ 'side-panel-open': isSidePanelOpen }, 'columns-container')}
      >
        <SidePanelContainer sidePanel={activeSidePanel} closeSidePanel={closeSidePanel} />
        <Columns />
      </SplitCol>
      {snackbarStore.element}
    </SplitLayout>
  )
})
