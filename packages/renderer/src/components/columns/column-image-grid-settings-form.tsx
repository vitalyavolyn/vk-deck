import { ChangeEvent, FC } from 'react'
import { FormItem, FormLayout, Select } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/hooks/use-store'
import { ColumnImageGridSettings, ImageGridSize } from '@/store/settings-store'

interface ColumnImageGridSettingsFormProps {
  columnId: string
}

type HasImageGridSettings = { settings: ColumnImageGridSettings }

export const ColumnImageGridSettingsForm: FC<ColumnImageGridSettingsFormProps> =
  observer(({ columnId }) => {
    const { t } = useTranslation()
    const { settingsStore } = useStore()

    const col = settingsStore.columns.find(
      (e) => e.id === columnId,
    ) as HasImageGridSettings

    const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
      col.settings.imageGridSize = e.target.value as ImageGridSize
    }

    return (
      <FormLayout>
        <FormItem top={t`columnSettings.mediaGridSize.title`}>
          <Select
            onChange={onChange}
            value={col.settings.imageGridSize}
            options={[
              {
                label: t`columnSettings.mediaGridSize.badges`,
                value: ImageGridSize.badges,
              },
              {
                label: t`columnSettings.mediaGridSize.medium`,
                value: ImageGridSize.medium,
              },
            ]}
          />
        </FormItem>
      </FormLayout>
    )
  })
