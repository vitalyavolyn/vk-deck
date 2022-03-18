import { FC, useEffect, useState } from 'react'
import { classNames } from '@vkontakte/vkjs'
import { Avatar, List, RichCell } from '@vkontakte/vkui'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import { NewsfeedSearchColumnSetup } from '@/components/column-setup/newsfeed-search-column-setup'
import { WallColumnSetup } from '@/components/column-setup/wall-column-setup'
import { NewsfeedSearchColumnSettings } from '@/components/columns/newsfeed-search-column'
import { WallColumnSettings } from '@/components/columns/wall-column'
import { columnIcons } from '@/components/navbar'
import { SidePanelProps } from '@/components/side-panel-container'
import { useStore } from '@/hooks/use-store'
import { ColumnImageGridSettings, ColumnType, ImageGridSize } from '@/store/settings-store'
import { SidePanelHeader } from './side-panel-header'

import './add-column-side-panel.css'

// [
//   тип колонки,
//   требует ли настройки,
//   доп. подпись про возможности колонки (имя в локали)
// ]
const columns: [ColumnType, boolean, string?][] = [
  [ColumnType.newsfeed, false, 'addColumn.caption.newsfeed'],
  [ColumnType.wall, true],
  [ColumnType.likedPosts, false],
  [ColumnType.bookmarks, false, 'addColumn.caption.bookmarks'],
  [ColumnType.newsfeedSearch, true],
  [ColumnType.notifications, false],

  // оставлять в конце
  [ColumnType.rick, false],
]

export type WithoutImageGridSettings<T extends ColumnImageGridSettings> = Omit<T, 'imageGridSize'>

export interface AddColumn {
  (type: ColumnType.wall, settings: WithoutImageGridSettings<WallColumnSettings>): void
  (
    type: ColumnType.newsfeedSearch,
    settings: WithoutImageGridSettings<NewsfeedSearchColumnSettings>,
  ): void
  (type: ColumnType): void
}

export interface SetupProps {
  addColumn: AddColumn
}

export const defaultImageGridSettings: ColumnImageGridSettings = {
  imageGridSize: ImageGridSize.medium,
}

export const AddColumnSidePanel: FC<SidePanelProps> = ({ closeSidePanel }) => {
  const { t } = useTranslation()
  const { settingsStore } = useStore()
  const [selectedColumn, setSelectedColumn] = useState<ColumnType | null>(null)
  const [animatingColumn, setAnimatingColumn] = useState<ColumnType | null>(null)

  useEffect(() => {
    if (!selectedColumn && animatingColumn) {
      setTimeout(() => setAnimatingColumn(null), 200)
    }
  }, [selectedColumn])

  const addColumn: AddColumn = (type: ColumnType, settings?: any) => {
    closeSidePanel()

    switch (type) {
      case ColumnType.newsfeed:
        return settingsStore.columns.push({
          id: uuidv4(),
          type,
          settings: {
            ...defaultImageGridSettings,
            source: '',
          },
        })

      case ColumnType.notifications:
      case ColumnType.rick:
        return settingsStore.columns.push({
          id: uuidv4(),
          type,
        })

      case ColumnType.newsfeedSearch:
      case ColumnType.wall:
        return settingsStore.columns.push({
          id: uuidv4(),
          type,
          settings: {
            ...defaultImageGridSettings,
            ...settings,
          },
        })

      case ColumnType.likedPosts:
      case ColumnType.bookmarks:
        return settingsStore.columns.push({
          id: uuidv4(),
          type,
          settings: defaultImageGridSettings,
        })
    }
  }

  return (
    <>
      <div
        className={classNames('side-panel add-column-side-panel', {
          'second-screen-active': !!selectedColumn,
        })}
      >
        <SidePanelHeader>{t`addColumn.title`}</SidePanelHeader>
        <List className="column-type-selector">
          {columns.map(([type, needsConfiguration, caption]) => {
            const Icon = columnIcons[type]
            return (
              <RichCell
                before={
                  <Avatar>
                    <Icon fill="var(--text_primary)" width={24} height={24} />
                  </Avatar>
                }
                data-column={type}
                caption={caption ? t(caption) : undefined}
                multiline
                className="column-type"
                onClick={() => {
                  if (needsConfiguration) {
                    setAnimatingColumn(type)
                    setTimeout(() => setSelectedColumn(type), 0)
                  } else {
                    addColumn(type)
                    closeSidePanel()
                  }
                }}
                key={type}
              >
                <div className="column-title">{t(`columns.${type}`)}</div>
              </RichCell>
            )
          })}
        </List>
      </div>
      {(selectedColumn === 'wall' || animatingColumn === 'wall') && (
        <div
          className={classNames('side-panel add-column-side-panel', {
            'second-screen-active': !!selectedColumn,
          })}
        >
          <SidePanelHeader
            onBackButtonClick={() => setSelectedColumn(null)}
          >{t`columns.wall`}</SidePanelHeader>
          <WallColumnSetup addColumn={addColumn} />
        </div>
      )}
      {(selectedColumn === 'newsfeedSearch' || animatingColumn === 'newsfeedSearch') && (
        <div
          className={classNames('side-panel add-column-side-panel', {
            'second-screen-active': !!selectedColumn,
          })}
        >
          <SidePanelHeader
            onBackButtonClick={() => setSelectedColumn(null)}
          >{t`columns.newsfeedSearch`}</SidePanelHeader>
          <NewsfeedSearchColumnSetup addColumn={addColumn} />
        </div>
      )}
    </>
  )
}
