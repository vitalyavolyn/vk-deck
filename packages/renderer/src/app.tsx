import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui'
import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { Dashboard } from './views/dashboard'
import { Login } from './views/login'
import { useStore } from './hooks/use-store'
import { useAppScheme } from './hooks/use-app-scheme'

export const App: FC = observer(() => {
  const { api } = useStore()
  const { isAuthorized } = api
  const scheme = useAppScheme()

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
