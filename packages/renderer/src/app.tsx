import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui'
import { FC, useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { storeContext } from './store-context'
import { Dashboard } from './views/dashboard'
import { Login } from './views/login'

enum AppScheme {
  light = 'bright_light',
  dark = 'space_gray'
}

export const App: FC = observer(() => {
  const { isAuthorized } = useContext(storeContext)

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
          {isAuthorized ? <Dashboard /> : <Login />}
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
})
