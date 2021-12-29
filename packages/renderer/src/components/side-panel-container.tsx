import { FC } from 'react'
import { AddColumnSidePanel } from './side-panels/add-column-side-panel'
import { ComposeSidePanel } from './side-panels/compose-side-panel'
import { SettingsSidePanel } from './side-panels/settings-side-panel'

import './side-panel-container.css'

const sidePanels = {
  compose: ComposeSidePanel,
  settings: SettingsSidePanel,
  'add-column': AddColumnSidePanel,
}

export type SidePanelName = keyof typeof sidePanels // lmao

interface SidePanelContainerProps {
  sidePanel?: SidePanelName
  closeSidePanel(): void
}

export interface SidePanelProps {
  closeSidePanel(): void
}

export const SidePanelContainer: FC<SidePanelContainerProps> = ({ sidePanel, closeSidePanel }) => {
  const Component = sidePanel ? sidePanels[sidePanel] : undefined

  return (
    <div className="side-panel-container">
      {Component && <Component closeSidePanel={closeSidePanel} />}
    </div>
  )
}
