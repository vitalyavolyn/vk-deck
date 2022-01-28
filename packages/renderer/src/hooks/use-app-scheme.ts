import { useEffect, useState } from 'react'
import { Appearance } from '@vkontakte/vkui'
import { useStore } from '@/hooks/use-store'

export const useAppScheme = (): Appearance => {
  const { settingsStore } = useStore()

  const darkThemeMatch = window.matchMedia('(prefers-color-scheme: light)')

  const getThemeByMediaQuery = (mq: MediaQueryList): Appearance =>
    mq.matches ? Appearance.LIGHT : Appearance.DARK

  const [scheme, setScheme] = useState(getThemeByMediaQuery(darkThemeMatch))

  useEffect(() => {
    if (settingsStore.colorScheme !== 'auto') {
      setScheme(settingsStore.colorScheme === 'light' ? Appearance.LIGHT : Appearance.DARK)
    } else {
      setScheme(getThemeByMediaQuery(darkThemeMatch))
    }
  }, [settingsStore.colorScheme, darkThemeMatch])

  darkThemeMatch.addEventListener('change', () => {
    if (settingsStore.colorScheme === 'auto') {
      setScheme(getThemeByMediaQuery(darkThemeMatch))
    }
  })

  return scheme
}
