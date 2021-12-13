import { FC, ReactElement, useState } from 'react'
import { Dropdown } from '@vkontakte/vkui/unstable'

import './dropdown-menu.css'

interface DropdownMenuProps {
  items: (JSX.Element | false)[]
  children: ReactElement
}

export const DropdownMenu: FC<DropdownMenuProps> = ({ items, children }) => {
  const [isShown, setIsShown] = useState(false)

  return (
    <Dropdown
      shown={isShown}
      onShownChange={setIsShown}
      // @ts-ignore: VKUI не расширяют HTMLAttriblutes<HTMLDivElement>, но по факту работает
      // Пытался "запатчить" файлом d.ts, не получилось
      className="dropdown-menu-popper"
      content={
        <div
          onClick={() => {
            setIsShown(false)
          }}
          className="dropdown-menu"
        >
          {items}
        </div>
      }
    >
      {children}
    </Dropdown>
  )
}
