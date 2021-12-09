import { FC, useEffect, useRef, useState } from 'react'
import {
  GroupsGroupFull,
  NewsfeedGetParams,
  NewsfeedGetResponse,
  NewsfeedItemWallpost,
  UsersUserFull,
  WallWallpostFull,
} from '@vkontakte/api-schema-typescript'
import { FormItem, FormLayout, PanelSpinner, Select } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { OnScroll, ScrollTo } from 'react-cool-virtual'
import { useTranslation } from 'react-i18next'
import { ColumnProps } from '@/components/column-container'
import { columnIcons } from '@/components/navbar'
import { VirtualScrollWall } from '@/components/virtual-scroll-wall'
import { useStore } from '@/hooks/use-store'
import { ColumnImageGridSettings, ColumnType, INewsfeedColumn } from '@/store/settings-store'
import { ColumnHeader } from './common/column-header'
import { ColumnSettings } from './common/column-settings'

export interface NewsfeedColumnSettings extends ColumnImageGridSettings {
  source: string
}

const Icon = columnIcons[ColumnType.newsfeed]

const newsfeedPostToWallPost = (item: NewsfeedItemWallpost): WallWallpostFull => {
  // TODO: а geo перевести в другой формат?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { geo, post_id: id, source_id: owner, ...compatibleProps } = item

  return {
    id,
    owner_id: owner,
    from_id: owner,
    ...compatibleProps,
  }
}

export const NewsfeedColumn: FC<ColumnProps<INewsfeedColumn>> = observer(({ data }) => {
  const { settings, id } = data

  const { userStore, snackbarStore, settingsStore } = useStore()
  const { t } = useTranslation()

  const [feedItems, setFeedItems] = useState<NewsfeedItemWallpost[]>()
  const [groups, setGroups] = useState<GroupsGroupFull[]>()
  const [profiles, setProfiles] = useState<UsersUserFull[]>()
  const [showSettings, setShowSettings] = useState(false)
  const [canScrollToTop, setCanScrollToTop] = useState(false)

  const scrollToRef = useRef<ScrollTo | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const getPosts = async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    try {
      const response = await userStore.api.call<NewsfeedGetResponse, NewsfeedGetParams>(
        'newsfeed.get',
        {
          count: 100,
          filters: 'post',
          fields: 'verified,screen_name,photo_50',
          source_ids: settings.source,
          start_time: startTimeRef.current,
        },
      )

      const { items, groups, profiles } = response

      // TODO: will have duplicates EVERY UPDATE
      //  also this is ugly
      setGroups((oldGroups) => [...(oldGroups || []), ...(groups || [])])
      setProfiles((oldProfiles) => [...(oldProfiles || []), ...(profiles || [])])
      setFeedItems((oldItems) => {
        return [
          ...(items?.filter((e) => e.date !== startTimeRef.current) || []),
          ...(oldItems || []),
        ]
      })

      startTimeRef.current = items?.[0]?.date || 0
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
      startTimeRef.current = 0
      getPosts()
      setFeedItems(undefined)
    }
  }, [settings.source])

  // помогает с двойными запросами в режиме разработки
  // выделю это в хук, принимающий реф с таймером
  //
  // TODO: при обновлении внутреннего компонента
  //  лента перестает обновляться
  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    })
  }

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
    ;(settingsStore.columns[index] as INewsfeedColumn).settings.source = source
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
        onSettingsClick={() => {
          setShowSettings(!showSettings)
        }}
        onClick={canScrollToTop ? scrollToTop : undefined}
      >
        {possibleSources.find((e) => e.value === settings.source)!.label}
      </ColumnHeader>
      <ColumnSettings columnId={id} show={showSettings} imageGridSettings>
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
      </ColumnSettings>
      {feedItems && groups && profiles ? (
        // TODO: infinite scroll
        <VirtualScrollWall
          wallPostProps={{
            profiles,
            groups,
            mediaSize: settings.imageGridSize,
          }}
          items={feedItems.map((post) => newsfeedPostToWallPost(post))}
          className="column-list-content"
          scrollToRef={scrollToRef}
          onScroll={onScroll}
        />
      ) : (
        <PanelSpinner />
      )}
    </>
  )
})
