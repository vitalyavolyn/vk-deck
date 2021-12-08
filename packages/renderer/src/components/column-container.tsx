import { FC } from 'react'
import { useStore } from '@/hooks/use-store'
import { BaseColumn, ColumnType } from '@/store/settings-store'
import { NewsfeedColumn } from './columns/newsfeed-column'
import { RickColumn } from './columns/rick-column'
import { WallColumn } from './columns/wall-column'

import './column-container.css'

const columnComponents = {
  [ColumnType.rick]: RickColumn,
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
