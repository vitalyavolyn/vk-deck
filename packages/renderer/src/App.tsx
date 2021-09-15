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

export function App (): JSX.Element {
  const { viewWidth } = useAdaptivity()

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
              <h1 className="text-[#fd5510]">Hello tailwind</h1>
            </Panel>
          </View>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  )
}
