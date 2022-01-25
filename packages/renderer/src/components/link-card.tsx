import { FC } from 'react'
import { BaseLink } from '@vkontakte/api-schema-typescript'
import { Icon16LinkOutline } from '@vkontakte/icons'
import { ContentCard } from '@vkontakte/vkui'
import { getBiggestSize } from '@/utils/get-biggest-size'

import './link-card.css'

interface LinkCardProps {
  link: BaseLink
}

export const LinkCard: FC<LinkCardProps> = ({ link }) => {
  const domain = new URL(link.url).hostname

  return (
    <ContentCard
      className="link-card"
      onClick={() => {
        // TODO: открытие ссылок как в тексте
        window.open(link.url)
      }}
      src={
        link.photo ? getBiggestSize(link.photo.sizes!.filter((e) => e.width <= 600)).url : undefined
      }
      subtitle={
        <>
          <Icon16LinkOutline /> {domain}
        </>
      }
      header={link.title}
      // text={link.description}
      maxHeight={300}
      mode="outline"
    />
  )
}
