import { FC, useEffect, useRef, useState } from 'react'
import {
  NewsfeedSearchExtendedResponse,
  NewsfeedSearchParams,
  WallWallpostFull,
} from '@vkontakte/api-schema-typescript'
import { Input, PanelSpinner } from '@vkontakte/vkui'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { columnIcons } from '@/components/navbar'
import { VirtualScrollWall } from '@/components/virtual-scroll-wall'
import { useColumn } from '@/hooks/use-column'
import { useScrollToTop } from '@/hooks/use-scroll-to-top'
import { useStore } from '@/hooks/use-store'
import { ColumnImageGridSettings, ColumnType, INewsfeedSearchColumn } from '@/store/settings-store'
import { getPostKey } from '@/utils/get-post-key'
import { updatePostInArray } from '@/utils/update-post-in-array'
import { ColumnHeader } from './common/column-header'
import { ColumnSettings } from './common/column-settings'

export interface NewsfeedSearchColumnSettings extends ColumnImageGridSettings {
  query: string
}

const Icon = columnIcons[ColumnType.newsfeedSearch]

export const NewsfeedSearchColumn: FC = observer(() => {
  const { settings, id } = useColumn<INewsfeedSearchColumn>()

  const { apiStore, snackbarStore, settingsStore } = useStore()

  const [feedItems, setFeedItems] = useState<WallWallpostFull[]>([])
  const [showSettings, setShowSettings] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const [canLoadMore, setCanLoadMore] = useState(true)
  const nextFromRef = useRef('')

  const { canScroll, onScroll, triggerScroll, scrollToRef } = useScrollToTop()

  const getPosts = async (withOffset = false) => {
    if (withOffset) setCanLoadMore(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    try {
      const response = await apiStore.api.call<
        NewsfeedSearchExtendedResponse,
        NewsfeedSearchParams
      >('newsfeed.search', {
        count: 100,
        extended: 1,
        fields: 'verified,screen_name,photo_50',
        q: settings.query,
        start_time: withOffset ? 0 : startTimeRef.current,
        start_from: withOffset ? nextFromRef.current : '',
      })

      const { items, groups, profiles, next_from: nextFrom } = response

      const newItems: WallWallpostFull[] =
        items?.filter((e) => e.date !== startTimeRef.current) || []

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

    timerRef.current = setTimeout(getPosts, 60000)
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
      setFeedItems([])
    }
  }, [settings.query])

  const updateQuery = _.debounce((q: string) => (settings.query = q), 300)

  return (
    <>
      <ColumnHeader
        icon={Icon}
        onSettingsClick={() => {
          setShowSettings(!showSettings)
        }}
        onClick={triggerScroll}
        clickable={canScroll}
      >
        <Input
          className="search-input"
          defaultValue={settings.query}
          onBlur={(e) => {
            if (!e.target.value) {
              e.target.value = settings.query
              return
            }

            updateQuery(e.target.value)
          }}
          onKeyDown={(e) => {
            if (['Escape', 'Enter'].includes(e.key)) {
              e.currentTarget.blur()
            }
          }}
        />
      </ColumnHeader>
      <ColumnSettings show={showSettings} />
      {feedItems.length ? (
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
        // TODO: а если ничего не найдется?
        <PanelSpinner />
      )}
    </>
  )
})
