import { FC, HTMLAttributes, MutableRefObject, useEffect } from 'react'
import { WallWallpostFull } from '@vkontakte/api-schema-typescript'
import useVirtual, { LoadMore, OnScroll, ScrollTo } from 'react-cool-virtual'
import { WallPost } from './wall-post'

interface VirtualScrollWallProps extends Pick<HTMLAttributes<HTMLDivElement>, 'className'> {
  items: WallWallpostFull[]
  scrollToRef?: MutableRefObject<ScrollTo | null>
  onScroll?: OnScroll
  loadMore?: LoadMore
}

export const VirtualScrollWall: FC<VirtualScrollWallProps> = ({
  items,
  scrollToRef,
  onScroll,
  loadMore,
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
    loadMoreCount: 20,
    onScroll,
    loadMore,
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
              key={`${data.owner_id}_${data.id}`}
              data={items[index]}
              measureRef={measureRef}
            />
          )
        })}
      </div>
    </div>
  )
}
