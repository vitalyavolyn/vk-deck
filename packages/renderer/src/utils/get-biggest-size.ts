import { BaseImage } from '@vkontakte/api-schema-typescript'

export const getBiggestSize = (sizes: BaseImage[]) => {
  return sizes.sort((a, b) => b.height * b.width - a.height * a.width)[0]
}
