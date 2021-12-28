import { FC } from 'react'
import { BaseStickerNew } from '@vkontakte/api-schema-typescript'
import { AnimatedSticker } from '@/components/animated-sticker'
import { ImageSticker } from '@/components/image-sticker'

interface StickerProps {
  sticker: BaseStickerNew
}

export const Sticker: FC<StickerProps> = ({ sticker }) =>
  sticker.animation_url ? <AnimatedSticker sticker={sticker} /> : <ImageSticker sticker={sticker} />
