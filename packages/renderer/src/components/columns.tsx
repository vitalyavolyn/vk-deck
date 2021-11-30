import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { ColumnContainer } from './column-container'
import { useStore } from '@/hooks/use-store'

import './columns.css'

export const Columns: FC = observer(() => {
  const { settingsStore } = useStore()

  return (
    <div className="columns">
      {settingsStore.columns.map((e) => (
        <ColumnContainer columnId={e.id} key={e.id} />
      ))}
    </div>
  )
})
