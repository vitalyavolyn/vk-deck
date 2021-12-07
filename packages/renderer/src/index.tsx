import { StrictMode } from 'react'
import i18next from 'i18next'
import { configure } from 'mobx'
import { render } from 'react-dom'
import { initReactI18next } from 'react-i18next'
import { App } from '@/app'
import ru from '@/locales/ru.yml'
import { StoreContext } from '@/store-context'
import { RootStore } from '@/store/root-store'

import './global.css'

configure({ enforceActions: 'never' })

i18next.use(initReactI18next).init({
  fallbackLng: 'ru',
  resources: { ru },
  debug: true,
})

render(
  <StrictMode>
    <StoreContext.Provider value={new RootStore()}>
      <App />
    </StoreContext.Provider>
  </StrictMode>,
  document.querySelector('#app'),
)
