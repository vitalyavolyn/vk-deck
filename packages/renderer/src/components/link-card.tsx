import { FC } from 'react'
import { BaseLink } from '@vkontakte/api-schema-typescript'
import { Icon16LinkOutline } from '@vkontakte/icons'
import { classNames } from '@vkontakte/vkjs'
import { ContentCard } from '@vkontakte/vkui'
import { getBiggestSize } from '@/utils/get-biggest-size'

import './link-card.css'

interface LinkCardProps {
  link: BaseLink
}

export const LinkCard: FC<LinkCardProps> = ({ link }) => {
  return (
    <ContentCard
      className={classNames('link-card', { 'no-text': !link.title && !link.photo })}
      onClick={() => {
        // TODO: открытие ссылок как в тексте
        window.open(link.url)
      }}
      src={
        link.photo ? getBiggestSize(link.photo.sizes!.filter((e) => e.width <= 600)).url : undefined
      }
      subtitle={
        <>
          <Icon16LinkOutline /> {link.caption}
        </>
      }
      header={link.title}
      // text={link.description}
      maxHeight={150}
      mode="outline"
    />
  )
}
