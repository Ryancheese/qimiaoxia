import { useEffect, useState } from 'react'

export function CallSimulator() {
  const [name, setName] = useState('老板')
  const [active, setActive] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [active])

  if (active) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
    const ss = String(seconds % 60).padStart(2, '0')
    return (
      <div className="call-screen">
        <p className="hint">通话中</p>
        <p className="call-name">{name || '未知来电'}</p>
        <p className="call-timer">
          {mm}:{ss}
        </p>
        <button
          type="button"
          className="call-hang"
          onClick={() => {
            setActive(false)
            setSeconds(0)
          }}
        >
          挂断
        </button>
      </div>
    )
  }

  return (
    <div className="tool-stack">
      <label className="field">
        <span>来电显示名称</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} />
      </label>
      <button
        type="button"
        className="btn-primary"
        onClick={() => {
          setSeconds(0)
          setActive(true)
        }}
      >
        模拟来电
      </button>
      <p className="hint">可用于聚会脱身等场景，请勿用于欺骗或骚扰。</p>
    </div>
  )
}
