import { FC, useState } from 'react'
import { Button, FormItem, FormLayout, Input } from '@vkontakte/vkui'
import { useTranslation } from 'react-i18next'
import { SetupProps } from '@/components/side-panels/add-column-side-panel'
import { ColumnType } from '@/store/settings-store'

export const NewsfeedSearchColumnSetup: FC<SetupProps> = ({ addColumn }) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')

  return (
    <>
      <FormLayout>
        <FormItem>
          <Input
            placeholder={t`newsfeedSearchSetup.placeholder`}
            onChange={(e) => {
              setQuery(e.target.value)
            }}
          />
        </FormItem>
      </FormLayout>
      <Button
        disabled={!query}
        onClick={() => {
          addColumn(ColumnType.newsfeedSearch, {
            query,
          })
        }}
      >
        {t`addColumn.title`}
      </Button>
    </>
  )
}
