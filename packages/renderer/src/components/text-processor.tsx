import { FC, memo, ReactNode } from 'react'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { defaultImageGridSettings } from '@/components/modals/add-column-modal'
import { useColumn } from '@/hooks/use-column'
import { useStore } from '@/hooks/use-store'
import { BaseColumn, ColumnType } from '@/store/settings-store'

interface TextProcessorProps {
  content: string
}

// TODO: refactor (делает дело, но странно выглядит)

const linkRegex = '(https?://[\\w#%+.:=@~-]{1,256}.[\\d()a-z]{1,6}\\b[\\w#%&()+./:=?@~-]*)'
const mentionRegex = '(\\[(?:club|public|id)(?:\\d+)\\|(?:.+?)\\])'
const hashtagRegex = '(#[^\\s!#$%&()*:^[\\]]+)'
const comboRegex = new RegExp(`(?:${linkRegex})|(?:${mentionRegex})|(?:${hashtagRegex})`, 'gi')

export const TextProcessor: FC<TextProcessorProps> = memo(({ content }) => {
  const children: ReactNode[] = []
  const { settingsStore } = useStore()
  const { id } = useColumn<BaseColumn>()

  for (const [index, part] of content.split(comboRegex).entries()) {
    let element

    if (new RegExp(linkRegex).test(part)) {
      element = (
        <div className="link-highlight" key={index}>
          <a target="_blank" href={part}>
            {part.replace(/(.{40}).+/, '$1..')}
          </a>
        </div>
      )
    } else if (new RegExp(mentionRegex).test(part)) {
      const [, type, id, text] = /\[(club|public|id)(\d+)\|(.+?)]/gi.exec(part)!

      element = (
        <div className="link-highlight" key={index}>
          <a target="_blank" href={`https://vk.com/${type}${id}`}>
            {text}
          </a>
        </div>
      )
    } else if (new RegExp(hashtagRegex).test(part)) {
      element = (
        <div className="link-highlight" key={index}>
          <a
            href="#"
            onClick={() => {
              const currentIndex = _.findIndex(settingsStore.columns, { id })

              settingsStore.columns.splice(currentIndex + 1, 0, {
                id: uuidv4(),
                type: ColumnType.newsfeedSearch,
                settings: {
                  ...defaultImageGridSettings,
                  query: part,
                },
              })
            }}
          >
            {part}
          </a>
        </div>
      )
    } else {
      element = part
    }

    children.push(element)
  }

  return <>{children}</>
})
