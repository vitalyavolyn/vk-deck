import '@vkontakte/api-schema-typescript'

declare module '@vkontakte/api-schema-typescript' {
  interface NewsfeedItemWallpost {
    can_delete?: 0 | 1
  }
}
