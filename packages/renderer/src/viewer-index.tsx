import { FC, MouseEvent, StrictMode, useEffect, useState } from 'react'
import { Icon36CancelOutline } from '@vkontakte/icons'
import { AdaptivityProvider, AppRoot, ConfigProvider, Platform, Scheme } from '@vkontakte/vkui'
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
  const [nextIndexDiff, setNextIndexDiff] = useState(0)

  type Direction = -1 | 1

  // TODO: refactor this
  // wtf
  const moveIndex = (direction: Direction, e?: MouseEvent<HTMLElement>) => {
    e?.stopPropagation()
    setNextIndexDiff(direction)
  }

  useEffect(() => {
    if (nextIndexDiff) {
      const newIndex = (index + nextIndexDiff) % photos!.length
      setIndex(newIndex < 0 ? photos!.length - 1 : newIndex)
      setNextIndexDiff(0)
    }
  }, [nextIndexDiff])
  // end wtf

  useEffect(() => {
    getViewerParams().then(({ photos, index }) => {
      setIndex(index)
      setPhotos(photos)
    })
  }, [])

  useEffect(() => {
    // если будут инпуты, то это все испортит
    window.addEventListener(
      'keydown',
      (e) => {
        let direction: Direction | undefined

        if (e.code === 'ArrowLeft' || e.code === 'KeyH') {
          direction = -1
        } else if (e.code === 'ArrowRight' || e.code === 'KeyL') {
          direction = 1
        }

        if (direction) {
          moveIndex(direction)
        }
      },
      true,
    )
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
          <img src={url} onClick={(e) => moveIndex(1, e)} />
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
