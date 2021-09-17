import { StrictMode } from 'react'
import { render } from 'react-dom'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from '../locales/ru.yml'
import { App } from './App'
import './styles.css'
import { AppWrapper } from './AppWrapper'

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    resources: { ru }
  })

render(
  <StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </StrictMode>,
  document.querySelector('#app')
)
