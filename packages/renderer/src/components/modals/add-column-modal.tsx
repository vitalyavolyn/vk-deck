import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { classNames } from '@vkontakte/vkjs'
import { Tappable } from '@vkontakte/vkui'
import { v4 as uuidv4 } from 'uuid'
import { ModalHeader } from './modal-header'
import { ModalProps } from '@/components/modal-container'
import { ColumnType } from '@/store/settings-store'
import { useStore } from '@/hooks/use-store'

import './add-column-modal.css'
import { columnIcons } from '@/components/navbar'
import { WallColumnSettings } from '@/components/columns/wall-column'
import { WallColumnSetup } from '@/components/column-setup/wall-column-setup'

// [
//   тип колонки,
//   требует ли настройки
// ]
const columns: [ColumnType, boolean][] = [
  [ColumnType.newsfeed, false],
  [ColumnType.test, false],
  [ColumnType.wall, true],
]

export interface AddColumn {
  (type: ColumnType.newsfeed): void
  (type: ColumnType.wall, settings: WallColumnSettings): void
  (type: ColumnType): void
}

export interface SetupProps {
  addColumn: AddColumn
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
            source: '',
          },
        })

      case ColumnType.test:
        return settingsStore.columns.push({
          id: uuidv4(),
          type,
        })

      case ColumnType.wall:
        return settingsStore.columns.push({
          id: uuidv4(),
          type,
          settings,
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
        <div className="column-type-selector">
          {columns.map(([type, needsConfiguration]) => {
            const Icon = columnIcons[type]
            return (
              <Tappable
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
                <div className="icon-wrapper">
                  <Icon />
                </div>
                <div className="column-title">{t(`columns.${type}`)}</div>
              </Tappable>
            )
          })}
        </div>
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
