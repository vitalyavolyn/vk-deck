import { FC, HTMLAttributes, MutableRefObject, useEffect } from 'react'
import {
  GroupsGroupFull,
  NewsfeedItemWallpost,
  UsersUserFull,
} from '@vkontakte/api-schema-typescript'
import useVirtual, { ScrollTo } from 'react-cool-virtual'
import { WallPost } from './wall-post'

interface VirtualScrollWallProps extends HTMLAttributes<HTMLDivElement> {
  items: NewsfeedItemWallpost[]
  groups: GroupsGroupFull[]
  profiles: UsersUserFull[]
  scrollToRef?: MutableRefObject<ScrollTo | null>
  rootRef?: MutableRefObject<HTMLDivElement | null>
}

export const VirtualScrollWall: FC<VirtualScrollWallProps> = ({
  items,
  profiles,
  groups,
  scrollToRef,
  rootRef,
  ...rest
}) => {
  const {
    outerRef,
    innerRef,
    items: scrollItems,
    scrollTo,
  } = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: items.length,
    itemSize: 80,
  })

  useEffect(() => {
    if (scrollToRef) {
      scrollToRef.current = scrollTo
    }
  }, [])

  return (
    <div
      {...rest}
      ref={(el) => {
        if (outerRef) outerRef.current = el
        if (rootRef) rootRef.current = el
      }}
    >
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
