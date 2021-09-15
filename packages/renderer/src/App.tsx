import {
  AppRoot,
  Group,
  Header,
  Panel,
  PanelHeader,
  SimpleCell,
  SplitCol,
  SplitLayout,
  useAdaptivity,
  View,
  ViewWidth
} from '@mntm/vkui'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

export function App (): JSX.Element {
  const { viewWidth } = useAdaptivity()
  const { t } = useTranslation()

  return (
    <AppRoot>
      <SplitLayout header={<PanelHeader separator={false} />}>
        <SplitCol spaced={(viewWidth || ViewWidth.DESKTOP) > ViewWidth.MOBILE}>
          <View activePanel="main">
            <Panel id="main">
              <PanelHeader>VKUI</PanelHeader>
              <Group header={<Header mode="secondary">Items</Header>}>
                <SimpleCell>Hello</SimpleCell>
                <SimpleCell>World</SimpleCell>
              </Group>
              {t('test')}
            </Panel>
          </View>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  )
}
