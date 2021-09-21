import { FC, useEffect } from 'react'
import { ScreenSpinner } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useElectron } from '../hooks/use-electron'
import { useStore } from '../hooks/use-store'

export const Login: FC = observer(() => {
  const { api } = useStore()
  const { getTokenFromBrowserView } = useElectron()

  useEffect(() => {
    if (!api.token) {
      getTokenFromBrowserView().then(token => {
        api.setToken(token)
      })
    }
  }, [api, getTokenFromBrowserView])

  return <ScreenSpinner />
})
