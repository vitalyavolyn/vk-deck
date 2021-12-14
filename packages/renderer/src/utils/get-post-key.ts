import { NewsfeedItemWallpost, WallWallpostFull } from '@vkontakte/api-schema-typescript'

export const getPostKey = (item: WallWallpostFull | NewsfeedItemWallpost) =>
  'owner_id' in item ? `${item.owner_id}_${item.id}` : `${item.post_source}_${item.post_id}`
