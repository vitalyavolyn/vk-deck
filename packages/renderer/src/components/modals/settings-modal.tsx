import { ChangeEvent, FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, FormItem, Select } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { ModalProps } from '../modal-container'
import { ModalHeader } from './modal-header'
import { useStore } from '@/hooks/use-store'
import { ColorScheme, ColumnSize } from '@/store/settings-store'

import './settings-modal.css'

const logout = () => {
  localStorage.clear()
  location.reload()
}

export const SettingsModal: FC<ModalProps> = observer(() => {
  const { t } = useTranslation()
  const { settingsStore } = useStore()

  const onColorThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    settingsStore.colorScheme = e.target.value as ColorScheme
  }

  const onColumnSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    settingsStore.columnSize = Number(e.target.value) as ColumnSize
  }

  return (
    <div className="modal settings-modal">
      <ModalHeader>{t`settings.title`}</ModalHeader>
      <FormItem top={t`settings.colorScheme.title`}>
        <Select
          onChange={onColorThemeChange}
          value={settingsStore.colorScheme}
          options={[
            { value: 'auto', label: t`settings.colorScheme.auto` },
            { value: 'light', label: t`settings.colorScheme.light` },
            { value: 'dark', label: t`settings.colorScheme.dark` },
          ]}
        />
      </FormItem>

      <FormItem top={t`settings.columnSize.title`}>
        <Select
          onChange={onColumnSizeChange}
          value={settingsStore.columnSize}
          options={[
            { value: ColumnSize.narrow, label: t`settings.columnSize.narrow` },
            { value: ColumnSize.medium, label: t`settings.columnSize.medium` },
            { value: ColumnSize.wide, label: t`settings.columnSize.wide` },
          ]}
        />
      </FormItem>

      <div className="logout-button-container">
        <Button stretched mode="secondary" size="m" onClick={logout}>
          {t`settings.logout`}
        </Button>
      </div>
    </div>
  )
})
