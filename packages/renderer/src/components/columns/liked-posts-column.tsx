import { FC, useEffect, useRef, useState } from 'react'
import {
  FaveGetPostsExtendedResponse,
  FaveGetPostsParams,
  GroupsGroupFull,
  UsersUserFull,
  WallWallpostFull,
} from '@vkontakte/api-schema-typescript'
import { PanelSpinner } from '@vkontakte/vkui'
import { useTranslation } from 'react-i18next'
import { ColumnProps } from '@/components/column-container'
import { columnIcons } from '@/components/navbar'
import { VirtualScrollWall } from '@/components/virtual-scroll-wall'
import { useStore } from '@/hooks/use-store'
import { ColumnType, ILikedPostsColumn } from '@/store/settings-store'
import { ColumnHeader } from './common/column-header'
import { ColumnSettings } from './common/column-settings'

const Icon = columnIcons[ColumnType.likedPosts]

export const LikedPostsColumn: FC<ColumnProps<ILikedPostsColumn>> = ({ data }) => {
  const { id, settings } = data

  const { t } = useTranslation()
  const { userStore, snackbarStore, settingsStore } = useStore()

  const [showSettings, setShowSettings] = useState(false)
  const [posts, setPosts] = useState<WallWallpostFull[]>([])
  const [groups, setGroups] = useState<GroupsGroupFull[]>([])
  const [profiles, setProfiles] = useState<UsersUserFull[]>([])

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const offsetRef = useRef(0)

  const getPosts = async (withOffset = false) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    try {
      const { items, groups, profiles } = await userStore.api.call<
        FaveGetPostsExtendedResponse,
        FaveGetPostsParams
      >('fave.getPosts', { extended: 1, count: 100, offset: withOffset ? offsetRef.current : 0 })

      setPosts(items)
      setGroups(groups)
      setProfiles(profiles)
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

  return (
    <>
      <ColumnHeader
        icon={Icon}
        subtitle={`@${userStore.data.user.screen_name}`}
        onSettingsClick={() => {
          setShowSettings(!showSettings)
        }}
        // TODO
        // onClick={canScrollToTop ? scrollToTop : undefined}
      >
        {t`columns.likedPosts`}
      </ColumnHeader>
      <ColumnSettings columnId={id} show={showSettings} imageGridSettings />
      {posts ? (
        <VirtualScrollWall
          items={posts}
          wallPostProps={{ profiles, groups, mediaSize: settings.imageGridSize }}
          className="column-list-content"
        />
      ) : (
        <PanelSpinner />
      )}
    </>
  )
}
