import { FC, useEffect } from 'react'
import { Icon16DownloadOutline } from '@vkontakte/icons'
import {
  AdaptivityProvider,
  AppRoot,
  Avatar,
  ConfigProvider,
  Platform,
  Snackbar,
} from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useAppScheme } from '@/hooks/use-app-scheme'
import { useElectron } from '@/hooks/use-electron'
import { useStore } from '@/hooks/use-store'
import { Dashboard } from '@/views/dashboard'
import { Login } from '@/views/login'

export const App: FC = observer(() => {
  const { apiStore, snackbarStore, uiStore } = useStore()
  const { isAuthorized } = apiStore
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
          onActionClick={() => {
            window.open('https://github.com/vitalyavolyn/vk-deck/releases')
          }}
          before={
            <Avatar size={24} style={{ background: 'var(--accent)' }}>
              <Icon16DownloadOutline fill="#fff" width={14} height={14} />
            </Avatar>
          }
        >
          {t('update.available', { version })}
        </Snackbar>,
      )
    })
  }, [setUpdateAvailableHandler, snackbarStore, t])

  return (
    <ConfigProvider scheme={scheme} platform={Platform.VKCOM}>
      <AdaptivityProvider>
        <AppRoot noLegacyClasses>
          {isAuthorized ? <Dashboard /> : <Login />}
          {uiStore.photoPopup}
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
})
