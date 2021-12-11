import { GroupsGroup, UsersUserFull } from '@vkontakte/api-schema-typescript'

declare module '@vkontakte/api-schema-typescript' {
  interface NewsfeedItemWallpost {
    can_delete?: 0 | 1
  }

  // эти поля есть только при использовании fields, но если что, то я сам виноват
  interface UsersUserMin {
    photo_50: string
    screen_name: string
  }

  // метод считается deprecated, типов нет
  interface FaveGetPostsExtendedResponse {
    count: number
    items: WallWallpostFull[]
    profiles: UsersUserFull[]
    groups: GroupsGroup[]
  }

  interface FaveGetPostsParams {
    offset?: number
    count?: number
    extended?: 1 | 0
  }

  interface WallWallpostFull {
    // есть, когда пост создан удалением страницы
    final_post?: 0 | 1
  }
}
