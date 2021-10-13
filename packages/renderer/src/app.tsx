import { AdaptivityProvider, AppRoot, Avatar, ConfigProvider, Snackbar } from '@vkontakte/vkui'
import { FC, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { Icon16DownloadOutline } from '@vkontakte/icons'
import { Dashboard } from './views/dashboard'
import { Login } from './views/login'
import { useStore } from './hooks/use-store'
import { useAppScheme } from './hooks/use-app-scheme'
import { useElectron } from './hooks/use-electron'

export const App: FC = observer(() => {
  const { userStore, snackbarStore } = useStore()
  const { isAuthorized } = userStore
  const { t } = useTranslation()

  const scheme = useAppScheme()

  const { setUpdateAvailableHandler } = useElectron()

  useEffect(() => {
    setUpdateAvailableHandler((info) => {
      const { version } = info

      snackbarStore.show(
        <Snackbar
          onClose={snackbarStore.defaultOnClose}
          action={t`update.action`}
          onActionClick={() => { window.open('https://github.com/vitalyavolyn/vk-deck/releases') }}
          before={(
            <Avatar
              size={24}
              style={{ background: 'var(--accent)' }}
            ><Icon16DownloadOutline fill="#fff" width={14} height={14} /></Avatar>
          )}
        >
          {t('update.available', { version })}
        </Snackbar>,
      )
    })
  }, [setUpdateAvailableHandler, snackbarStore, t])

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
