import { useRef, useState } from 'react'
import { OnScroll, ScrollTo } from 'react-cool-virtual'

export const useScrollToTop = () => {
  const scrollToRef = useRef<ScrollTo | null>(null)
  const [canScroll, setCanScroll] = useState(false)

  const triggerScroll = () => {
    if (scrollToRef.current) {
      scrollToRef.current({ offset: 0, smooth: true })
    }
  }

  const onScroll: OnScroll = (e) => {
    setCanScroll(e.scrollOffset > 0)
  }

  return {
    canScroll,
    onScroll,
    triggerScroll,
    scrollToRef,
  }
}
