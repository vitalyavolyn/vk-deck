import { FC, SVGProps } from 'react'
import { classNames } from '@vkontakte/vkjs'
import { FormItem, FormLayout } from '@vkontakte/vkui'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useColumn } from '@/hooks/use-column'
import { useStore } from '@/hooks/use-store'
import { ColumnImageGridSettings, ImageGridSize } from '@/store/settings-store'
import { ReactComponent as Hidden } from '@assets/hidden.svg'
import { ReactComponent as Medium } from '@assets/medium.svg'

import './column-image-grid-settings-form.css'
export type HasImageGridSettings = { settings: ColumnImageGridSettings }

const images: [ImageGridSize, FC<SVGProps<SVGElement>>][] = [
  [ImageGridSize.badges, Hidden],
  [ImageGridSize.medium, Medium],
]

export const ColumnImageGridSettingsForm: FC = observer(() => {
  const { id: columnId } = useColumn()
  const { t } = useTranslation()
  const { settingsStore } = useStore()

  const col = _.find(settingsStore.columns, { id: columnId }) as HasImageGridSettings

  const onChange = (e: ImageGridSize) => {
    col.settings.imageGridSize = e
  }

  return (
    <FormLayout>
      <FormItem top={t`columnSettings.mediaGridSize.title`}>
        <div className="media-grid-size-settings">
          {images.map(([type, Component]) => (
            <Component
              key={type}
              className={classNames({ selected: col.settings.imageGridSize === type })}
              onClick={() => onChange(type)}
            />
          ))}
        </div>
      </FormItem>
    </FormLayout>
  )
})
