import { FC, useEffect, useRef, useState } from 'react'
import {
  NotificationsGetParams,
  NotificationsGetResponse,
  NotificationsNotification,
} from '@vkontakte/api-schema-typescript'
import { PanelSpinner } from '@vkontakte/vkui'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import useVirtual from 'react-cool-virtual'
import { useTranslation } from 'react-i18next'
import { columnIcons } from '@/components/navbar'
import { Notification } from '@/components/notification'
import { useColumn } from '@/hooks/use-column'
import { useScrollToTop } from '@/hooks/use-scroll-to-top'
import { useStore } from '@/hooks/use-store'
import { ColumnImageGridSettings, ColumnType, INotificationsColumn } from '@/store/settings-store'
import { ColumnHeader } from './common/column-header'

export interface NotificationsColumnSettings extends ColumnImageGridSettings {
  source: string
}

const Icon = columnIcons[ColumnType.notifications]

export const NotificationsColumn: FC = observer(() => {
  const { id } = useColumn<INotificationsColumn>()
  const { apiStore, snackbarStore, settingsStore } = useStore()
  const { t } = useTranslation()

  const [items, setItems] = useState<NotificationsNotification[]>([])
  // const [showSettings, setShowSettings] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const [, /* canLoadMore */ setCanLoadMore] = useState(true)
  const nextFromRef = useRef('')

  const { canScroll, onScroll, triggerScroll /* scrollToRef */ } = useScrollToTop()

  const update = async (withOffset = false) => {
    if (withOffset) setCanLoadMore(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    try {
      const response = await apiStore.api.call<NotificationsGetResponse, NotificationsGetParams>(
        'notifications.get',
        {
          count: 100,
          // fields: 'verified,screen_name,photo_50,sex',
          start_time: withOffset ? 0 : startTimeRef.current,
          start_from: withOffset ? nextFromRef.current : '',
        },
      )

      const { items: newItems = [], groups, profiles, next_from: nextFrom } = response

      apiStore.add('profiles', profiles)
      apiStore.add('groups', groups)

      const combinedItems = _.uniqWith(
        withOffset ? [...items, ...newItems] : [...newItems, ...items],
        _.isEqual,
      )

      if (combinedItems.length !== items?.length) {
        setItems(combinedItems)
      }

      setCanLoadMore(true)

      startTimeRef.current = items?.[0]?.date || 0
      nextFromRef.current = nextFrom!
    } catch (error) {
      if (error instanceof Error) {
        snackbarStore.showError(error.toString())
      }
    }

    timerRef.current = setTimeout(update, 10000)
  }

  useEffect(() => {
    update()
    settingsStore.columnRefreshFns[id] = update

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  /* я забыл зачем это */
  /* useEffect(() => {
    if (timerRef.current) {
      startTimeRef.current = 0
      update()
      setItems(undefined)
    }
  }, []) */

  const {
    outerRef,
    innerRef,
    items: scrollItems,
    // scrollTo,
  } = useVirtual<HTMLDivElement>({
    itemCount: items.length,
    itemSize: 50,
    loadMoreCount: 20,
    onScroll,
    // loadMore,
  })

  return (
    <>
      <ColumnHeader
        icon={Icon}
        subtitle={`@${apiStore.initData.user.screen_name}`}
        // onSettingsClick={() => {
        //   setShowSettings(!showSettings)
        // }}
        onClick={triggerScroll}
        clickable={canScroll}
      >
        {t`columns.notifications`}
      </ColumnHeader>
      {items.length ? (
        <div className="column-list-content" ref={outerRef}>
          <div ref={innerRef}>
            {scrollItems.map(({ index, measureRef }) => {
              const data = items[index]

              return data ? (
                <Notification key={`${index}`} measureRef={measureRef} data={data} />
              ) : undefined
            })}
          </div>
        </div>
      ) : (
        <PanelSpinner />
      )}
    </>
  )
})
