import { useEffect, useRef, useState } from 'react'

type Mode = 'focus' | 'break'

export function Pomodoro() {
  const [focusMin, setFocusMin] = useState(25)
  const [breakMin, setBreakMin] = useState(5)
  const [mode, setMode] = useState<Mode>('focus')
  const [left, setLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const endAt = useRef<number | null>(null)
  const modeRef = useRef(mode)
  const focusRef = useRef(focusMin)
  const breakRef = useRef(breakMin)

  modeRef.current = mode
  focusRef.current = focusMin
  breakRef.current = breakMin

  useEffect(() => {
    if (!running) {
      endAt.current = null
      return
    }
    endAt.current = Date.now() + left * 1000
    const id = window.setInterval(() => {
      if (!endAt.current) return
      const remain = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000))
      setLeft(remain)
      if (remain <= 0) {
        setRunning(false)
        endAt.current = null
        try {
          const ctx = new AudioContext()
          const o = ctx.createOscillator()
          const g = ctx.createGain()
          o.connect(g)
          g.connect(ctx.destination)
          o.frequency.value = 880
          g.gain.value = 0.05
          o.start()
          o.stop(ctx.currentTime + 0.25)
        } catch {
          /* ignore */
        }
        const next: Mode = modeRef.current === 'focus' ? 'break' : 'focus'
        setMode(next)
        setLeft((next === 'focus' ? focusRef.current : breakRef.current) * 60)
      }
    }, 250)
    return () => window.clearInterval(id)
    // only re-run when running toggles
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  function reset(to: Mode = mode) {
    setRunning(false)
    endAt.current = null
    setMode(to)
    setLeft((to === 'focus' ? focusMin : breakMin) * 60)
  }

  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')
  const total = (mode === 'focus' ? focusMin : breakMin) * 60
  const progress = total ? 1 - left / total : 0

  return (
    <div className="tool-stack center-stack">
      <div className="timer-ring" style={{ ['--p' as string]: String(progress) }}>
        <div className="timer-inner">
          <p className="hint">{mode === 'focus' ? '专注中' : '休息中'}</p>
          <p className="timer-digits">
            {mm}:{ss}
          </p>
        </div>
      </div>
      <div className="tool-actions center">
        <button type="button" className="btn-primary" onClick={() => setRunning((v) => !v)}>
          {running ? '暂停' : '开始'}
        </button>
        <button type="button" className="btn-ghost" onClick={() => reset()}>
          重置
        </button>
      </div>
      <div className="split-2">
        <label className="field">
          <span>专注（分钟）</span>
          <input
            type="number"
            min={1}
            max={90}
            value={focusMin}
            disabled={running}
            onChange={(e) => {
              const v = Number(e.target.value)
              setFocusMin(v)
              if (mode === 'focus' && !running) setLeft(v * 60)
            }}
          />
        </label>
        <label className="field">
          <span>休息（分钟）</span>
          <input
            type="number"
            min={1}
            max={30}
            value={breakMin}
            disabled={running}
            onChange={(e) => {
              const v = Number(e.target.value)
              setBreakMin(v)
              if (mode === 'break' && !running) setLeft(v * 60)
            }}
          />
        </label>
      </div>
    </div>
  )
}
