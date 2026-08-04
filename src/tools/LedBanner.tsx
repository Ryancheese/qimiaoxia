import { useEffect, useState } from 'react'

export function LedBanner() {
  const [text, setText] = useState('Ryan 的工具箱')
  const [color, setColor] = useState('#c8f542')
  const [speed, setSpeed] = useState(8)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullscreen])

  if (fullscreen) {
    return (
      <button
        type="button"
        className="led-fullscreen"
        onClick={() => setFullscreen(false)}
        style={{ color, animationDuration: `${Math.max(2, 22 - speed)}s` }}
      >
        <span className="led-marquee">{text || 'Ryan 的工具箱'}</span>
        <small>点按退出</small>
      </button>
    )
  }

  return (
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
      <div className="led-preview" style={{ color }}>
        <span style={{ animationDuration: `${Math.max(2, 22 - speed)}s` }}>{text || 'Ryan 的工具箱'}</span>
      </div>
      <button type="button" className="btn-primary" onClick={() => setFullscreen(true)}>
        全屏手持展示
      </button>
      <p className="hint">横屏效果更好，点屏幕可退出全屏。</p>
    </div>
  )
}
