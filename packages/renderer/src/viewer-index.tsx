import { FC, MouseEventHandler, StrictMode, useEffect, useState } from 'react'
import { Icon36CancelOutline } from '@vkontakte/icons'
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  Platform,
  Scheme,
} from '@vkontakte/vkui'
import { format } from 'date-fns'
import * as locales from 'date-fns/locale'
import i18next from 'i18next'
import { render } from 'react-dom'
import { initReactI18next, useTranslation } from 'react-i18next'
import { AsyncAvatar } from '@/components/async-avatar'
import { useElectron } from '@/hooks/use-electron'
import ru from '@/locales/ru.yml'
import { getInitials } from '@/utils/get-initials'

import './viewer.css'

i18next.use(initReactI18next).init({
  fallbackLng: 'ru',
  resources: { ru },
  debug: true,
})

const Viewer: FC = () => {
  const { closeViewer, getViewerParams } = useElectron()
  const { t } = useTranslation()
  const [photos, setPhotos] = useState<ViewerPhoto[] | null>(null)
  const [index, setIndex] = useState(0)

  const next: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
    setIndex((index + 1) % photos!.length)
  }

  useEffect(() => {
    getViewerParams().then(({ photos, index }) => {
      setIndex(index)
      setPhotos(photos)
    })
  }, [])

  if (!photos) return null

  const locale = locales[i18next.language as keyof typeof locales]

  const { url, date, owner } = photos[index]

  return (
    <div className="viewer">
      <div className="close-button" onClick={closeViewer}>
        <Icon36CancelOutline />
      </div>
      <div className="canvas" onClick={closeViewer}>
        <div className="content">
          <img src={url} onClick={next} />
        </div>
      </div>
      <div className="toolbar">
        <div className="owner">
          <AsyncAvatar
            gradientColor={5}
            initials={getInitials(owner)}
            size={48}
            src={owner.photo}
          />
          <div className="text">
            <div className="name">{owner.name}</div>
            <div className="date">
              {format(new Date(date * 1000), 'd MMM yyyy HH:mm', {
                locale,
              })}
            </div>
          </div>
        </div>
        <div className="counter">
          {/* TODO: не находится посередине */}
          {t(`viewer.photoCounter`, { index: index + 1, total: photos.length })}
        </div>
        <div className="actions"></div>
      </div>
    </div>
  )
}

render(
  <StrictMode>
    <ConfigProvider scheme={Scheme.VKCOM_DARK} platform={Platform.VKCOM}>
      <AdaptivityProvider>
        <AppRoot noLegacyClasses>
          <Viewer />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  </StrictMode>,
  document.querySelector('#app'),
)
