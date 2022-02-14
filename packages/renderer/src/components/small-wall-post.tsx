import { FC, HTMLAttributes } from 'react'
import { WallWallpost } from '@vkontakte/api-schema-typescript'
import { useColumn } from '@/hooks/use-column'
import { WithColumnStack } from './column-container'
import { WallPostColumn } from './columns/wall-post-column'
import { WallPost } from './wall-post'

import './small-wall-post.css'

interface SmallWallPostProps extends HTMLAttributes<HTMLElement> {
  data: WallWallpost
}

// TODO: rename to `Repost`?
export const SmallWallPost: FC<SmallWallPostProps> = ({ data, ...restProps }) => {
  const { columnStack } = useColumn<WithColumnStack>()
  const isPost = data.post_type === 'post' || data.post_type === 'reply'

  return (
    <div className="small-wall-post" {...restProps}>
      <WallPost
        data={data}
        small
        onClick={(e) => {
          e.stopPropagation()
          if (!isPost) return

          columnStack?.push(<WallPostColumn post={data} />)
        }}
      />
    </div>
  )
}
