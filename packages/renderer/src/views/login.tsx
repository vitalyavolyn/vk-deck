import { FC, useContext, useEffect } from 'react'
import { ScreenSpinner } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useElectron } from '../hooks/useElectron'
import { storeContext } from '../store-context'

export const Login: FC = observer(() => {
  const api = useContext(storeContext)
  const { getTokenFromBrowserView } = useElectron()

  useEffect(() => {
    getTokenFromBrowserView().then(token => {
      api.setToken(token)
      console.log(api, api.token, api.isAuthorized)
    })
  }, [api, getTokenFromBrowserView])

  return <ScreenSpinner />
})
