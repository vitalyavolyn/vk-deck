import { FC, useCallback } from 'react'
import { BaseStickerNew } from '@vkontakte/api-schema-typescript'
import lottie from 'lottie-web'

interface AnimatedStickerProps {
  sticker: BaseStickerNew
}

export const AnimatedSticker: FC<AnimatedStickerProps> = ({ sticker }) => {
  const initAnimation = (container: HTMLElement) => {
    lottie.loadAnimation({
      container,
      path: sticker.animation_url,
      autoplay: true,
      loop: true,
      rendererSettings: {
        progressiveLoad: true,
      },
    })
  }

  const refCallback = useCallback((node: HTMLElement | null) => {
    if (node) initAnimation(node)
  }, [])

  return <div ref={refCallback} style={{ width: 128 }} />
}
