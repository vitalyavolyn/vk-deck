import { FC, useCallback, useEffect, useState } from 'react'
import { Avatar, AvatarProps, InitialsAvatar } from '@vkontakte/vkui'
import { InitialsAvatarNumberGradients } from '@vkontakte/vkui/dist/components/InitialsAvatar/InitialsAvatar'
import { isDefaultAvatar } from '@/utils/is-default-avatar'

interface AsyncAvatarProps extends AvatarProps {
  gradientColor: InitialsAvatarNumberGradients
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
    <InitialsAvatar size={size} gradientColor={gradientColor}>
      {initials}
    </InitialsAvatar>
  )
}
