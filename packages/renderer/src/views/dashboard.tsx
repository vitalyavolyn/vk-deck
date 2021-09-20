import { FC } from 'react'
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

export const Dashboard: FC = observer(() => {
  const { viewWidth } = useAdaptivity()
  const { snackbar } = useStore()
  if (!viewWidth) return <PanelSpinner />

  const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET

  return (
    <SplitLayout
      style={{ justifyContent: 'center' }}
    >
      <SplitCol fixed width="64px" maxWidth="64px">
        <Navbar onColumnClick={() => { console.log('click!') }} />
      </SplitCol>

      <SplitCol
        spaced={isDesktop}
      >
        <Columns />
      </SplitCol>
      {snackbar.element}
    </SplitLayout>
  )
})
