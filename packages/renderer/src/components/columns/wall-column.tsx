import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { WallGetParams, WallWallpostFull } from '@vkontakte/api-schema-typescript'
import { WallGetExtendedResponse } from '@vkontakte/api-schema-typescript/dist/methods/wall'
import { Checkbox, PanelSpinner } from '@vkontakte/vkui'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { ColumnSettings } from '@/components/columns/common/column-settings'
import { columnIcons } from '@/components/navbar'
import { VirtualScrollWall } from '@/components/virtual-scroll-wall'
import { useColumn } from '@/hooks/use-column'
import { useScrollToTop } from '@/hooks/use-scroll-to-top'
import { useStore } from '@/hooks/use-store'
import { ColumnImageGridSettings, ColumnType, IWallColumn } from '@/store/settings-store'
import { getPostKey } from '@/utils/get-post-key'
import { updatePostInArray } from '@/utils/update-post-in-array'
import { ColumnHeader } from './common/column-header'

export interface WallColumnSettings extends ColumnImageGridSettings {
  ownerId: number
  hidePinnedPost: boolean
  // TODO: filter: suggests,postponed,owner,others
  //  donut???
  //  возможно, сделать для suggests/postponed отдельный вид колонок???
  //  который использует этот компонент внутри
}

const Icon = columnIcons[ColumnType.wall]

export const WallColumn: FC = observer(() => {
  const { settings, id } = useColumn<IWallColumn>()
  const { ownerId, hidePinnedPost } = settings

  const { apiStore, snackbarStore, settingsStore } = useStore()
  const { t } = useTranslation()

  const [posts, setPosts] = useState<WallWallpostFull[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [canLoadMore, setCanLoadMore] = useState(true)
  const [subtitle, setSubtitle] = useState(ownerId.toString())

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const offsetRef = useRef(0)

  const { canScroll, onScroll, triggerScroll, scrollToRef } = useScrollToTop()

  const getPosts = async (withOffset = false) => {
    if (withOffset) setCanLoadMore(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    try {
      const response = await apiStore.api.call<WallGetExtendedResponse, WallGetParams>('wall.get', {
        owner_id: ownerId,
        count: 100,
        offset: withOffset ? offsetRef.current : 0,
        extended: 1,
        fields: 'verified,screen_name,photo_50',
      })

      const { items, groups, profiles } = response

      if (items.length && withOffset) setCanLoadMore(true)

      apiStore.add('profiles', profiles)
      apiStore.add('groups', groups)
      setPosts((old) =>
        withOffset ? _.unionBy(old, items, getPostKey) : _.unionBy(items, old, getPostKey),
      )

      // TODO: возможно, нет смысла устанавливать это каждый раз
      setSubtitle('@' + apiStore.getOwner(ownerId).screen_name)
    } catch (error) {
      if (error instanceof Error) {
        snackbarStore.showError(error.toString())
      }
    }

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

  const onChangeHidePinnedPost = (e: ChangeEvent<HTMLInputElement>) => {
    const column = _.find(settingsStore.columns, { id }) as IWallColumn
    column.settings.hidePinnedPost = e.target.checked
  }

  return (
    <>
      <ColumnHeader
        icon={Icon}
        subtitle={subtitle}
        onSettingsClick={() => {
          setShowSettings(!showSettings)
        }}
        onClick={triggerScroll}
        clickable={canScroll}
      >
        {t`columns.wall`}
      </ColumnHeader>
      <ColumnSettings show={showSettings}>
        <div style={{ padding: '8px 8px 0' }}>
          <Checkbox
            checked={hidePinnedPost}
            onChange={onChangeHidePinnedPost}
          >{t`wall.settings.hidePinnedPost`}</Checkbox>
        </div>
      </ColumnSettings>
      {posts.length ? (
        <VirtualScrollWall
          items={hidePinnedPost && posts[0]?.is_pinned ? posts.slice(1) : posts}
          className="column-list-content"
          loadMore={(e) => {
            if (canLoadMore && offsetRef.current - e.stopIndex < 20) {
              getPosts(true)
            }
          }}
          onScroll={onScroll}
          scrollToRef={scrollToRef}
          wallPostProps={{
            updateData: (post: WallWallpostFull) => {
              setPosts(updatePostInArray(posts, post))
            },
          }}
        />
      ) : (
        <PanelSpinner />
      )}
    </>
  )
})
