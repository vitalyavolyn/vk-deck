import React, { useState } from 'react'
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  Panel,
  PanelHeader,
  SplitCol,
  SplitLayout,
  useAdaptivity,
  View,
  ViewWidth
} from '@vkontakte/vkui'

enum AppScheme {
  light = 'bright_light',
  dark = 'space_gray'
}

export function App (): JSX.Element {
  const { viewWidth } = useAdaptivity()

  const darkThemeMatch = window.matchMedia('(prefers-color-scheme: dark)')
  const getThemeByMediaQuery = (mq: MediaQueryList | MediaQueryListEvent): AppScheme => (
    mq.matches ? AppScheme.dark : AppScheme.light
  )

  const [scheme, setScheme] = useState<AppScheme>(getThemeByMediaQuery(darkThemeMatch))

  darkThemeMatch.addEventListener('change', (e) => {
    setScheme(getThemeByMediaQuery(e))
  })

  return (
    <ConfigProvider scheme={scheme}>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout header={<PanelHeader separator={false} />}>
            <SplitCol spaced={(viewWidth || ViewWidth.DESKTOP) > ViewWidth.MOBILE}>
              <View activePanel="main">
                <Panel id="main">
                  <PanelHeader>VK Deck</PanelHeader>
                  <div></div>
                </Panel>
              </View>
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>

  )
}
