import { FC, HTMLAttributes } from 'react'

import './dropdown-menu-item.css'

type DropdownMenuItemProps = HTMLAttributes<HTMLDivElement>

export const DropdownMenuItem: FC<DropdownMenuItemProps> = ({ children, ...restProps }) => (
  <div className="dropdown-menu-item" {...restProps}>
    {children}
  </div>
)
