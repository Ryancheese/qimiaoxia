import { useMemo, useState } from 'react'
import { CopyButton } from '../components/CopyButton'

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUM = '0123456789'
const SYM = '!@#$%^&*-_=+?'

function randomPassword(len: number, pool: string) {
  const arr = new Uint32Array(len)
  crypto.getRandomValues(arr)
  return Array.from(arr, (n) => pool[n % pool.length]).join('')
}

export function PasswordTool() {
  const [len, setLen] = useState(16)
  const [lower, setLower] = useState(true)
  const [upper, setUpper] = useState(true)
  const [num, setNum] = useState(true)
  const [sym, setSym] = useState(false)
  const [pwd, setPwd] = useState('')

  const pool = useMemo(() => {
    return `${lower ? LOWER : ''}${upper ? UPPER : ''}${num ? NUM : ''}${sym ? SYM : ''}`
  }, [lower, upper, num, sym])

  function generate() {
    if (!pool) return
    setPwd(randomPassword(Math.min(64, Math.max(4, len)), pool))
  }

  return (
    <div className="tool-stack">
      <label className="field">
        <span>长度：{len}</span>
        <input type="range" min={4} max={64} value={len} onChange={(e) => setLen(Number(e.target.value))} />
      </label>
      <div className="check-grid">
        <label>
          <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} /> 小写
        </label>
        <label>
          <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> 大写
        </label>
        <label>
          <input type="checkbox" checked={num} onChange={(e) => setNum(e.target.checked)} /> 数字
        </label>
        <label>
          <input type="checkbox" checked={sym} onChange={(e) => setSym(e.target.checked)} /> 符号
        </label>
      </div>
      <button type="button" className="btn-primary" onClick={generate} disabled={!pool}>
        生成密码
      </button>
      {pwd ? (
        <div className="stat-card">
          <p className="mono-lg break-all">{pwd}</p>
          <CopyButton text={pwd} />
        </div>
      ) : null}
    </div>
  )
}
