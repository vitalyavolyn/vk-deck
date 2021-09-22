import { FC, useEffect } from 'react'
import { ScreenSpinner } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useElectron } from '../hooks/use-electron'
import { useStore } from '../hooks/use-store'

export const Login: FC = observer(() => {
  const { userStore } = useStore()
  const { getTokenFromBrowserView } = useElectron()

  useEffect(() => {
    if (!userStore.token) {
      getTokenFromBrowserView().then(token => {
        userStore.setToken(token)
      })
    }
  }, [userStore, getTokenFromBrowserView])

  return <ScreenSpinner />
})
