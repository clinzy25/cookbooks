import { MouseEvent, useEffect, RefObject } from 'react'

export const useOutsideAlerter = (ref: RefObject<HTMLElement>, task: () => void) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent<HTMLElement>) => {
      const isOutside = ref?.current && !ref?.current?.contains(e.target as Node)
      if (isOutside) {
        e.stopPropagation()
        task()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, task])
}
