import { FC, useEffect, useState } from 'react'
import { Icon24NewsfeedOutline } from '@vkontakte/icons'
import {
  GroupsGroupFull,
  NewsfeedGetParams,
  NewsfeedGetResponse,
  NewsfeedItemWallpost,
  UsersUserFull,
} from '@vkontakte/api-schema-typescript'
import { ColumnHeader } from '@/components/columns/column-header'
import { WallPost } from '@/components/wall-post'
import { useStore } from '@/hooks/use-store'

export const NewsfeedColumn: FC = () => {
  const { userStore } = useStore()
  const [items, setItems] = useState<NewsfeedItemWallpost[]>()
  const [groups, setGroups] = useState<GroupsGroupFull[]>()
  const [profiles, setProfiles] = useState<UsersUserFull[]>()

  useEffect(() => {
    const getPosts = async () => {
      const response = await userStore.api.call<
        NewsfeedGetResponse,
        NewsfeedGetParams
      >('newsfeed.get', {
        filters: 'post',
      })

      const { items, groups, profiles } = response
      setGroups(groups)
      setProfiles(profiles)
      setItems(items)

      setTimeout(getPosts, 10000)
    }

    getPosts()
  }, [])

  return (
    <>
      <ColumnHeader
        icon={<Icon24NewsfeedOutline />}
        subtitle={`@${userStore.data.user.screen_name}`}
      >
        Новости
      </ColumnHeader>
      {/* TODO: не нравится, что скроллбар на шапке */}
      {items &&
        groups &&
        profiles &&
        items.map((e) => (
          <WallPost
            key={`${e.source_id}_${e.post_id}`}
            data={e}
            groups={groups}
            profiles={profiles}
          />
        ))}
    </>
  )
}
