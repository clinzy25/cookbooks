/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Size } from '@/types/@types.utils'
import { MouseEvent, useEffect, RefObject, useState } from 'react'

export const useOutsideAlerter = (ref: RefObject<HTMLElement>, task: () => void) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent<HTMLElement>) => {
      const isOutside =
        ref?.current &&
        !ref?.current?.contains(e.target as Node) &&
        // @ts-ignore
        !(e.target.className === 'avatar') &&
        // @ts-ignore
        !(e.target.id === 'add-recipe-btn') &&
        // svg inside add-recipe-btn
        // @ts-ignore
        !(e.target.d === 'M854.6 288.6L639.4 73.4c…-4.4-3.6-8-8-8H544V472z')

      if (isOutside) {
        e.stopPropagation()
        task()
      }
    }
    // @ts-ignore
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // @ts-ignore
      document.removeEventListener('mousedown', handleClickOutside)
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
