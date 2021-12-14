import { MutableRefObject, useState } from 'react'
import { OnScroll, ScrollTo } from 'react-cool-virtual'

export const useScrollToTop = (scrollTo: MutableRefObject<ScrollTo | null>) => {
  const [canScroll, setCanScroll] = useState(false)

  const triggerScroll = () => {
    if (scrollTo.current) {
      scrollTo.current({ offset: 0, smooth: true })
    }
  }

  const onScroll: OnScroll = (e) => {
    setCanScroll(e.scrollOffset > 0)
  }

  return {
    canScroll,
    onScroll,
    triggerScroll,
  }
}
