import { FC } from 'react'
import { Icon24Fire } from '@vkontakte/icons'
import {
  NewsfeedItemWallpost,
  GroupsGroupFull,
} from '@vkontakte/api-schema-typescript'
import { ColumnProps } from '../column-container'
import { ColumnHeader } from './column-header'
import { WallPost } from '@/components/wall-post'

const post: NewsfeedItemWallpost = {
  source_id: -198361544,
  date: 1638252005,
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
  type: 'post',
}

const groups: GroupsGroupFull[] = [
  {
    id: 198361544,
    name: 'Neural Meduza',
    screen_name: 'neural_meduzaaaaaaaaaaaaaaaaaaaa',
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

export const TestColumn: FC<ColumnProps> = () => {
  return (
    <>
      <ColumnHeader icon={<Icon24Fire />} subtitle="testing">
        Test Column
      </ColumnHeader>
      <WallPost data={post} groups={groups} />
    </>
  )
}
