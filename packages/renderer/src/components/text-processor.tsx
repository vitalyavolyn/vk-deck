import { FC, memo, ReactNode } from 'react'
import _ from 'lodash'
import * as punycode from 'punycode/'
import tlds from 'tlds'
import { v4 as uuidv4 } from 'uuid'
import { WithColumnStack } from '@/components/column-container'
import { WallPostColumn } from '@/components/columns/wall-post-column'
import { defaultImageGridSettings } from '@/components/side-panels/add-column-side-panel'
import { useColumn } from '@/hooks/use-column'
import { useStore } from '@/hooks/use-store'
import { BaseColumn, ColumnType } from '@/store/settings-store'

interface TextProcessorProps {
  content: string
  // TODO: может, просто всегда сделать true? так нельзя разве что в сообщениях
  parseInternalLinks?: boolean
}

// TODO: refactor (делает дело, но странно выглядит)

const tldsRegexPart = _.uniq(tlds.flatMap((e) => [e, punycode.toUnicode(e)]))
  .sort((a, b) => b.length - a.length)
  .join('|')

const linkRegex = `((?:https?:\\/\\/)?[\\w\\p{Alpha}#%+.:=@~-]{1,256}\\.(?:${tldsRegexPart})(?:\\/[\\w\\p{Alpha}#%&+./:=?@~-]*)*)(?!\\p{Alpha})`
const mentionRegex = '(\\[(?:club|public|id)(?:\\d+)\\|(?:.+?)\\])'
const internalLinkRegex = '(\\[(?:https?:\\/\\/)?vk\\.com(?:\\/.*)\\|(?:.+?)\\])'
const hashtagRegex = '(#[^\\s!#$%&()*:^[\\]]+)'

const isWallPostLink = (link: string) => /^(?:https?:\/\/)?vk\.com\/wall(-?\d+_\d+)/.test(link)

export const TextProcessor: FC<TextProcessorProps> = memo(({ content, parseInternalLinks }) => {
  const children: ReactNode[] = []
  const { settingsStore } = useStore()
  const { columnStack } = useColumn<WithColumnStack>()
  const { id } = useColumn<BaseColumn>()
  const comboRegex = parseInternalLinks
    ? new RegExp(
        `(?:${internalLinkRegex})|(?:${linkRegex})|(?:${mentionRegex})|(?:${hashtagRegex})`,
        'giu',
      )
    : new RegExp(`(?:${linkRegex})|(?:${mentionRegex})|(?:${hashtagRegex})`, 'giu')

  const openWallPost = (path: string) => {
    const id = path.match(/(-?\d+_\d+)/)![0]
    columnStack.push(<WallPostColumn postId={id} />)
  }

  for (const [index, part] of content.split(comboRegex).entries()) {
    let element

    if (parseInternalLinks && new RegExp(internalLinkRegex).test(part)) {
      const [, path, text] = /\[(?:https?:\/\/)?vk\.com(\/.*)\|(.+?)]/i.exec(part)!

      const fullLink = `https://vk.com${path}`
      const isWallPost = isWallPostLink(fullLink)

      element = (
        <div className="link-highlight" key={index}>
          <a
            target="_blank"
            href={fullLink}
            onClick={
              isWallPost
                ? (e) => {
                    e.preventDefault()
                    openWallPost(path)
                  }
                : undefined
            }
          >
            {text}
          </a>
        </div>
      )
    } else if (new RegExp(linkRegex, 'giu').test(part)) {
      const isWallPost = isWallPostLink(part)

      element = (
        <div className="link-highlight" key={index}>
          <a
            target="_blank"
            href={!/^https?:\/\//i.test(part) ? `http://${part}` : part}
            onClick={
              isWallPost
                ? (e) => {
                    e.preventDefault()
                    openWallPost(part)
                  }
                : undefined
            }
          >
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
            href={`https://vk.com/feed?section=search&c[q]=${encodeURIComponent(part)}`}
            onClick={(e) => {
              e.preventDefault()
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
