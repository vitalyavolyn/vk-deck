import { FC, useEffect, useState } from 'react'
import { UsersUserFull, WallWallpostFull } from '@vkontakte/api-schema-typescript'
import { PanelSpinner } from '@vkontakte/vkui'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { ColumnSettings } from '@/components/columns/common/column-settings'
import { columnIcons } from '@/components/navbar'
import { VirtualScrollWall } from '@/components/virtual-scroll-wall'
import { useStore } from '@/hooks/use-store'
import { ColumnType } from '@/store/settings-store'
import { ColumnHeader } from './common/column-header'

const Icon = columnIcons[ColumnType.rick]

interface RickData {
  lyrics: string
  profile: UsersUserFull
}

export const RickColumn: FC = () => {
  const { t } = useTranslation()
  const { apiStore } = useStore()
  const [isReady, setIsReady] = useState(false)
  const [items, setItems] = useState<WallWallpostFull[]>([])
  const [showSettings, setShowSettings] = useState(false)

  const addLine = (lines: string[], ownerId: number) => {
    const [line, ...rest] = lines

    const post: WallWallpostFull = {
      owner_id: ownerId,
      from_id: ownerId,
      text: line,
      id: lines.length,
    }

    setItems((items) => [post, ...items])
    if (rest.length) setTimeout(() => addLine(rest, ownerId), 3000)
  }

  useEffect(() => {
    axios.get<RickData>('https://files.vitalya.me/rickroll.json').then(({ data }) => {
      apiStore.add('profiles', [data.profile])
      setIsReady(true)
      addLine(data.lyrics.split('\n'), data.profile.id)
    })
  }, [])

  return (
    <>
      <ColumnHeader
        icon={Icon}
        subtitle={t`rick.subtitle`}
        onSettingsClick={() => {
          setShowSettings(!showSettings)
        }}
      >
        {t`columns.rick`}
      </ColumnHeader>
      <ColumnSettings show={showSettings} />
      {isReady ? (
        <VirtualScrollWall className="column-list-content" items={items} />
      ) : (
        <PanelSpinner />
      )}
    </>
  )
}
