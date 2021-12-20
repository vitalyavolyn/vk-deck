import { CSSProperties, FC } from 'react'
import { PollsPoll } from '@vkontakte/api-schema-typescript'
import { classNames } from '@vkontakte/vkjs'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/hooks/use-store'
import { getName } from '@/utils/get-name'

import './poll.css'

export interface PollProps {
  data: PollsPoll
}

export const Poll: FC<PollProps> = ({ data }) => {
  const { apiStore } = useStore()
  const { t } = useTranslation()
  const ownerName = getName(apiStore.getOwner(data.owner_id))

  console.log(data)

  const pollTypeString = data.anonymous ? 'poll.anonymous' : 'poll.public'

  return (
    <div
      className={classNames('poll', {
        gradient: !!data.background,
      })}
      style={
        {
          '--color-1': '#' + data.background?.points?.[0].color,
          '--color-2': '#' + data.background?.points?.[1].color,
        } as CSSProperties
      }
    >
      <div className="poll-header">
        <div className="poll-question">{data.question}</div>
        <div className="poll-owner">{ownerName}</div>
        <div className="poll-type">{t(pollTypeString)}</div>
      </div>
      <div className="poll-options">
        {data.answers.map((e) => (
          <div className="poll-options-option" key={e.id}>
            <div className="poll-options-option-text">{e.text}</div>
          </div>
        ))}
      </div>
      <div className="poll-footer"></div>
    </div>
  )
}
