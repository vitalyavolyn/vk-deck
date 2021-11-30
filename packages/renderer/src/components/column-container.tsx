import { FC } from 'react'
import { TestColumn } from './columns/test-column'
import { NewsfeedColumn } from './columns/newsfeed-column'
import { useStore } from '@/hooks/use-store'
import { Column } from '@/store/settings-store'
import './column-container.css'

const columnComponents = {
  test: TestColumn,
  newsfeed: NewsfeedColumn,
}

interface ColumnContainerProps {
  columnId: string
}

export interface ColumnProps {
  data: Column
}

export const ColumnContainer: FC<ColumnContainerProps> = ({ columnId }) => {
  const { settingsStore } = useStore()
  const column = settingsStore.getColumn(columnId)
  const Component = column ? columnComponents[column.type] : undefined

  return (
    <div className="column">{Component && <Component data={column} />}</div>
  )
}
