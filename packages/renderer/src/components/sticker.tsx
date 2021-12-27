import { FC } from 'react'
import { BaseStickerNew } from '@vkontakte/api-schema-typescript'
import { observer } from 'mobx-react-lite'
import { useAppScheme } from '@/hooks/use-app-scheme'

import './sticker.css'

interface StickerProps {
  sticker: BaseStickerNew
}

// TODO: animated stickers
export const Sticker: FC<StickerProps> = observer(({ sticker }) => {
  const scheme = useAppScheme()

  return (
    <img
      src={sticker[scheme === 'vkcom_dark' ? 'images_with_background' : 'images']![1].url}
      className="sticker"
    />
  )
})
