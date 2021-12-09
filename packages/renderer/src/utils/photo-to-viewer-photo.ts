import {
  GroupsGroup,
  PhotosPhoto,
  UsersUser,
} from '@vkontakte/api-schema-typescript'
import { getBiggestSize } from '@/utils/get-biggest-size'
import { getName } from '@/utils/get-name'

/**
 * Конвертирует фотографии из PhotosPhoto
 * в ViewerPhoto для передачи в просмотрщик
 */
export const photoToViewerPhoto = (
  photo: PhotosPhoto,
  owner?: UsersUser | GroupsGroup,
): ViewerPhoto => {
  return {
    date: photo.date,
    url: getBiggestSize(photo).url,
    owner: {
      name: getName(owner),
      photo: owner?.photo_50,
    },
  }
}
