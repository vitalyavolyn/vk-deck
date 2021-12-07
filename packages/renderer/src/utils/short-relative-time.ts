/* eslint-disable import/no-duplicates */
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from 'date-fns'
import * as locales from 'date-fns/locale'
import i18next, { t } from 'i18next'

export const shortRelativeTime = (date: Date) => {
  const now = new Date()
  const diffDays = differenceInDays(now, date)
  const diffHours = differenceInHours(now, date)
  const diffMinutes = differenceInMinutes(now, date)
  const diffSeconds = differenceInSeconds(now, date)

  if (diffDays >= 7) {
    return format(date, 'd MMM', {
      locale: locales[i18next.language as keyof typeof locales],
    })
  }

  if (diffHours >= 24) {
    return t('time.relativeDays', { d: diffDays })
  }

  if (diffMinutes >= 60) {
    return t('time.relativeHours', { h: diffHours })
  }

  if (diffSeconds >= 60) {
    return t('time.relativeMinutes', { m: diffMinutes })
  }

  if (diffSeconds >= 5) {
    return t('time.relativeSeconds', { s: diffSeconds })
  }

  return t`time.relativeNow`
}
