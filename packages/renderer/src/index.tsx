import { StrictMode } from 'react'
import { render } from 'react-dom'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from '../locales/ru.yml'
import { App } from './app'
import { ApiStore } from './api-store'
import './styles.css'
import { StoreContext } from './store-context'

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    resources: { ru }
  })

render(
  <StrictMode>
    <StoreContext.Provider value={new ApiStore()}>
      <App />
    </StoreContext.Provider>
  </StrictMode>,
  document.querySelector('#app')
)
