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
export const SmallWallPost: FC<SmallWallPostProps> = ({ data, ...rest }) => {
  const { columnStack } = useColumn<WithColumnStack>()

  return (
    <div className="small-wall-post" {...rest}>
      <WallPost
        data={data}
        small
        onClick={() => {
          columnStack?.push(<WallPostColumn post={data} />)
        }}
      />
    </div>
  )
}
