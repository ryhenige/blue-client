import { useState, useEffect, useRef } from 'react'

export default function useKeyboardInput() {
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
  })

  const keysRef = useRef(keys)
  keysRef.current = keys

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      if (key in keysRef.current) {
        setKeys(prev => ({ ...prev, [key]: true }))
      }
    }

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase()
      if (key in keysRef.current) {
        setKeys(prev => ({ ...prev, [key]: false }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keys
}