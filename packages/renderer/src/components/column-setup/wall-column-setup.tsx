import {
  Avatar,
  Button,
  CustomSelect,
  CustomSelectOption,
  FormItem,
  FormLayout,
  Text,
} from '@vkontakte/vkui'
import { FC, useState } from 'react'
import {
  SearchGetHintsParams,
  SearchGetHintsResponse,
} from '@vkontakte/api-schema-typescript'
import { CustomSelectProps } from '@vkontakte/vkui/dist/components/CustomSelect/CustomSelect'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/hooks/use-store'
import { SetupProps } from '@/components/modals/add-column-modal'
import { ColumnType } from '@/store/settings-store'

export const WallColumnSetup: FC<SetupProps> = ({ addColumn }) => {
  const { t } = useTranslation()
  const { userStore } = useStore()
  const { api } = userStore

  const [query, setQuery] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [hints, setHints] = useState<CustomSelectProps['options']>([])
  const [selectedId, setSelectedId] = useState(0)

  console.log(selectedId)

  return (
    <>
      <FormLayout>
        <FormItem>
          <CustomSelect
            placeholder={t`wallSetup.placeholder`}
            searchable
            onChange={(e) => {
              setSelectedId(Number(e.target.value))
            }}
            onInputChange={(e) => {
              const newQuery = (e.target as HTMLInputElement).value
              setQuery(newQuery)
              if (newQuery.length < 3) {
                setIsFetching(false)
                setHints([])
              } else {
                setIsFetching(true)
                // TODO: где обработка ошибок?
                api
                  .call<SearchGetHintsResponse, SearchGetHintsParams>(
                    'search.getHints',
                    {
                      fields: 'photo_50,screen_name',
                      search_global: 1,
                      q: query,
                    },
                  )
                  .then(({ items }) => {
                    setIsFetching(false)
                    setHints(
                      items
                        // метод незадокументированно возвращает приложения 👍
                        .filter((e) => ['profile', 'group'].includes(e.type))
                        .map((hint) => ({
                          label:
                            (hint.profile
                              ? `${hint.profile.first_name} ${hint.profile.last_name}`
                              : hint.group?.name) || '', // TODO: тупо
                          value: hint.profile?.id || -Number(hint.group?.id),
                          avatar:
                            // TODO
                            // @ts-ignore: UsersUserMin не знает про fields
                            hint.profile?.photo_50 || hint.group?.photo_50,
                          description:
                            // @ts-ignore: UsersUserMin не знает про fields
                            hint.profile?.screen_name ||
                            hint.group?.screen_name,
                        })),
                    )
                  })
              }
            }}
            onClose={() => {
              setIsFetching(false)
              setQuery('')
            }}
            filterFn={false}
            options={hints}
            fetching={isFetching}
            renderOption={({ option, ...restProps }) => (
              <CustomSelectOption
                {...restProps}
                key={option.value}
                before={<Avatar size={24} src={option.avatar} />}
                description={'@' + option.description}
              />
            )}
            emptyText={t`wallSetup.emptyText`}
            renderDropdown={
              isFetching
                ? ({ defaultDropdownContent }) => {
                    return query.length < 3 ? (
                      <Text
                        style={{ padding: 12, color: 'var(--text_secondary)' }}
                        weight="regular"
                      >
                        {t`wallSetup.insufficientQuery`}
                      </Text>
                    ) : (
                      defaultDropdownContent
                    )
                  }
                : undefined
            }
          />
        </FormItem>
      </FormLayout>
      <Button
        disabled={!selectedId}
        onClick={() => {
          addColumn(ColumnType.wall, {
            ownerId: selectedId,
          })
        }}
      >
        {t`addColumn.title`}
      </Button>
    </>
  )
}
