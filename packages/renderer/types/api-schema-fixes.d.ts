import '@vkontakte/api-schema-typescript'

declare module '@vkontakte/api-schema-typescript' {
  interface NewsfeedItemWallpost {
    can_delete?: 0 | 1
  }

  // эти поля есть только при использовании fields, но если что, то я сам виноват
  interface UsersUserMin {
    photo_50: string
    screen_name: string
  }
}
