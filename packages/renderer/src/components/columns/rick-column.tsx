import { FC, useEffect, useState } from 'react'
import {
  UsersUserFull,
  WallWallpostFull,
} from '@vkontakte/api-schema-typescript'
import { PanelSpinner } from '@vkontakte/vkui'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { ColumnProps } from '@/components/column-container'
import { ColumnSettings } from '@/components/columns/column-settings'
import { columnIcons } from '@/components/navbar'
import { VirtualScrollWall } from '@/components/virtual-scroll-wall'
import { ColumnType } from '@/store/settings-store'
import { ColumnHeader } from './column-header'

const Icon = columnIcons[ColumnType.rick]

interface RickData {
  lyrics: string
  profile: UsersUserFull
}

export const RickColumn: FC<ColumnProps> = ({ data: { id } }) => {
  const { t } = useTranslation()
  const [profile, setProfile] = useState<UsersUserFull | null>(null)
  const [items, setItems] = useState<WallWallpostFull[]>([])
  const [showSettings, setShowSettings] = useState(false)

  const addLine = (lines: string[]) => {
    const [line, ...rest] = lines

    const post: WallWallpostFull = {
      owner_id: 100,
      from_id: 100,
      text: line,
      id: lines.length,
    }

    setItems((items) => [post, ...items])
    if (rest.length) setTimeout(() => addLine(rest), 3000)
  }

  useEffect(() => {
    axios
      .get<RickData>('https://files.vitalya.me/rickroll.json')
      .then(({ data }) => {
        setProfile(data.profile)
        addLine(data.lyrics.split('\n'))
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
      <ColumnSettings columnId={id} show={showSettings} />
      {profile ? (
        <VirtualScrollWall
          className="column-list-content"
          profiles={[profile]}
          groups={[]}
          items={items}
        />
      ) : (
        <PanelSpinner />
      )}
    </>
  )
}
