import { NewsfeedItemWallpost, WallWallpostFull } from '@vkontakte/api-schema-typescript'
import { getPostKey } from '@/utils/get-post-key'

type UpdatePostInArray = {
  (arr: WallWallpostFull[], post: WallWallpostFull): WallWallpostFull[]
  (arr: NewsfeedItemWallpost[], post: NewsfeedItemWallpost): NewsfeedItemWallpost[]
}

export const updatePostInArray: UpdatePostInArray = (arr: any, post: any) => {
  return arr.map((item: WallWallpostFull | NewsfeedItemWallpost) =>
    getPostKey(item) === getPostKey(post) ? post : item,
  )
}
