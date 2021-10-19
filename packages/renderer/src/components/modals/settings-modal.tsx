import { ChangeEvent, FC } from 'react'
import { useTranslation } from 'react-i18next'
import { FormItem, Select } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { ModalProps } from '../modal-container'
import { ModalHeader } from './modal-header'
import { useStore } from '@/hooks/use-store'
import { ColorScheme } from '@/store/settings-store'

import './settings-modal.css'

export const SettingsModal: FC<ModalProps> = observer(() => {
  const { t } = useTranslation()
  const { settingsStore } = useStore()

  const onColorThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    settingsStore.colorScheme = e.target.value as ColorScheme
  }

  return (
    <div className="modal settings-modal">
      <ModalHeader>{t`settings.title`}</ModalHeader>
      <FormItem top="Тема оформления">
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
    </div>
  )
})
