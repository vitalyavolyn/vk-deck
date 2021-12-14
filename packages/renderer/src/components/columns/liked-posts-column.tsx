import { FC, useEffect, useRef, useState } from 'react'
import {
  FaveGetPostsExtendedResponse,
  FaveGetPostsParams,
  WallWallpostFull,
} from '@vkontakte/api-schema-typescript'
import { PanelSpinner } from '@vkontakte/vkui'
import { differenceInSeconds } from 'date-fns'
import _ from 'lodash'
import { ScrollTo } from 'react-cool-virtual'
import { useTranslation } from 'react-i18next'
import { columnIcons } from '@/components/navbar'
import { VirtualScrollWall } from '@/components/virtual-scroll-wall'
import { useColumn } from '@/hooks/use-column'
import { useScrollToTop } from '@/hooks/use-scroll-to-top'
import { useStore } from '@/hooks/use-store'
import { ColumnType, ILikedPostsColumn } from '@/store/settings-store'
import { ColumnHeader } from './common/column-header'
import { ColumnSettings } from './common/column-settings'

const Icon = columnIcons[ColumnType.likedPosts]

const getPostKey = (item: WallWallpostFull) => `${item.owner_id}_${item.id}`

export const LikedPostsColumn: FC = () => {
  const { id } = useColumn<ILikedPostsColumn>()
  const { t } = useTranslation()
  const { apiStore, snackbarStore, settingsStore } = useStore()

  const [showSettings, setShowSettings] = useState(false)
  const [posts, setPosts] = useState<WallWallpostFull[]>([])

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const offsetRef = useRef(0)
  const lastUpdate = useRef<Date | false>(false)
  const scrollToRef = useRef<ScrollTo | null>(null)

  const { canScroll, onScroll, triggerScroll } = useScrollToTop(scrollToRef)

  const getPosts = async (withOffset = false) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    lastUpdate.current = false

    try {
      const { items, groups, profiles } = await apiStore.api.call<
        FaveGetPostsExtendedResponse,
        FaveGetPostsParams
      >('fave.getPosts', { extended: 1, count: 100, offset: withOffset ? offsetRef.current : 0 })

      apiStore.add('profiles', profiles)
      apiStore.add('groups', groups)
      setPosts((old) =>
        withOffset ? _.unionBy(old, items, getPostKey) : _.unionBy(items, old, getPostKey),
      )
    } catch (error) {
      if (error instanceof Error) {
        snackbarStore.showError(error.toString())
      }
    }

    lastUpdate.current = new Date()
    timerRef.current = setTimeout(getPosts, 20000)
  }

  useEffect(() => {
    getPosts()
    settingsStore.columnRefreshFns[id] = getPosts

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    offsetRef.current = posts.length
  }, [posts])

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
        {t`columns.likedPosts`}
      </ColumnHeader>
      <ColumnSettings show={showSettings} imageGridSettings />
      {posts ? (
        <VirtualScrollWall
          items={posts}
          className="column-list-content"
          loadMore={(e) => {
            if (
              lastUpdate.current &&
              differenceInSeconds(lastUpdate.current, new Date()) <= -3 &&
              offsetRef.current - e.startIndex < 20
            )
              getPosts(true)
          }}
          onScroll={onScroll}
          scrollToRef={scrollToRef}
        />
      ) : (
        <PanelSpinner />
      )}
    </>
  )
}
