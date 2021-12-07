import { FC, ImgHTMLAttributes, useCallback, useEffect, useState } from 'react'
import { Avatar, InitialsAvatar } from '@vkontakte/vkui'
import { isDefaultAvatar } from '@/utils/is-default-avatar'

interface AsyncAvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  gradientColor: number
  initials: string
  src?: string
  size: number
}

export const AsyncAvatar: FC<AsyncAvatarProps> = ({
  src,
  gradientColor,
  initials,
  size,
  ...props
}) => {
  const [imgSrc, setSrc] = useState('')

  const onLoad = useCallback(() => {
    setSrc(src || '')
  }, [src])

  useEffect(() => {
    if (!src) return

    const img = new Image()
    img.src = src
    img.addEventListener('load', onLoad)

    return () => {
      img.removeEventListener('load', onLoad)
    }
  }, [src, onLoad])

  return imgSrc && !isDefaultAvatar(imgSrc) ? (
    <Avatar size={size} {...props} src={imgSrc} />
  ) : (
    // @ts-ignore: :(((((((
    <InitialsAvatar size={size} gradientColor={gradientColor}>
      {initials}
    </InitialsAvatar>
  )
}
