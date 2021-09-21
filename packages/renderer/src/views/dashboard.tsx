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
import { ComposeModal } from '../components/compose-modal'
import { useStore } from '../hooks/use-store'

export const Dashboard: FC = observer(() => {
  const { viewWidth } = useAdaptivity()
  const { snackbar } = useStore()
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false)
  if (!viewWidth) return <PanelSpinner />

  const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET

  return (
    <SplitLayout
      style={{ justifyContent: 'center' }}
    >
      <SplitCol fixed width="64px" maxWidth="64px" style={{ zIndex: 1 }}>
        <Navbar
          onColumnClick={() => { console.log('click!') }}
          onComposeButtonClick={() => setIsComposeModalOpen(!isComposeModalOpen)}
        />
      </SplitCol>

      <SplitCol
        spaced={isDesktop}
        style={{ transform: `translateX(${isComposeModalOpen ? 100 : 0}px)`, transitionDuration: '200ms' }}
      >
        <ComposeModal />
        <Columns />
      </SplitCol>
      {snackbar.element}
    </SplitLayout>
  )
})
