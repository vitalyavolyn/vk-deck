import { FC, MouseEvent, useState } from 'react'
import {
  Group,
  Panel,
  PanelSpinner, Placeholder,
  Root,
  SplitCol,
  SplitLayout,
  useAdaptivity,
  View,
  ViewWidth,
} from '@vkontakte/vkui'
import {
  Icon28ClipOutline,
  Icon28MessageOutline,
  Icon28ServicesOutline,
  Icon28UserCircleOutline,
  Icon56NewsfeedOutline,
} from '@vkontakte/icons'
import { observer } from 'mobx-react-lite'
import { Navbar } from '../components/navbar'

export const Dashboard: FC = observer(() => {
  const { viewWidth } = useAdaptivity()
  const [activeStory, setActiveStory] = useState('profile')

  if (!viewWidth) return <PanelSpinner />

  const onColumnClick = (e: MouseEvent<HTMLElement>) => setActiveStory(e.currentTarget.dataset.story!)
  const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET

  return (
    <SplitLayout
      style={{ justifyContent: 'center' }}
    >
      <SplitCol fixed width="76px" maxWidth="76px">
        <Navbar onColumnClick={onColumnClick} />
      </SplitCol>

      <SplitCol
        spaced={isDesktop}
      >
        <Root activeView={activeStory}>
          <View id="feed" activePanel="feed">
            <Panel id="feed">
              <Group separator="hide">
                <Placeholder icon={<Icon56NewsfeedOutline width={56} height={56} />} />
              </Group>
            </Panel>
          </View>
          <View id="services" activePanel="services">
            <Panel id="services">
              <Group separator="hide">
                <Placeholder icon={<Icon28ServicesOutline width={56} height={56} />} />
              </Group>
            </Panel>
          </View>
          <View id="messages" activePanel="messages">
            <Panel id="messages">
              <Group separator="hide">
                <Placeholder icon={<Icon28MessageOutline width={56} height={56} />} />
              </Group>
            </Panel>
          </View>
          <View id="clips" activePanel="clips">
            <Panel id="clips">
              <Group separator="hide">
                <Placeholder icon={<Icon28ClipOutline width={56} height={56} />} />
              </Group>
            </Panel>
          </View>
          <View id="profile" activePanel="profile">
            <Panel id="profile">
              <Group separator="hide">
                <Placeholder icon={<Icon28UserCircleOutline width={56} height={56} />} />
              </Group>
            </Panel>
          </View>
        </Root>
      </SplitCol>
    </SplitLayout>
  )
})
