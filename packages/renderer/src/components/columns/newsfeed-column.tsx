import { FC, useEffect, useRef, useState } from 'react'
import {
  NewsfeedGetParams,
  NewsfeedGetResponse,
  NewsfeedItemWallpost,
  WallWallpostFull,
} from '@vkontakte/api-schema-typescript'
import { FormItem, FormLayout, PanelSpinner, Select } from '@vkontakte/vkui'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { columnIcons } from '@/components/navbar'
import { VirtualScrollWall } from '@/components/virtual-scroll-wall'
import { useColumn } from '@/hooks/use-column'
import { useScrollToTop } from '@/hooks/use-scroll-to-top'
import { useStore } from '@/hooks/use-store'
import { ColumnImageGridSettings, ColumnType, INewsfeedColumn } from '@/store/settings-store'
import { getPostKey } from '@/utils/get-post-key'
import { updatePostInArray } from '@/utils/update-post-in-array'
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

export const NewsfeedColumn: FC = observer(() => {
  const { settings, id } = useColumn<INewsfeedColumn>()
  const { apiStore, snackbarStore, settingsStore } = useStore()
  const { t } = useTranslation()

  const [feedItems, setFeedItems] = useState<WallWallpostFull[]>()
  const [showSettings, setShowSettings] = useState(false)

  // TODO: setTimeout здесь якобы возвращает этот тип, а не число. неприятно.
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const [canLoadMore, setCanLoadMore] = useState(true)
  const nextFromRef = useRef('')

  const { canScroll, onScroll, triggerScroll, scrollToRef } = useScrollToTop()

  /**
   * @see SettingsStore.wallColumns
   */
  const triggerWallColumns = (newItems: WallWallpostFull[]) => {
    for (const item of newItems) {
      const columnId = settingsStore.wallColumns[item.owner_id!]

      if (columnId) {
        settingsStore.refreshColumn(columnId)
      }
    }
  }

  const getPosts = async (withOffset = false) => {
    if (withOffset) setCanLoadMore(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    try {
      const response = await apiStore.api.call<NewsfeedGetResponse, NewsfeedGetParams>(
        'newsfeed.get',
        {
          count: 100,
          filters: 'post',
          fields: 'verified,screen_name,photo_50,sex',
          source_ids: settings.source,
          start_time: withOffset ? 0 : startTimeRef.current,
          start_from: withOffset ? nextFromRef.current : '',
        },
      )

      const { items, groups, profiles, next_from: nextFrom } = response

      const newItems: WallWallpostFull[] = (
        items?.filter((e) => e.date !== startTimeRef.current) || []
      ).map((post) => newsfeedPostToWallPost(post as NewsfeedItemWallpost))

      // пропускаем при первом обновлении
      if (startTimeRef.current) triggerWallColumns(newItems)

      apiStore.add('profiles', profiles)
      apiStore.add('groups', groups)

      setFeedItems((old) =>
        withOffset ? _.unionBy(old, newItems, getPostKey) : _.unionBy(newItems, old, getPostKey),
      )

      setCanLoadMore(true)

      startTimeRef.current = items?.[0]?.date || 0
      nextFromRef.current = nextFrom!
    } catch (error) {
      if (error instanceof Error) {
        snackbarStore.showError(error.toString())
      }
    }

    timerRef.current = setTimeout(getPosts, 10000)
  }

  useEffect(() => {
    getPosts()
    settingsStore.columnRefreshFns[id] = getPosts

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

  const possibleSources = [
    { label: t`newsfeed.sources.feed`, value: '' },
    { label: t`newsfeed.sources.friends`, value: 'friends' },
    { label: t`newsfeed.sources.groups`, value: 'groups' },
    ...apiStore.initData.newsfeedLists.map(({ title, id }) => ({
      label: title,
      value: `list${id}`,
    })),
  ]

  const changeSource = (source: string) => {
    /* этому место в сторе? */
    const column = _.find(settingsStore.columns, { id }) as INewsfeedColumn
    column.settings.source = source
  }

  return (
    <>
      <ColumnHeader
        icon={Icon}
        subtitle={`@${apiStore.initData.user.screen_name}`}
        onSettingsClick={() => {
          setShowSettings(!showSettings)
        }}
        onClick={triggerScroll}
        clickable={canScroll}
      >
        {_.find(possibleSources, { value: settings.source })?.label ?? t`newsfeed.unknownList`}
      </ColumnHeader>
      <ColumnSettings show={showSettings} imageGridSettings>
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
      {feedItems ? (
        <VirtualScrollWall
          items={feedItems}
          className="column-list-content"
          loadMore={(e) => {
            if (canLoadMore && feedItems.length - e.stopIndex < 20) {
              getPosts(true)
            }
          }}
          onScroll={onScroll}
          scrollToRef={scrollToRef}
          wallPostProps={{
            updateData: (post: WallWallpostFull) => {
              setFeedItems(updatePostInArray(feedItems, post))
            },
          }}
        />
      ) : (
        <PanelSpinner />
      )}
    </>
  )
})
