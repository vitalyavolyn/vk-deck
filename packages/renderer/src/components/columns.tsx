import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { classNames } from '@vkontakte/vkjs'
import { ColumnContainer } from './column-container'
import { useStore } from '@/hooks/use-store'
import { ColumnSize } from '@/store/settings-store'

import './columns.css'

export const Columns: FC = observer(() => {
  const { settingsStore } = useStore()

  return (
    <div
      className={classNames('columns', {
        'narrow-columns': settingsStore.columnSize === ColumnSize.narrow,
        'wide-columns': settingsStore.columnSize === ColumnSize.wide,
      })}
    >
      {settingsStore.columns.map((e) => (
        <ColumnContainer columnId={e.id} key={e.id} />
      ))}
    </div>
  )
})
