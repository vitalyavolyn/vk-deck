import { ChangeEvent, FC } from 'react'
import { Button, Checkbox, FormItem, FormLayout, Select } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { ModalProps } from '@/components/modal-container'
import { useStore } from '@/hooks/use-store'
import { ColorScheme, ColumnSize } from '@/store/settings-store'
import { ModalHeader } from './modal-header'

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

  const onBlurAdsChange = (e: ChangeEvent<HTMLInputElement>) => {
    settingsStore.blurAds = e.target.checked
  }

  return (
    <div className="modal settings-modal">
      <ModalHeader>{t`settings.title`}</ModalHeader>
      <FormLayout>
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
              {
                value: ColumnSize.narrow,
                label: t`settings.columnSize.narrow`,
              },
              {
                value: ColumnSize.medium,
                label: t`settings.columnSize.medium`,
              },
              { value: ColumnSize.wide, label: t`settings.columnSize.wide` },
            ]}
          />
        </FormItem>

        <Checkbox
          checked={settingsStore.blurAds}
          onChange={onBlurAdsChange}
        >{t`settings.blurAds`}</Checkbox>
      </FormLayout>

      <div className="logout-button-container">
        <Button stretched mode="secondary" size="m" onClick={logout}>
          {t`settings.logout`}
        </Button>
      </div>
    </div>
  )
})
