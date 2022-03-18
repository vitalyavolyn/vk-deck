import { CSSProperties, FC, ReactNode, useState } from 'react'
import { classNames } from '@vkontakte/vkjs'
import { NotificationsColumn } from '@/components/columns/notifications-column'
import { createColumnContext } from '@/hooks/use-column'
import { useStore } from '@/hooks/use-store'
import { BaseColumn, ColumnType } from '@/store/settings-store'
import { BookmarksColumn } from './columns/bookmarks-column'
import { LikedPostsColumn } from './columns/liked-posts-column'
import { NewsfeedColumn } from './columns/newsfeed-column'
import { NewsfeedSearchColumn } from './columns/newsfeed-search-column'
import { RickColumn } from './columns/rick-column'
import { WallColumn } from './columns/wall-column'
import { WallPostColumn } from './columns/wall-post-column'

import './column-container.css'

const columnComponents = {
  [ColumnType.rick]: RickColumn,
  [ColumnType.newsfeed]: NewsfeedColumn,
  [ColumnType.wall]: WallColumn,
  [ColumnType.likedPosts]: LikedPostsColumn,
  [ColumnType.bookmarks]: BookmarksColumn,
  [ColumnType.newsfeedSearch]: NewsfeedSearchColumn,
  [ColumnType.wallPost]: WallPostColumn,
  [ColumnType.notifications]: NotificationsColumn,
}

interface ColumnContainerProps {
  columnId?: string
  columnData?: BaseColumn & { [key: string]: unknown }
}

export type ColumnStackActions = { push(el: ReactNode): void; pop(): void }

// TODO: rename?
export type WithColumnStack<T = unknown> = T & { columnStack: ColumnStackActions }

export const ColumnContainer: FC<ColumnContainerProps> = ({ columnId, columnData }) => {
  const { settingsStore } = useStore()
  const [columnStack, setColumnStack] = useState<ReactNode[]>([])
  const [animationDirection, setAnimationDirection] = useState<-1 | 0 | 1>(0)

  const column = columnData ?? settingsStore.getColumn(columnId!)
  const Component = column ? columnComponents[column.type] : undefined

  const columnStackActions: ColumnStackActions = {
    push(el: ReactNode) {
      setAnimationDirection(0)
      setColumnStack([...columnStack, el])

      requestAnimationFrame(() => {
        setAnimationDirection(1)
      })
    },
    pop() {
      setAnimationDirection(-1)

      requestAnimationFrame(() => {
        setTimeout(() => {
          setColumnStack(columnStack.slice(0, -1))
          setAnimationDirection(1)
        }, 100)
      })
    },
  }

  const Context = createColumnContext<WithColumnStack<typeof column>>()

  return (
    <Context.Provider value={{ ...column, columnStack: columnStackActions }}>
      <div className="column-container">
        <section
          className={classNames('column')}
          data-id={columnId}
          style={{ '--index': 0 } as CSSProperties}
        >
          {Component && <Component />}
        </section>
        {columnStack.map((e, i) => {
          const isLast = i === columnStack.length - 1
          const isBeforeLast = i === columnStack.length - 2
          const isAnimatingBackwards = animationDirection < 0

          return (
            <section
              className="column"
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              style={
                {
                  '--index':
                    isAnimatingBackwards && (isLast || isBeforeLast)
                      ? isLast
                        ? i
                        : i + 1
                      : i + Math.max(animationDirection, 0),
                } as CSSProperties
              }
            >
              {e}
            </section>
          )
        })}
      </div>
    </Context.Provider>
  )
}
