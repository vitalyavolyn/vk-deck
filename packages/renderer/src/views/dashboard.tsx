import { FC, MouseEvent, useContext, useState } from 'react'
import {
  Avatar,
  Cell,
  Group,
  Panel,
  PanelSpinner, Placeholder,
  Root,
  SplitCol,
  SplitLayout,
  useAdaptivity,
  View,
  ViewWidth
} from '@vkontakte/vkui'
import {
  Icon28ClipOutline,
  Icon28MessageOutline,
  Icon28NewsfeedOutline,
  Icon28ServicesOutline,
  Icon28UserCircleOutline, Icon56NewsfeedOutline
} from '@vkontakte/icons'
import './dashboard.css'
import { storeContext } from '../store-context'

export const Dashboard: FC = () => {
  const { viewWidth } = useAdaptivity()
  const { user } = useContext(storeContext)
  const [activeStory, setActiveStory] = useState('profile')

  if (!viewWidth) return <PanelSpinner />
  const onStoryChange = (e: MouseEvent<HTMLElement>) => setActiveStory(e.currentTarget.dataset.story!)
  const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET

  return (
    <SplitLayout
      style={{ justifyContent: 'center' }}
    >
      <SplitCol fixed width="76px" maxWidth="76px">
        <Panel id="nav">
          <div className="navBar">
            <Avatar src={user.photo_50} />
            <Cell
              data-story="feed"
              onClick={onStoryChange}
            >
              <Icon28NewsfeedOutline />
            </Cell>
            <Cell
              data-story="services"
              onClick={onStoryChange}
            >
              <Icon28ServicesOutline />
            </Cell>
            <Cell
              data-story="messages"
              onClick={onStoryChange}
            >
              <Icon28MessageOutline />
            </Cell>
            <Cell
              data-story="clips"
              onClick={onStoryChange}
            >
              <Icon28ClipOutline />
            </Cell>
            <Cell
              data-story="profile"
              onClick={onStoryChange}
            >
              <Icon28UserCircleOutline />
            </Cell>
          </div>
        </Panel>
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
                <Placeholder icon={<Icon28ServicesOutline width={56} height={56} />}>
                </Placeholder>
              </Group>
            </Panel>
          </View>
          <View id="messages" activePanel="messages">
            <Panel id="messages">
              <Group separator="hide">
                <Placeholder icon={<Icon28MessageOutline width={56} height={56} />}>
                </Placeholder>
              </Group>
            </Panel>
          </View>
          <View id="clips" activePanel="clips">
            <Panel id="clips">
              <Group separator="hide">
                <Placeholder icon={<Icon28ClipOutline width={56} height={56} />}>
                </Placeholder>
              </Group>
            </Panel>
          </View>
          <View id="profile" activePanel="profile">
            <Panel id="profile">
              <Group separator="hide">
                <Placeholder icon={<Icon28UserCircleOutline width={56} height={56} />}>
                </Placeholder>
              </Group>
            </Panel>
          </View>
        </Root>
      </SplitCol>
    </SplitLayout>
  )
}
