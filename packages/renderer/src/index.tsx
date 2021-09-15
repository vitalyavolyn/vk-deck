import * as React from 'react'
import { render } from 'react-dom'
import { App } from './App'
import { StrictMode } from 'react'
import { ConfigProvider, AdaptivityProvider } from '@mntm/vkui'
import './styles.css'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from '../locales/ru.yml'

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    resources: { ru }
  })

render(
  <StrictMode>
    <ConfigProvider>
      <AdaptivityProvider>
        <App />
      </AdaptivityProvider>
    </ConfigProvider>
  </StrictMode>,
  document.querySelector('#app')
)
