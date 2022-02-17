import { FC, HTMLAttributes } from 'react'
import { WallWallpost } from '@vkontakte/api-schema-typescript'
import { useTranslation } from 'react-i18next'
import { useColumn } from '@/hooks/use-column'
import { WithColumnStack } from './column-container'
import { WallPostColumn } from './columns/wall-post-column'
import { WallPost } from './wall-post'

import './repost.css'

interface RepostProps extends HTMLAttributes<HTMLElement> {
  data: WallWallpost
}

export const Repost: FC<RepostProps> = ({ data, ...restProps }) => {
  const { columnStack } = useColumn<WithColumnStack>()
  const { t } = useTranslation()
  const isPost = data.post_type === 'post' || data.post_type === 'reply'

  return (
    <div className="repost" {...restProps}>
      {data.post_type !== 'post' && (
        <div className="repost-type">{t(`repost.${data.post_type}`)}</div>
      )}
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
