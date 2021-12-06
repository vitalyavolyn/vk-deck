import { FC } from 'react'
import { TestColumn } from './columns/test-column'
import { NewsfeedColumn } from './columns/newsfeed-column'
import { WallColumn } from './columns/wall-column'
import { useStore } from '@/hooks/use-store'
import { BaseColumn, ColumnType } from '@/store/settings-store'

import './column-container.css'

const columnComponents = {
  [ColumnType.test]: TestColumn,
  [ColumnType.newsfeed]: NewsfeedColumn,
  [ColumnType.wall]: WallColumn,
}

interface ColumnContainerProps {
  columnId: string
}

export interface ColumnProps<Column extends BaseColumn = BaseColumn> {
  data: Column
  scrollToTop(): void
}

export const ColumnContainer: FC<ColumnContainerProps> = ({ columnId }) => {
  const { settingsStore } = useStore()
  const column = settingsStore.getColumn(columnId)
  const Component = column ? columnComponents[column.type] : undefined

  return (
    <div className="column" data-id={columnId}>
      {/* @ts-ignore: О нет, я сломал все дженериками. TODO */}
      {Component && <Component data={column} />}
    </div>
  )
}
