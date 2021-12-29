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
  const { snackbarStore, settingsStore } = useStore()
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

  // глобальный шорткат для создания записи
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

  return (
    <SplitLayout>
      <SplitCol fixed width="64px" maxWidth="64px" style={{ zIndex: 1 }}>
        <Navbar
          onColumnClick={scrollToColumn}
          // TODO: функции ниже надо привести в порядок и объединить
          onComposeButtonClick={() =>
            !isSidePanelOpen || activeSidePanel !== 'compose'
              ? openSidePanel('compose')
              : setIsSidePanelOpen(false)
          }
          isComposerOpened={isSidePanelOpen && activeSidePanel === 'compose'}
          onSettingsClick={() =>
            !isSidePanelOpen || activeSidePanel !== 'settings'
              ? openSidePanel('settings')
              : setIsSidePanelOpen(false)
          }
          onAddColumnClick={() =>
            !isSidePanelOpen || activeSidePanel !== 'add-column'
              ? openSidePanel('add-column')
              : setIsSidePanelOpen(false)
          }
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
