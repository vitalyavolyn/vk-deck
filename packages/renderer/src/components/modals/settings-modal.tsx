import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { FormItem, Select } from '@vkontakte/vkui'
import { ModalProps } from '../modal-container'
import { ModalHeader } from './modal-header'

import './settings-modal.css'

export const SettingsModal: FC<ModalProps> = () => {
  const { t } = useTranslation()

  return (
    <div className="modal settings-modal">
      <ModalHeader>{t`settings.title`}</ModalHeader>
      <FormItem top="Тема оформления">
        <Select
          // onChange={this.onChange}
          value="0"
          name="purpose"
          options={[
            { value: '0', label: 'Системная' },
            { value: '1', label: 'Светлая' },
            { value: '2', label: 'Темная' },
          ]}
        />
      </FormItem>
    </div>
  )
}
