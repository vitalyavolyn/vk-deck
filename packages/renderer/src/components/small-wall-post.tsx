import { FC, HTMLAttributes } from 'react'
import { WallWallpost } from '@vkontakte/api-schema-typescript'
import { WallPost } from '@/components/wall-post'

import './small-wall-post.css'

interface SmallWallPostProps extends HTMLAttributes<HTMLElement> {
  data: WallWallpost
}

// TODO: rename to `Repost`?
export const SmallWallPost: FC<SmallWallPostProps> = ({ data, ...rest }) => {
  return (
    <div className="small-wall-post" {...rest}>
      <WallPost data={data} small />
    </div>
  )
}
