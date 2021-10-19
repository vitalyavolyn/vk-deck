import { StrictMode } from 'react'
import { render } from 'react-dom'
import i18n from 'i18next'
import { configure } from 'mobx'
import { initReactI18next } from 'react-i18next'
import ru from '@/locales/ru.yml'
import { App } from '@/app'
import { RootStore } from '@/store/root-store'
import { StoreContext } from '@/store-context'

import './global.css'

configure({ enforceActions: 'never' })

i18n.use(initReactI18next).init({
  fallbackLng: 'ru',
  resources: { ru },
})

render(
  <StrictMode>
    <StoreContext.Provider value={new RootStore()}>
      <App />
    </StoreContext.Provider>
  </StrictMode>,
  document.querySelector('#app'),
)
