import { useState } from 'react'

enum AppScheme {
  light = 'bright_light',
  dark = 'space_gray'
}

export function useAppScheme (): AppScheme {
  const darkThemeMatch = window.matchMedia('(prefers-color-scheme: light)')

  const getThemeByMediaQuery = (mq: MediaQueryList | MediaQueryListEvent): AppScheme => (
    mq.matches ? AppScheme.light : AppScheme.dark
  )

  const [scheme, setScheme] = useState(getThemeByMediaQuery(darkThemeMatch))

  darkThemeMatch.addEventListener('change', (e) => {
    setScheme(getThemeByMediaQuery(e))
  })

  return scheme
}
