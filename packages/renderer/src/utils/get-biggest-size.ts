import { PhotosPhoto } from '@vkontakte/api-schema-typescript'

export const getBiggestSize = (photo: PhotosPhoto) => {
  return photo.sizes!.sort((a, b) => b.height * b.width - a.height * a.width)[0]
}
