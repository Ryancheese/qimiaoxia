import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const DEFAULT_TEXT = 'Ryan 的工具箱'

export function LedBanner() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [color, setColor] = useState('#5ac8fa')
  const [speed, setSpeed] = useState(8)
  const [fullscreen, setFullscreen] = useState(false)

  const displayText = text.trim() || DEFAULT_TEXT
  const duration = `${Math.max(2, 22 - speed)}s`

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [fullscreen])

  const fullscreenView = (
    <button
      type="button"
      className="led-fullscreen"
      onClick={() => setFullscreen(false)}
      aria-label="退出全屏"
    >
      <div className="led-fullscreen-track">
        <span
          className="led-marquee led-marquee-full"
          style={{ color, animationDuration: duration }}
        >
          {displayText}
        </span>
      </div>
      <small>点按退出</small>
    </button>
  )

  return (
    <>
      <div className="tool-stack">
        <label className="field">
          <span>弹幕文字</span>
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={40} />
        </label>
        <label className="field">
          <span>颜色</span>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label className="field">
          <span>速度 {speed}</span>
          <input
            type="range"
            min={1}
            max={20}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </label>
        <div className="led-preview">
          <span className="led-marquee" style={{ color, animationDuration: duration }}>
            {displayText}
          </span>
        </div>
        <button type="button" className="btn-primary" onClick={() => setFullscreen(true)}>
          全屏手持展示
        </button>
        <p className="hint">横屏效果更好，点屏幕可退出全屏。</p>
      </div>

      {fullscreen ? createPortal(fullscreenView, document.body) : null}
    </>
  )
}
