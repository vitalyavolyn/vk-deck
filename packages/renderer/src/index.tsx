import * as React from 'react'
import { render } from 'react-dom'
import { App } from './App'
import { StrictMode } from 'react'
import { ConfigProvider, AdaptivityProvider } from '@mntm/vkui'
// import './styles.css'

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
