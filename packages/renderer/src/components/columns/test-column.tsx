import { FC } from 'react'
import {
  WallWallpostFull,
  GroupsGroupFull,
  UsersUserFull,
} from '@vkontakte/api-schema-typescript'
import { ColumnProps } from '../column-container'
import { ColumnHeader } from './column-header'
import { WallPost } from '@/components/wall-post'
import { columnIcons } from '@/components/navbar'
import { ColumnType } from '@/store/settings-store'

const post: WallWallpostFull = {
  owner_id: -198361544,
  date: 1636653600,
  text: 'Путин вернулся из реанимации героем порно!',
  marked_as_ads: 0,
  comments: {
    can_post: 1,
    count: 0,
    groups_can_post: true,
  },
  likes: {
    can_like: 1,
    count: 0,
    user_likes: 0,
    can_publish: 1,
  },
  reposts: {
    count: 0,
    user_reposted: 0,
  },
  views: {
    count: 6,
  },
  is_favorite: false,
  post_id: 54039,
}

const friendPost: WallWallpostFull = {
  owner_id: 240762441,
  date: 1638255074,
  post_type: 'post',
  text: 'Кот.',
  attachments: [],
  post_source: {
    platform: 'android',
    type: 'api',
  },
  comments: {
    can_post: 0,
    count: 0,
    groups_can_post: true,
  },
  likes: {
    can_like: 1,
    count: 9,
    user_likes: 0,
    can_publish: 0,
  },
  reposts: {
    count: 0,
    user_reposted: 0,
  },
  views: {
    count: 68,
  },
  is_favorite: false,
  short_text_rate: 0.8,
  carousel_offset: 0,
  post_id: 878,
}

const groups: GroupsGroupFull[] = [
  {
    id: 198361544,
    name: 'Neural Meduza',
    screen_name: 'neural_meduza',
    is_closed: 0,
    type: 'group',
    photo_50:
      'https://sun2.dataix-kz-akkol.userapi.com/s/v1/ig2/BgYor6uZczkDddYAQV5Cola2Wf_GkNIjCY_lHIjNHJuW8Y6_QWwk0gtOLp05KmSuKNvfmiF09ClZknTkaJTbzQOB.jpg?size=50x50&quality=96&crop=20,20,360,360&ava=1',
    photo_100:
      'https://sun2.dataix-kz-akkol.userapi.com/s/v1/ig2/IGz8yZMRSCa5p-VRJfaIrLWHS78Fq-7e6YZssW9gEseI-L9WhQGOLsX_jnT6DuP5sVKRm6qBkL9x4S94EETP_CTS.jpg?size=100x100&quality=96&crop=20,20,360,360&ava=1',
    photo_200:
      'https://sun2.dataix-kz-akkol.userapi.com/s/v1/ig2/A_UysMqMizno5Q0bVWD3FkKrXFvQAAgFFxTKUWrGnNm3mqGtLxI-bxX0OE7_aA1hV-_eEJUm1e0I2OtUZuel8qNI.jpg?size=200x200&quality=96&crop=20,20,360,360&ava=1',
  },
]

const profiles: UsersUserFull[] = [
  {
    first_name: 'Олег',
    id: 240762441,
    last_name: 'Мишланов',
    can_access_closed: true,
    is_closed: true,
    sex: 2,
    screen_name: 'thebakercat',
    photo_50: 'https://sun2.data...2,412,412&ava=1',
    photo_100: 'https://sun2.data...2,412,412&ava=1',
    online_info: {
      visible: true,
      last_seen: 1638263942,
      is_online: false,
      app_id: 2274003,
      is_mobile: true,
    },
    online: 0,
  },
]

const Icon = columnIcons[ColumnType.test]

export const TestColumn: FC<ColumnProps> = () => {
  return (
    <>
      <ColumnHeader icon={Icon} subtitle="testing">
        Test Column
      </ColumnHeader>
      <WallPost data={friendPost} groups={groups} profiles={profiles} />
      <WallPost
        data={{ ...post, date: new Date(2021, 10, 30, 11).getTime() / 1000 }}
        groups={groups}
        profiles={profiles}
      />
      <WallPost data={friendPost} groups={groups} profiles={profiles} />
      <WallPost data={post} groups={groups} profiles={profiles} />
    </>
  )
}
