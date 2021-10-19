import { useEffect, useState } from 'react'
import { useStore } from '@/hooks/use-store'

enum AppScheme {
  light = 'bright_light',
  dark = 'space_gray',
}

export function useAppScheme(): AppScheme {
  const { settingsStore } = useStore()

  const darkThemeMatch = window.matchMedia('(prefers-color-scheme: light)')

  const getThemeByMediaQuery = (mq: MediaQueryList): AppScheme =>
    mq.matches ? AppScheme.light : AppScheme.dark

  const [scheme, setScheme] = useState(getThemeByMediaQuery(darkThemeMatch))

  useEffect(() => {
    if (settingsStore.colorScheme !== 'auto') {
      setScheme(AppScheme[settingsStore.colorScheme])
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
