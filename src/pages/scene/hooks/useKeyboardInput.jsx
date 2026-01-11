import { useState, useEffect, useCallback } from 'react'

export default function useKeyboardInput() {
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
  })

  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase()
    if (key in keys) {
      setKeys(prev => ({ ...prev, [key]: true }))
    }
  }, [keys])

  const handleKeyUp = useCallback((e) => {
    const key = e.key.toLowerCase()
    if (key in keys) {
      setKeys(prev => ({ ...prev, [key]: false }))
    }
  }, [keys])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  return keys
}