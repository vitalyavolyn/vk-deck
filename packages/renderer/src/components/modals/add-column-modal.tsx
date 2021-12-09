import { FC, useEffect, useState } from 'react'
import { classNames } from '@vkontakte/vkjs'
import { Avatar, List, RichCell } from '@vkontakte/vkui'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import { WallColumnSetup } from '@/components/column-setup/wall-column-setup'
import { WallColumnSettings } from '@/components/columns/wall-column'
import { ModalProps } from '@/components/modal-container'
import { columnIcons } from '@/components/navbar'
import { useStore } from '@/hooks/use-store'
import {
  ColumnImageGridSettings,
  ColumnType,
  ImageGridSize,
} from '@/store/settings-store'
import { ModalHeader } from './modal-header'

import './add-column-modal.css'

// [
//   тип колонки,
//   требует ли настройки,
//   доп. подпись про возможности колонки (имя в локали)
// ]
const columns: [ColumnType, boolean, string?][] = [
  [ColumnType.newsfeed, false, 'addColumn.caption.newsfeed'],
  [ColumnType.wall, true],

  // оставлять в конце
  [ColumnType.rick, false],
]

export type WithoutImageGridSettings<T extends ColumnImageGridSettings> = Omit<
  T,
  'imageGridSize'
>

export interface AddColumn {
  (type: ColumnType.newsfeed): void
  (
    type: ColumnType.wall,
    settings: WithoutImageGridSettings<WallColumnSettings>,
  ): void
  (type: ColumnType): void
}

export interface SetupProps {
  addColumn: AddColumn
}

const defaultImageGridSettings: ColumnImageGridSettings = {
  imageGridSize: ImageGridSize.medium,
}

export const AddColumnModal: FC<ModalProps> = ({ closeModal }) => {
  const { t } = useTranslation()
  const { settingsStore } = useStore()
  const [selectedColumn, setSelectedColumn] = useState<ColumnType | null>(null)
  const [animatingColumn, setAnimatingColumn] = useState<ColumnType | null>(
    null,
  )

  useEffect(() => {
    if (!selectedColumn && animatingColumn) {
      setTimeout(() => setAnimatingColumn(null), 200)
    }
  }, [selectedColumn])

  const addColumn: AddColumn = (type: ColumnType, settings?: any) => {
    closeModal()

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

      case ColumnType.rick:
        return settingsStore.columns.push({
          id: uuidv4(),
          type,
        })

      case ColumnType.wall:
        return settingsStore.columns.push({
          id: uuidv4(),
          type,
          settings: {
            ...defaultImageGridSettings,
            ...settings,
          },
        })
    }
  }

  return (
    <>
      <div
        className={classNames('modal add-column-modal', {
          'second-screen-active': !!selectedColumn,
        })}
      >
        <ModalHeader>{t`addColumn.title`}</ModalHeader>
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
                    closeModal()
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
          className={classNames('modal add-column-modal', {
            'second-screen-active': !!selectedColumn,
          })}
        >
          <ModalHeader
            onBackButtonClick={() => setSelectedColumn(null)}
          >{t`columns.wall`}</ModalHeader>
          <WallColumnSetup addColumn={addColumn} />
        </div>
      )}
    </>
  )
}
