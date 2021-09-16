import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { ConfigProvider, AdaptivityProvider } from '@vkontakte/vkui'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from '../locales/ru.yml'
import { App } from './App'
import './styles.css'

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
