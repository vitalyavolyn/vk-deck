import { useEffect, useState } from 'react'
import { Scheme } from '@vkontakte/vkui'
import { useStore } from '@/hooks/use-store'

export function useAppScheme(): Scheme {
  const { settingsStore } = useStore()

  const darkThemeMatch = window.matchMedia('(prefers-color-scheme: light)')

  const getThemeByMediaQuery = (mq: MediaQueryList): Scheme =>
    mq.matches ? Scheme.VKCOM_LIGHT : Scheme.VKCOM_DARK

  const [scheme, setScheme] = useState(getThemeByMediaQuery(darkThemeMatch))

  useEffect(() => {
    if (settingsStore.colorScheme !== 'auto') {
      setScheme(
        settingsStore.colorScheme === 'light'
          ? Scheme.VKCOM_LIGHT
          : Scheme.VKCOM_DARK,
      )
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
