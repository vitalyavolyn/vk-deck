import {
  GroupsGroup,
  PhotosPhoto,
  PhotosPhotoSizes,
  UsersUserFull,
  PodcastCover,
} from '@vkontakte/api-schema-typescript'

interface TextliveBase {
  attach_url: string
  is_live: 1 | 0
  online: number
  text: string
  textlive_id: number
  textlive_owner_id: number
  textpost_author_id: number
  textpost_date: number
  title: string
  type: 'textlive' | 'textpost'
  url: string
}

interface WallPostHeaderDescription {
  text: string
}

interface WallPostHeaderAds {
  type: 'ads'
  ads: {
    date: number
    description: WallPostHeaderDescription
    source_id: number
  }
}

interface WallPostHeaderCustomDescription {
  custom_description: {
    date: number
    source_id: number
    description?: WallPostHeaderDescription
    overlay_image?: {
      sizes: PhotosPhotoSizes
    }
  }
  type: 'custom_description'
}

type WallPostHeader = WallPostHeaderAds | WallPostHeaderCustomDescription

declare module '@vkontakte/api-schema-typescript' {
  interface NewsfeedItemWallpost {
    can_delete?: 0 | 1
    header?: WallPostHeader
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
    fields?: string
  }

  interface WallWallpostFull {
    // есть, когда пост создан удалением страницы
    final_post?: 0 | 1
    header?: WallPostHeader
  }

  interface WallWallpost {
    header?: WallPostHeader
  }

  interface WallWallpostAttachment {
    podcast?: {
      artist: string
      date: number
      duration: number
      id: number
      is_explicit: boolean
      is_focus_track: boolean
      no_search: 0 | 1
      owner_id: number
      podcast_info: {
        cover: PodcastCover
        description: string
        is_favorite: boolean
        plays: number
      }
      short_videos_allowed: boolean
      stories_allowed: boolean
      stories_cover_allowed: boolean
      title: string
      track_code: string
      url: string
    }
    situational_theme?: {
      can_delete: boolean
      can_edit: boolean
      category: string
      cover_photo: PhotosPhoto
      date: number
      date_start: number
      description: string
      friends_posted: [] // TODO че там?
      friends_posted_count: []
      id: number
      is_anonymous: boolean
      link: string
      owner_id: number
      publications_count: number
      squared_cover_photo: PhotosPhoto
      title: string
      views_count: number
    }
    donut_link?: {
      action: {
        target: 'internal'
        type: 'open_url'
        url: string
      }
      button: {
        action: {
          target: 'internal'
          type: 'open_url'
          url: string
        }
        title: string
      }
      donors: {
        count: number
        friends: [] // TODO: че там?
        friends_count: number
      }
      owner_id: number
      text: string
    }
    textlive?: TextliveBase & { is_live: 0 | 1; type: 'textlive' }
    textpost?: TextliveBase & { type: 'textpost' }
  }
}
