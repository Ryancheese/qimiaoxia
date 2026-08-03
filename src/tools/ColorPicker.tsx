import { useMemo, useState } from 'react'
import { CopyButton } from '../components/CopyButton'

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0'))
      .join('')
  )
}

export function ColorPicker() {
  const [hex, setHex] = useState('#c8f542')
  const rgb = useMemo(() => hexToRgb(hex), [hex])
  const [r, setR] = useState(rgb.r)
  const [g, setG] = useState(rgb.g)
  const [b, setB] = useState(rgb.b)

  function onHex(v: string) {
    setHex(v)
    const next = hexToRgb(v)
    setR(next.r)
    setG(next.g)
    setB(next.b)
  }

  function onRgb(nr: number, ng: number, nb: number) {
    setR(nr)
    setG(ng)
    setB(nb)
    setHex(rgbToHex(nr, ng, nb))
  }

  return (
    <div className="tool-stack">
      <div className="color-preview" style={{ background: hex }} />
      <label className="field">
        <span>取色</span>
        <input type="color" value={hex} onChange={(e) => onHex(e.target.value)} />
      </label>
      <label className="field">
        <span>HEX</span>
        <div className="inline-row">
          <input value={hex} onChange={(e) => onHex(e.target.value)} />
          <CopyButton text={hex} />
        </div>
      </label>
      <label className="field">
        <span>R {r}</span>
        <input type="range" min={0} max={255} value={r} onChange={(e) => onRgb(Number(e.target.value), g, b)} />
      </label>
      <label className="field">
        <span>G {g}</span>
        <input type="range" min={0} max={255} value={g} onChange={(e) => onRgb(r, Number(e.target.value), b)} />
      </label>
      <label className="field">
        <span>B {b}</span>
        <input type="range" min={0} max={255} value={b} onChange={(e) => onRgb(r, g, Number(e.target.value))} />
      </label>
      <CopyButton text={`rgb(${r}, ${g}, ${b})`} label="复制 RGB" />
    </div>
  )
}
