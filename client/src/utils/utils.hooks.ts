import { Size } from '@/types/@types.utils'
import { MouseEvent, useEffect, RefObject, useState } from 'react'

export const useOutsideAlerter = (ref: RefObject<HTMLElement>, task: () => void) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent<HTMLElement>) => {
      const isOutside = ref?.current && !ref?.current?.contains(e.target as Node)
      if (isOutside) {
        e.stopPropagation()
        task()
      }
    }
    document.addEventListener('mousedown', e => handleClickOutside(e))
    return () => {
      document.removeEventListener('mousedown', e => handleClickOutside(e))
    }
  }, [ref, task])
}

export const useWindowSize = (): Size => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined,
  })
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}
