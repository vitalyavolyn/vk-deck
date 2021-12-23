import { FC, HTMLAttributes } from 'react'
import {
  Icon16Chevron,
  Icon16ChevronLeft,
  Icon20CopyOutline,
  Icon20DeleteOutline,
} from '@vkontakte/icons'
import { classNames } from '@vkontakte/vkjs'
import { IconButton, Link } from '@vkontakte/vkui'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { useColumn } from '@/hooks/use-column'
import { useStore } from '@/hooks/use-store'
import { ColumnImageGridSettingsForm } from './column-image-grid-settings-form'

import './column-settings.css'

interface ColumnSettingsProps extends HTMLAttributes<HTMLDivElement> {
  show: boolean
}

export const ColumnSettings: FC<ColumnSettingsProps> = ({ children, show, ...rest }) => {
  const { id: columnId, settings } = useColumn()
  const { t } = useTranslation()
  const { settingsStore } = useStore()

  const columnIndex = () => _.findIndex(settingsStore.columns, { id: columnId })

  const moveColumn = (direction: -1 | 1) => {
    const from = columnIndex()
    const to = from + direction
    settingsStore.swapColumns(from, to)
  }

  const deleteColumn = () => {
    settingsStore.columns.splice(columnIndex(), 1)
  }

  return (
    <div className={classNames('column-settings', { hidden: !show })} {...rest}>
      {children}
      {'imageGridSize' in settings && <ColumnImageGridSettingsForm />}
      <div className="column-actions">
        <div className="move-buttons">
          <IconButton
            onClick={() => moveColumn(-1)}
            title={t`columnSettings.moveLeft`}
            disabled={columnIndex() === 0}
          >
            <Icon16ChevronLeft />
          </IconButton>
          <IconButton
            onClick={() => moveColumn(1)}
            title={t`columnSettings.moveRight`}
            disabled={columnIndex() === settingsStore.columns.length - 1}
          >
            <Icon16Chevron />
          </IconButton>
        </div>
        <div className="control-buttons">
          <IconButton onClick={() => settingsStore.duplicateColumn(columnId)}>
            <Icon20CopyOutline width={16} height={16} title={t`columnSettings.duplicate`} />
          </IconButton>
          <Link className="delete-link" onClick={deleteColumn}>
            <Icon20DeleteOutline width={16} height={16} /> {t`columnSettings.delete`}
          </Link>
        </div>
      </div>
    </div>
  )
}
