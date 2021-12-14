import { WallWallpostFull } from '@vkontakte/api-schema-typescript'

export const getPostKey = (item: WallWallpostFull) => `${item.owner_id}_${item.id}`
