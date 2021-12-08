import { FC, HTMLAttributes } from 'react'
import {
  Icon16Chevron,
  Icon16ChevronLeft,
  Icon20DeleteOutline,
} from '@vkontakte/icons'
import { classNames } from '@vkontakte/vkjs'
import { IconButton, Link } from '@vkontakte/vkui'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/hooks/use-store'

import './column-settings.css'

interface ColumnSettingsProps extends HTMLAttributes<HTMLDivElement> {
  columnId: string
  show: boolean
}

// TODO: move this and column-header to /components/columns/common/
export const ColumnSettings: FC<ColumnSettingsProps> = ({
  columnId,
  children,
  show,
  ...rest
}) => {
  const { t } = useTranslation()
  const { settingsStore } = useStore()

  const getColumnIndex = () =>
    settingsStore.columns.findIndex(({ id }) => id === columnId)

  const moveColumn = (direction: -1 | 1) => {
    const from = getColumnIndex()
    const to = from + direction
    settingsStore.swapColumns(from, to)
  }

  const deleteColumn = () => {
    settingsStore.columns.splice(getColumnIndex(), 1)
  }

  return (
    <div className={classNames('column-settings', { hidden: !show })} {...rest}>
      {children}
      <div className="column-actions">
        <div className="move-buttons">
          <IconButton onClick={() => moveColumn(-1)}>
            <Icon16ChevronLeft />
          </IconButton>
          <IconButton onClick={() => moveColumn(1)}>
            <Icon16Chevron />
          </IconButton>
        </div>
        <Link className="delete-link" onClick={deleteColumn}>
          <Icon20DeleteOutline /> {t`columnSettings.delete`}
        </Link>
      </div>
    </div>
  )
}
