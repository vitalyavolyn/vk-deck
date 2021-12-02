import { FC, HTMLAttributes } from 'react'
import {
  GroupsGroupFull,
  NewsfeedItemWallpost,
  UsersUserFull,
} from '@vkontakte/api-schema-typescript'
import useVirtual from 'react-cool-virtual'
import { WallPost } from './wall-post'

interface VirtualScrollWallProps extends HTMLAttributes<HTMLDivElement> {
  items: NewsfeedItemWallpost[]
  groups: GroupsGroupFull[]
  profiles: UsersUserFull[]
}

export const VirtualScrollWall: FC<VirtualScrollWallProps> = ({
  items,
  profiles,
  groups,
  ...rest
}) => {
  const {
    outerRef,
    innerRef,
    items: scrollItems,
  } = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: items.length,
    itemSize: 80,
  })

  return (
    <div {...rest} ref={outerRef}>
      <div ref={innerRef}>
        {scrollItems.map(({ index, measureRef }) => {
          const data = items[index]
          return (
            <WallPost
              key={`${data.source_id}_${data.source_id}`}
              data={items[index]}
              groups={groups}
              profiles={profiles}
              measureRef={measureRef}
            />
          )
        })}
      </div>
    </div>
  )
}
