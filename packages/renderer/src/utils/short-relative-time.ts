/* eslint-disable import/no-duplicates */
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  format,
} from 'date-fns'
import * as locales from 'date-fns/locale'
import i18next, { t } from 'i18next'

export const shortRelativeTime = (date: Date) => {
  const now = new Date()
  const diffMonths = differenceInMonths(now, date)
  const diffDays = differenceInDays(now, date)
  const diffHours = differenceInHours(now, date)
  const diffMinutes = differenceInMinutes(now, date)
  const diffSeconds = differenceInSeconds(now, date)

  const locale = locales[i18next.language as keyof typeof locales]

  if (diffMonths >= 12) {
    return format(date, 'd MMM yyyy', {
      locale,
    })
  }

  if (diffDays >= 7) {
    return format(date, 'd MMM', {
      locale,
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
