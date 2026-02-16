import AddButton from './AddButton'
import colorsData from '@/src/utils/colors.json'
import Color from './Color'
import type { ColorType } from '@/types'
import styles from './styles.module.css'
import { useEffect, useState } from 'react'

const Controls = () => {
  const colors: ColorType[] = colorsData
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const noteCanvas = document.getElementById('note-canvas')
    if (!noteCanvas) return

    const handleScroll = () => {
      const currentScrollY = noteCanvas.scrollTop
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHidden(true)
      } else if (currentScrollY < lastScrollY) {
        setIsHidden(false)
      }
      setLastScrollY(currentScrollY)
    }

    noteCanvas.addEventListener('scroll', handleScroll, { passive: true })

    return () => noteCanvas.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <div
      id='controls'
      className={`${styles.controls} ${isHidden ? styles.hidden : ''}`}
    >
      <AddButton />
      {colors.map((color) => (
        <Color
          key={color.id}
          color={color}
        />
      ))}
    </div>
  )
}
export default Controls
