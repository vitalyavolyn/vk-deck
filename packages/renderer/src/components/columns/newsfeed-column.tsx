import { FC, useEffect, useRef, useState } from 'react'
import {
  GroupsGroupFull,
  NewsfeedGetParams,
  NewsfeedGetResponse,
  NewsfeedItemWallpost,
  UsersUserFull,
} from '@vkontakte/api-schema-typescript'
import { classNames } from '@vkontakte/vkjs'
import { FormItem, FormLayout, PanelSpinner, Select } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { OnScroll, ScrollTo } from 'react-cool-virtual'
import { ColumnHeader } from './column-header'
import { useStore } from '@/hooks/use-store'
import { VirtualScrollWall } from '@/components/virtual-scroll-wall'
import { ColumnProps } from '@/components/column-container'
import { ColumnType, INewsfeedColumn } from '@/store/settings-store'
import { columnIcons } from '@/components/navbar'

export interface NewsfeedColumnSettings {
  source: string
}

const Icon = columnIcons[ColumnType.newsfeed]

export const NewsfeedColumn: FC<ColumnProps<INewsfeedColumn>> = observer(
  ({ data }) => {
    const { settings, id } = data

    const { userStore, snackbarStore, settingsStore } = useStore()
    const { t } = useTranslation()

    const [items, setItems] = useState<NewsfeedItemWallpost[]>()
    const [groups, setGroups] = useState<GroupsGroupFull[]>()
    const [profiles, setProfiles] = useState<UsersUserFull[]>()
    const [showSettings, setShowSettings] = useState(false)
    const [canScrollToTop, setCanScrollToTop] = useState(false)
    // const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout | null>(
    //   null,
    // )

    const scrollToRef = useRef<ScrollTo | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const getPosts = async () => {
      // const timeout = refreshTimeout
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      try {
        const response = await userStore.api.call<
          NewsfeedGetResponse,
          NewsfeedGetParams
        >('newsfeed.get', {
          count: 100,
          filters: 'post',
          fields: 'verified,screen_name',
          source_ids: settings.source,
        })

        const { items, groups, profiles } = response
        setGroups(groups)
        setProfiles(profiles)
        setItems(items)
      } catch (error) {
        if (error instanceof Error) {
          snackbarStore.showError(error.toString())
        }
      }

      timerRef.current = setTimeout(getPosts, 10000)
    }

    useEffect(() => {
      getPosts()
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    }, [])

    useEffect(() => {
      if (timerRef.current) {
        getPosts()
        setItems(undefined)
      }
    }, [settings.source])

    const onScroll: OnScroll = ({ scrollOffset }) => {
      setCanScrollToTop(scrollOffset > 0)
    }

    const possibleSources = [
      { label: t`newsfeed.sources.feed`, value: '' },
      { label: t`newsfeed.sources.friends`, value: 'friends' },
      { label: t`newsfeed.sources.groups`, value: 'groups' },
      ...userStore.data.newsfeedLists.map(({ title, id }) => ({
        label: title,
        value: `list${id}`,
      })),
    ]

    const changeSource = (source: string) => {
      /* этому место в сторе? */
      const index = settingsStore.columns.findIndex((e) => e.id === id)
      ;(settingsStore.columns[index] as INewsfeedColumn).settings.source =
        source
    }

    const scrollToTop = () => {
      if (scrollToRef.current) {
        scrollToRef.current({ offset: 0, smooth: true })
      }
    }

    return (
      <>
        <ColumnHeader
          icon={Icon}
          subtitle={`@${userStore.data.user.screen_name}`}
          showSettingsButton
          onSettingsClick={() => {
            setShowSettings(!showSettings)
          }}
          onClick={canScrollToTop ? scrollToTop : undefined}
        >
          {possibleSources.find((e) => e.value === settings.source)!.label}
        </ColumnHeader>
        <div
          className={classNames('column-settings', { hidden: !showSettings })}
        >
          <FormLayout>
            <FormItem top={t`newsfeed.settings.source`}>
              <Select
                // TODO: кастомные иконочки?
                value={settings.source}
                options={possibleSources}
                onChange={(e) => {
                  changeSource(e.target.value)
                }}
              />
            </FormItem>
          </FormLayout>
        </div>
        {items && groups && profiles ? (
          <VirtualScrollWall
            profiles={profiles}
            groups={groups}
            items={items}
            className="column-list-content"
            scrollToRef={scrollToRef}
            onScroll={onScroll}
          />
        ) : (
          <PanelSpinner />
        )}
      </>
    )
  },
)
