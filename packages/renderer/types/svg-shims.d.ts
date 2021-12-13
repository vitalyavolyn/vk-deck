// @svgr/rollup
declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: string
  export default content

  export const ReactComponent: FC<SVGProps<SVGElement>>
}
