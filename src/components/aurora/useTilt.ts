import { useEffect, type RefObject } from 'react'

/**
 * Tilt 3D + brilho especular num "palco" (container com perspective).
 * Só ativa em `pointer: fine` e sem prefers-reduced-motion; reseta no leave.
 */
export function useTilt(
  stageRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  { baseX = 7, rangeX = 9, rangeY = 7 }: { baseX?: number; rangeX?: number; rangeY?: number } = {},
) {
  useEffect(() => {
    const stage = stageRef.current, target = targetRef.current
    if (!stage || !target) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const move = (e: PointerEvent) => {
      const b = stage.getBoundingClientRect()
      const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height
      target.style.transform = `rotateX(${baseX - y * rangeX}deg) rotateY(${(x - 0.5) * rangeY}deg)`
      target.style.setProperty('--gx', `${x * 100}%`)
      target.style.setProperty('--gy', `${y * 100}%`)
    }
    const leave = () => { target.style.transform = `rotateX(${baseX}deg)` }
    stage.addEventListener('pointermove', move, { passive: true })
    stage.addEventListener('pointerleave', leave, { passive: true })
    return () => {
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerleave', leave)
    }
  }, [stageRef, targetRef, baseX, rangeX, rangeY])
}
