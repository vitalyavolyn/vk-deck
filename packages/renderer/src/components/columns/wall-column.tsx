import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import {
  GroupsGroupFull,
  UsersUserFull,
  WallGetParams,
  WallWallpostFull,
} from '@vkontakte/api-schema-typescript'
import { WallGetExtendedResponse } from '@vkontakte/api-schema-typescript/dist/methods/wall'
import { classNames } from '@vkontakte/vkjs'
import { Checkbox, PanelSpinner } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { OnScroll, ScrollTo } from 'react-cool-virtual'
import { useTranslation } from 'react-i18next'
import { ColumnProps } from '@/components/column-container'
import { columnIcons } from '@/components/navbar'
import { VirtualScrollWall } from '@/components/virtual-scroll-wall'
import { useStore } from '@/hooks/use-store'
import { ColumnType, IWallColumn } from '@/store/settings-store'
import { getOwner } from '@/utils/get-owner'
import { ColumnHeader } from './column-header'

export interface WallColumnSettings {
  ownerId: number
  hidePinnedPost: boolean
  // TODO: filter: suggests,postponed,owner,others
  //  возможно, сделать для suggests/postponed отдельный вид колонок???
  //  который использует этот компонент внутри
}

const Icon = columnIcons[ColumnType.wall]

export const WallColumn: FC<ColumnProps<IWallColumn>> = observer(({ data }) => {
  const { settings, id } = data
  const { ownerId, hidePinnedPost } = settings

  const { userStore, snackbarStore, settingsStore } = useStore()
  const { t } = useTranslation()

  const [posts, setPosts] = useState<WallWallpostFull[]>()
  const [groups, setGroups] = useState<GroupsGroupFull[]>([])
  const [profiles, setProfiles] = useState<UsersUserFull[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [canScrollToTop, setCanScrollToTop] = useState(false)
  const [subtitle, setSubtitle] = useState(ownerId.toString())

  const scrollToRef = useRef<ScrollTo | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const getPosts = async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    try {
      const response = await userStore.api.call<
        WallGetExtendedResponse,
        WallGetParams
      >('wall.get', {
        owner_id: ownerId,
        count: 100,
        extended: 1,
        fields: 'verified,screen_name,photo_50',
      })

      const { items, groups, profiles } = response

      setGroups(groups)
      setProfiles(profiles)
      setPosts(items)

      // TODO: возможно, нет смысла устанавливать это каждый раз
      setSubtitle('@' + getOwner(ownerId, profiles, groups)!.screen_name)
    } catch (error) {
      if (error instanceof Error) {
        snackbarStore.showError(error.toString())
      }
    }

    timerRef.current = setTimeout(getPosts, 20000)
  }

  useEffect(() => {
    getPosts()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const onScroll: OnScroll = ({ scrollOffset }) => {
    setCanScrollToTop(scrollOffset > 0)
  }

  const scrollToTop = () => {
    if (scrollToRef.current) {
      scrollToRef.current({ offset: 0, smooth: true })
    }
  }

  const onChangeHidePinnedPost = (e: ChangeEvent<HTMLInputElement>) => {
    const index = settingsStore.columns.findIndex((e) => e.id === id)
    ;(settingsStore.columns[index] as IWallColumn).settings.hidePinnedPost =
      e.target.checked
  }

  return (
    <>
      <ColumnHeader
        icon={Icon}
        subtitle={subtitle}
        onSettingsClick={() => {
          setShowSettings(!showSettings)
        }}
        onClick={canScrollToTop ? scrollToTop : undefined}
      >
        {t`wall.title`}
      </ColumnHeader>
      <div className={classNames('column-settings', { hidden: !showSettings })}>
        <div style={{ padding: 8 }}>
          <Checkbox
            checked={hidePinnedPost}
            onChange={onChangeHidePinnedPost}
          >{t`wall.settings.hidePinnedPost`}</Checkbox>
        </div>
      </div>
      {posts && groups && profiles ? (
        // TODO: infinite scroll
        <VirtualScrollWall
          profiles={profiles}
          groups={groups}
          items={hidePinnedPost && posts[0]?.is_pinned ? posts.slice(1) : posts}
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
