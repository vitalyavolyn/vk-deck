import { FC, useEffect, useRef, useState } from 'react'
import {
  FaveGetExtendedResponse,
  FaveGetParams,
  WallWallpostFull,
} from '@vkontakte/api-schema-typescript'
import { FormItem, FormLayout, PanelSpinner, Select } from '@vkontakte/vkui'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { ColumnSettings } from '@/components/columns/common/column-settings'
import { columnIcons } from '@/components/navbar'
import { VirtualScrollWall } from '@/components/virtual-scroll-wall'
import { useColumn } from '@/hooks/use-column'
import { useScrollToTop } from '@/hooks/use-scroll-to-top'
import { useStore } from '@/hooks/use-store'
import { ColumnImageGridSettings, ColumnType, IBookmarksColumn } from '@/store/settings-store'
import { getPostKey } from '@/utils/get-post-key'
import { updatePostInArray } from '@/utils/update-post-in-array'
import { ColumnHeader } from './common/column-header'

export interface BookmarksColumnSettings extends ColumnImageGridSettings {
  tagId?: number
}

const Icon = columnIcons[ColumnType.bookmarks]

export const BookmarksColumn: FC = observer(() => {
  const { settings, id } = useColumn<IBookmarksColumn>()

  const { apiStore, snackbarStore, settingsStore } = useStore()
  const { t } = useTranslation()

  const [posts, setPosts] = useState<WallWallpostFull[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [canLoadMore, setCanLoadMore] = useState(true)

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
      const response = await apiStore.api.call<FaveGetExtendedResponse, FaveGetParams>('fave.get', {
        count: 100,
        // TODO: поддерживать и другое?
        item_type: 'post',
        offset: withOffset ? offsetRef.current : 0,
        extended: 1,
        fields: 'verified,screen_name,photo_50',
        tag_id: settings.tagId,
      })

      const { items, groups, profiles } = response

      if (items!.length && withOffset) setCanLoadMore(true)

      apiStore.add('profiles', profiles)
      apiStore.add('groups', groups)

      const posts = items!.map((e) => e.post) as WallWallpostFull[]

      setPosts((old) =>
        withOffset ? _.unionBy(old, posts, getPostKey) : _.unionBy(posts, old, getPostKey),
      )
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
    if (timerRef.current) {
      getPosts()
      setPosts([])
    }
  }, [settings.tagId])

  useEffect(() => {
    offsetRef.current = posts.length
  }, [posts])

  const changeTag = (tag?: number) => {
    const column = _.find(settingsStore.columns, { id }) as IBookmarksColumn
    column.settings.tagId = tag
  }

  // TODO: попробовать удалить выбранный тег
  const tag = _.find(apiStore.initData.faveTags, { id: settings.tagId })

  return (
    <>
      <ColumnHeader
        icon={Icon}
        subtitle={settings.tagId ? tag?.name ?? '???' : `@${apiStore.initData.user.screen_name}`}
        onSettingsClick={() => {
          setShowSettings(!showSettings)
        }}
        onClick={triggerScroll}
        clickable={canScroll}
      >
        {t`columns.bookmarks`}
      </ColumnHeader>
      <ColumnSettings show={showSettings} imageGridSettings>
        <FormLayout>
          <FormItem top={t`bookmarks.settings.tag`}>
            <Select
              value={settings.tagId ?? 'unset'}
              options={[
                {
                  label: t`bookmarks.settings.clearTag`,
                  value: 'unset',
                },
                ...apiStore.initData.faveTags.map((e) => ({
                  label: e.name,
                  value: e.id,
                })),
              ]}
              onChange={(e) => {
                changeTag(e.target.value === 'unset' ? undefined : Number(e.target.value))
              }}
            />
          </FormItem>
        </FormLayout>
      </ColumnSettings>
      {posts.length ? (
        <VirtualScrollWall
          items={posts}
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
