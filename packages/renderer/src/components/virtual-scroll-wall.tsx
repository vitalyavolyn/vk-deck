import { FC, HTMLAttributes, MutableRefObject, useEffect } from 'react'
import {
  GroupsGroupFull,
  NewsfeedItemWallpost,
  UsersUserFull,
} from '@vkontakte/api-schema-typescript'
import useVirtual, { OnScroll, ScrollTo } from 'react-cool-virtual'
import { WallPost } from './wall-post'

interface VirtualScrollWallProps
  extends Pick<HTMLAttributes<HTMLDivElement>, 'className'> {
  items: NewsfeedItemWallpost[]
  groups: GroupsGroupFull[]
  profiles: UsersUserFull[]
  scrollToRef?: MutableRefObject<ScrollTo | null>
  onScroll?: OnScroll
}

export const VirtualScrollWall: FC<VirtualScrollWallProps> = ({
  items,
  profiles,
  groups,
  scrollToRef,
  onScroll,
  ...rest
}) => {
  const {
    outerRef,
    innerRef,
    items: scrollItems,
    scrollTo,
  } = useVirtual<HTMLDivElement>({
    itemCount: items.length,
    itemSize: 80,
    onScroll,
  })

  useEffect(() => {
    if (scrollToRef) {
      scrollToRef.current = scrollTo
    }
  }, [])

  return (
    <div {...rest} ref={outerRef}>
      <div ref={innerRef}>
        {scrollItems.map(({ index, measureRef }) => {
          const data = items[index]
          return (
            <WallPost
              // TODO: почему без index виртуальный скролл ведет себя странно(
              key={`${data.source_id}_${data.post_id}`}
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
