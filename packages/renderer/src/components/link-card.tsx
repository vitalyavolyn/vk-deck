import { FC } from 'react'
import { BaseLink } from '@vkontakte/api-schema-typescript'
import { ContentCard } from '@vkontakte/vkui'
import { getBiggestSize } from '@/utils/get-biggest-size'

import './link-card.css'

interface LinkCardProps {
  link: BaseLink
}

export const LinkCard: FC<LinkCardProps> = ({ link }) => {
  return (
    <ContentCard
      className="link-card"
      onClick={() => {
        window.open(link.url)
      }}
      src={
        link.photo ? getBiggestSize(link.photo.sizes!.filter((e) => e.width <= 600)).url : undefined
      }
      subtitle={new URL(link.url).hostname}
      header={link.title}
      // text={link.description}
      maxHeight={300}
    />
  )
}
