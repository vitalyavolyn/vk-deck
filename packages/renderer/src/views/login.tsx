import { FC, useEffect } from 'react'
import { ScreenSpinner } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useElectron } from '@/hooks/use-electron'
import { useStore } from '@/hooks/use-store'

export const Login: FC = observer(() => {
  const { apiStore } = useStore()
  const { getTokenFromBrowserView } = useElectron()

  useEffect(() => {
    if (!apiStore.token) {
      getTokenFromBrowserView().then(async (token) => {
        // TODO: отлавливание ошибок здесь
        // может быть при ошибке соединения или
        // отзыве ключа доступа
        await apiStore.setToken(token)
      })
    }
  }, [apiStore, getTokenFromBrowserView])

  return <ScreenSpinner />
})
