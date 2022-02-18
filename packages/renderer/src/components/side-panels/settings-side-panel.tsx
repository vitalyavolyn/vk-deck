import { FC } from 'react'
import {
  Button,
  Checkbox,
  FormItem,
  FormLayout,
  SegmentedControl,
  SegmentedControlValue,
} from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { SidePanelProps } from '@/components/side-panel-container'
import { useStore } from '@/hooks/use-store'
import { ColorScheme, ColumnSize, Settings } from '@/store/settings-store'
import { SidePanelHeader } from './side-panel-header'

import './settings-side-panel.css'

const logout = () => {
  localStorage.clear()
  location.reload()
}

export const SettingsSidePanel: FC<SidePanelProps> = observer(() => {
  const { t } = useTranslation()
  const { settingsStore } = useStore()

  const onColorThemeChange = (e: SegmentedControlValue) => {
    settingsStore.colorScheme = e as ColorScheme
  }

  const onColumnSizeChange = (e: SegmentedControlValue) => {
    settingsStore.columnSize = e as ColumnSize
  }

  const toggleBooleanSetting = (name: keyof Settings, value: boolean) => {
    settingsStore.load({ [name]: value })
  }

  return (
    <div className="side-panel settings-side-panel">
      <SidePanelHeader>{t`settings.title`}</SidePanelHeader>
      <FormLayout>
        <FormItem top={t`settings.colorScheme.title`}>
          <SegmentedControl
            onChange={onColorThemeChange}
            value={settingsStore.colorScheme}
            options={[
              { value: 'auto', label: t`settings.colorScheme.auto` as string },
              { value: 'light', label: t`settings.colorScheme.light` as string },
              { value: 'dark', label: t`settings.colorScheme.dark` as string },
            ]}
          />
        </FormItem>

        <FormItem top={t`settings.columnSize.title`}>
          <SegmentedControl
            onChange={onColumnSizeChange}
            value={settingsStore.columnSize}
            options={[
              {
                value: ColumnSize.narrow,
                label: t`settings.columnSize.narrow` as string,
              },
              {
                value: ColumnSize.medium,
                label: t`settings.columnSize.medium` as string,
              },
              { value: ColumnSize.wide, label: t`settings.columnSize.wide` as string },
            ]}
          />
        </FormItem>

        <Checkbox
          checked={settingsStore.blurAds}
          onChange={(e) => {
            toggleBooleanSetting('blurAds', e.target.checked)
          }}
        >{t`settings.blurAds`}</Checkbox>

        <Checkbox
          checked={settingsStore.mediaQuickPreview}
          onChange={(e) => {
            toggleBooleanSetting('mediaQuickPreview', e.target.checked)
          }}
        >{t`settings.mediaQuickPreview`}</Checkbox>
      </FormLayout>

      <div className="logout-button-container">
        <Button stretched mode="secondary" size="m" onClick={logout}>
          {t`settings.logout`}
        </Button>
      </div>
    </div>
  )
})
