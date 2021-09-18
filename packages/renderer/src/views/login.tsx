import { FC, useEffect } from 'react'
import { ScreenSpinner } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useElectron } from '../hooks/useElectron'
import { useStore } from '../hooks/useStore'

export const Login: FC = observer(() => {
  const { api } = useStore()
  const { getTokenFromBrowserView } = useElectron()

  useEffect(() => {
    getTokenFromBrowserView().then(token => {
      api.setToken(token)
    })
  }, [api, getTokenFromBrowserView])

  return <ScreenSpinner />
})
