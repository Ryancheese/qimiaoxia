import { useCallback, useEffect, useRef, useState } from 'react'
import { Braces, KeyRound, Timer } from 'lucide-react'

interface HeroToolbox3DProps {
  toolCount: number
  onOpenChange?: (open: boolean) => void
}

const DRAG_THRESHOLD = 6

export function HeroToolbox3D({ toolCount, onOpenChange }: HeroToolbox3DProps) {
  const [open, setOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [rotation, setRotation] = useState({ x: -14, y: 32 })
  const [hint, setHint] = useState(true)
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
  })

  const setOpenState = useCallback(
    (next: boolean) => {
      setOpen(next)
      onOpenChange?.(next)
      if (next) setHint(false)
    },
    [onOpenChange],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => setOpenState(true), 700)
    return () => window.clearTimeout(timer)
  }, [setOpenState])

  useEffect(() => {
    if (!hint) return
    const timer = window.setTimeout(() => setHint(false), 4200)
    return () => window.clearTimeout(timer)
  }, [hint])

  const clampRotation = (x: number, y: number) => ({
    x: Math.max(-28, Math.min(8, x)),
    y: ((y % 360) + 360) % 360,
  })

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseX: rotation.x,
      baseY: rotation.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== event.pointerId) return

    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return

    if (!drag.moved) {
      drag.moved = true
      setIsDragging(true)
    }
    setHint(false)
    setRotation(clampRotation(drag.baseX - dy * 0.35, drag.baseY + dx * 0.45))
  }

  const finishPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (drag.pointerId !== event.pointerId) return

    if (drag.active && !drag.moved) {
      setOpenState(!open)
    }

    dragRef.current.active = false
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpenState(!open)
    }
    if (event.key === 'ArrowLeft') {
      setRotation((r) => clampRotation(r.x, r.y - 12))
    }
    if (event.key === 'ArrowRight') {
      setRotation((r) => clampRotation(r.x, r.y + 12))
    }
  }

  return (
    <div className="hero-toolbox-scene">
      <div className="hero-toolbox-shadow" />

      <div
        className={`hero-toolbox-stage${isDragging ? ' is-dragging' : ''}`}
        role="button"
        tabIndex={0}
        aria-pressed={open}
        aria-label={open ? '关闭工具箱，拖拽可旋转视角' : '打开工具箱，拖拽可旋转视角'}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onKeyDown={onKeyDown}
      >
        <div
          className="hero-toolbox-pivot"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          <div className="tb3d">
            <div className="tb3d-body">
              <div className="tb3d-face tb3d-face-front">
                <div className="tb3d-cavity">
                  <div className="tb3d-slots">
                    {[Braces, Timer, KeyRound].map((Icon, i) => (
                      <div key={i} className="tb3d-slot">
                        <Icon size={15} strokeWidth={2.2} />
                      </div>
                    ))}
                  </div>
                  <span className="tb3d-count">{toolCount}+</span>
                </div>
                <div className={`tb3d-latch${open ? ' is-open' : ''}`} aria-hidden="true">
                  <span />
                </div>
              </div>

              <div className="tb3d-face tb3d-face-back" />
              <div className="tb3d-face tb3d-face-left" />
              <div className="tb3d-face tb3d-face-right" />
              <div className="tb3d-face tb3d-face-bottom" />

              <div className={`tb3d-lid${open ? ' is-open' : ''}`}>
                <div className="tb3d-face tb3d-face-lid-top">
                  <div className="tb3d-handle" />
                  <div className="tb3d-lid-stripe" aria-hidden="true" />
                </div>
                <div className="tb3d-face tb3d-face-lid-front" />
                <div className="tb3d-face tb3d-face-lid-back" />
                <div className="tb3d-face tb3d-face-lid-left" />
                <div className="tb3d-face tb3d-face-lid-right" />
              </div>
            </div>
          </div>
        </div>

        {hint && <p className="hero-toolbox-hint">点击开盖 · 拖拽旋转</p>}
      </div>
    </div>
  )
}
