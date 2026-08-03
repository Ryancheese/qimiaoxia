import { useEffect, useRef, useState } from 'react'

export function Ruler() {
  const [dpi, setDpi] = useState(96)
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm')
  const ref = useRef<HTMLDivElement>(null)
  const [heightPx, setHeightPx] = useState(400)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setHeightPx(el.clientHeight))
    ro.observe(el)
    setHeightPx(el.clientHeight)
    return () => ro.disconnect()
  }, [])

  const pxPerUnit = unit === 'cm' ? dpi / 2.54 : dpi
  const marks = Math.floor(heightPx / pxPerUnit)

  return (
    <div className="tool-stack">
      <p className="hint">先校准：用实物信用卡短边（约 5.4cm）对齐下方刻度，拖动校准滑条。</p>
      <label className="field">
        <span>DPI 校准：{dpi}</span>
        <input type="range" min={72} max={260} value={dpi} onChange={(e) => setDpi(Number(e.target.value))} />
      </label>
      <div className="chip-row">
        <button type="button" className={unit === 'cm' ? 'chip is-on' : 'chip'} onClick={() => setUnit('cm')}>
          厘米
        </button>
        <button type="button" className={unit === 'inch' ? 'chip is-on' : 'chip'} onClick={() => setUnit('inch')}>
          英寸
        </button>
      </div>
      <div className="ruler-track" ref={ref}>
        {Array.from({ length: marks + 1 }, (_, i) => (
          <div key={i} className="ruler-mark" style={{ top: i * pxPerUnit }}>
            <span className={i % 5 === 0 ? 'major' : ''}>{i % 5 === 0 ? i : ''}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
