import { getName } from '@/utils/get-name'

export interface HasName {
  name: string
}

export interface HasHumanName {
  first_name: string
  last_name: string
}

const getEmojiLength = (str?: string) => {
  return str?.match(
    /^(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u,
  )?.[0].length
}

const isLetterOrNumber = (str: string) => {
  return /^\p{L}|\d/u.test(str)
}

const isDiac = (str: string) => {
  return /^\p{Diacritic}/u.test(str)
}

// Адаптировано из
// https://github.com/telegramdesktop/tdesktop/blob/624d83dc6008310d5fb88831f4d633992c864ba1/Telegram/SourceFiles/ui/empty_userpic.cpp#L402
const fillString = (name: string) => {
  const letters = []
  const levels = []

  let level = 0
  let letterFound = false

  let ch = 0
  const end = name.length

  while (ch !== end) {
    const emojiLength = getEmojiLength(name.slice(ch))
    if (emojiLength) {
      ch += emojiLength
    } else if (!letterFound && isLetterOrNumber(name[ch])) {
      letterFound = true
      if (ch + 1 !== end && isDiac(name[ch + 1])) {
        letters.push(name.slice(ch, ch + 2))
        levels.push(level)
        ++ch
      } else {
        letters.push(name[ch])
        levels.push(level)
      }
      ++ch
    } else {
      if (name[ch] === ' ') {
        level = 0
        letterFound = false
      } else if (letterFound && name[ch] === '-') {
        level = 1
        letterFound = true
      }
      ++ch
    }
  }

  let str = ''
  if (letters.length) {
    str += letters[0]
    let bestIndex = 0
    let bestLevel = 2
    for (let i = letters.length; i !== 1; ) {
      if (levels[--i] < bestLevel) {
        bestIndex = i
        bestLevel = levels[i]
      }
    }

    if (bestIndex > 0) {
      str += letters[bestIndex]
    }
  }

  return str.toUpperCase()
}

export const getInitials = (data: HasName | HasHumanName | string) => {
  if (typeof data === 'string') {
    data = { name: data }
  }

  const name = getName(data)
  return fillString(name)
}
