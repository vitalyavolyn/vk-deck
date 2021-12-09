import { FC, StrictMode } from 'react'
import { Icon36CancelOutline } from '@vkontakte/icons'
import i18next from 'i18next'
import { render } from 'react-dom'
import { initReactI18next } from 'react-i18next'
import { useElectron } from '@/hooks/use-electron'
import ru from '@/locales/ru.yml'

import './viewer.css'

i18next.use(initReactI18next).init({
  fallbackLng: 'ru',
  resources: { ru },
  debug: true,
})

const Viewer: FC = () => {
  const { closeViewer } = useElectron()

  return (
    <div className="viewer">
      <div className="close-button" onClick={closeViewer}>
        <Icon36CancelOutline />
      </div>
      <div className="canvas">a</div>
      <div className="toolbar">AAAAAAAAAAAAAAAAAAAAAAAAAA</div>
    </div>
  )
}

render(
  <StrictMode>
    <Viewer />
  </StrictMode>,
  document.querySelector('#app'),
)
