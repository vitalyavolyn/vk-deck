import { FC } from 'react'

import './columns.css'

export const Columns: FC = () => {
  return (
    <div className="columns">
      <div className="column" style={{ backgroundColor: 'red' }} />
      <div className="column" style={{ backgroundColor: 'green' }} />
      <div className="column" style={{ backgroundColor: 'blue' }} />
      <div className="column" style={{ backgroundColor: 'orange' }} />
      <div className="column" style={{ backgroundColor: 'violet' }} />
      <div className="column" style={{ backgroundColor: 'indigo' }} />
      <div className="column" style={{ backgroundColor: 'indianred' }} />
      <div className="column" style={{ backgroundColor: 'firebrick' }} />
    </div>
  )
}
