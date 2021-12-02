import { FC, useEffect, useState } from 'react'
import { Icon24NewsfeedOutline } from '@vkontakte/icons'
import {
  GroupsGroupFull,
  NewsfeedGetParams,
  NewsfeedGetResponse,
  NewsfeedItemWallpost,
  UsersUserFull,
} from '@vkontakte/api-schema-typescript'
import { classNames } from '@vkontakte/vkjs'
import { FormItem, FormLayout, Input } from '@vkontakte/vkui'
import { ColumnHeader } from '@/components/columns/column-header'
import { WallPost } from '@/components/wall-post'
import { useStore } from '@/hooks/use-store'

export const NewsfeedColumn: FC = () => {
  const { userStore, snackbarStore } = useStore()
  const [items, setItems] = useState<NewsfeedItemWallpost[]>()
  const [groups, setGroups] = useState<GroupsGroupFull[]>()
  const [profiles, setProfiles] = useState<UsersUserFull[]>()
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const getPosts = async () => {
      try {
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
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.toString())
          snackbarStore.showError('error.toString()')
        }
      }

      setTimeout(getPosts, 10000)
    }

    getPosts()
  }, [])

  return (
    <>
      <ColumnHeader
        icon={<Icon24NewsfeedOutline />}
        subtitle={`@${userStore.data.user.screen_name}`}
        showSettingsButton
        onSettingsClick={() => {
          setShowSettings(!showSettings)
        }}
      >
        Новости
      </ColumnHeader>
      <div className={classNames('column-settings', { hidden: !showSettings })}>
        <FormLayout>
          {/* TODO: параметры */}
          <FormItem top="E-mail">
            <Input
              type="email"
              name="email"
              value=""
              onChange={() => {
                console.log()
              }}
            />
          </FormItem>
        </FormLayout>
      </div>
      <div className="column-list-content">
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
      </div>
    </>
  )
}
