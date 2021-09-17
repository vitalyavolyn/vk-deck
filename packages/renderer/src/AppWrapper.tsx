import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui'
import { FC, useState } from 'react'

enum AppScheme {
  light = 'bright_light',
  dark = 'space_gray'
}

export const AppWrapper: FC = ({ children }) => {
  const darkThemeMatch = window.matchMedia('(prefers-color-scheme: dark)')
  const getThemeByMediaQuery = (mq: MediaQueryList | MediaQueryListEvent): AppScheme => (
    mq.matches ? AppScheme.dark : AppScheme.light
  )

  const [scheme, setScheme] = useState<AppScheme>(getThemeByMediaQuery(darkThemeMatch))

  darkThemeMatch.addEventListener('change', (e) => {
    setScheme(getThemeByMediaQuery(e))
  })

  return (
    <ConfigProvider scheme={scheme}>
      <AdaptivityProvider>
        <AppRoot>
          {children}
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
}
