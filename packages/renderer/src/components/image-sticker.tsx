import { FC } from 'react'
import { BaseStickerNew } from '@vkontakte/api-schema-typescript'
import { observer } from 'mobx-react-lite'
import { useAppScheme } from '@/hooks/use-app-scheme'

import './image-sticker.css'

interface ImageStickerProps {
  sticker: BaseStickerNew
}

export const ImageSticker: FC<ImageStickerProps> = observer(({ sticker }) => {
  const scheme = useAppScheme()

  return (
    <img
      src={sticker[scheme === 'dark' ? 'images_with_background' : 'images']![1].url}
      className="sticker"
    />
  )
})
