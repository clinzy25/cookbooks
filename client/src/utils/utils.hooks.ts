import { MouseEvent, useEffect, RefObject, useState } from 'react'

export const useOutsideAlerter = (ref: RefObject<HTMLElement>, task: () => void) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent<HTMLElement>) => {
      if (ref?.current && !ref?.current?.contains(e.target as Node)) {
        e.stopPropagation()
        e.preventDefault()
        task()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, task])
}