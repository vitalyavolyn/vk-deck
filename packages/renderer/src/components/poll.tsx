import { CSSProperties, FC, useState } from 'react'
import {
  PollsAddVoteParams,
  PollsGetByIdResponse,
  PollsPoll,
} from '@vkontakte/api-schema-typescript'
import { Icon16Done } from '@vkontakte/icons'
import { classNames } from '@vkontakte/vkjs'
import { UsersStack } from '@vkontakte/vkui'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/hooks/use-store'
import { getName } from '@/utils/get-name'

import './poll.css'

export interface PollProps {
  data: PollsPoll
}

// TODO: иногда в опросах нельзя голосовать
export const Poll: FC<PollProps> = ({ data: initialData }) => {
  const { apiStore } = useStore()
  const { t } = useTranslation()
  const [data, setData] = useState(initialData)

  const ownerName = getName(apiStore.getOwner(data.author_id ?? data.owner_id))

  console.log(data)

  const pollTypeString = data.anonymous ? 'poll.anonymous' : 'poll.public'

  const photos = data.friends?.map((e) => apiStore.getOwner(e.id)).map((e) => e.photo_50!)

  const hasVoted = !!data.answer_ids?.length

  const vote = async (id: number) => {
    const poll = await apiStore.api.call<PollsGetByIdResponse, PollsAddVoteParams>('execute.vote', {
      answer_ids: [id].toString(),
      owner_id: data.owner_id,
      poll_id: data.id,
    })

    setData(poll)
  }

  // TODO: multichoice
  return (
    <div
      className={classNames('poll', {
        gradient: !!data.background,
      })}
      style={
        {
          // TODO: картинки
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
        {data.answers.map((e) => {
          const clickable = data.can_vote && !hasVoted

          return (
            <div
              className={classNames('poll-options-option', {
                clickable,
                voted: hasVoted,
              })}
              style={
                {
                  '--rate': e.rate + '%',
                } as CSSProperties
              }
              key={e.id}
              onClick={() => {
                clickable && vote(e.id)
              }}
            >
              <div className="poll-options-option-text">
                {e.text}
                <span className="votes-count">{e.votes}</span>
              </div>
              <div className="poll-options-option-percent">
                {data.answer_ids?.includes(e.id) && <Icon16Done />}
                {e.rate}%
              </div>
              <div className="poll-options-option-progress-bar"></div>
            </div>
          )
        })}
      </div>
      <div className="poll-footer">
        <UsersStack photos={photos}>{t('poll.votedCount', { count: data.votes })}</UsersStack>
      </div>
    </div>
  )
}
