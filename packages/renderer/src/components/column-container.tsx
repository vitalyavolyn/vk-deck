import { FC } from 'react'
import { LikedPostsColumn } from '@/components/columns/liked-posts-column'
import { createColumnContext } from '@/hooks/use-column'
import { useStore } from '@/hooks/use-store'
import { ColumnType } from '@/store/settings-store'
import { NewsfeedColumn } from './columns/newsfeed-column'
import { RickColumn } from './columns/rick-column'
import { WallColumn } from './columns/wall-column'

import './column-container.css'

const columnComponents = {
  [ColumnType.rick]: RickColumn,
  [ColumnType.newsfeed]: NewsfeedColumn,
  [ColumnType.wall]: WallColumn,
  [ColumnType.likedPosts]: LikedPostsColumn,
}

interface ColumnContainerProps {
  columnId: string
}

export const ColumnContainer: FC<ColumnContainerProps> = ({ columnId }) => {
  const { settingsStore } = useStore()
  const column = settingsStore.getColumn(columnId)
  const Component = column ? columnComponents[column.type] : undefined

  const Context = createColumnContext<typeof column>()

  return (
    <Context.Provider value={column}>
      <div className="column" data-id={columnId}>
        {Component && <Component />}
      </div>
    </Context.Provider>
  )
}
