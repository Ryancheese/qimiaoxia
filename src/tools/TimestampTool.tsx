import { useEffect, useState } from 'react'
import { CopyButton } from '../components/CopyButton'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatLocal(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function TimestampTool() {
  const [now, setNow] = useState(Date.now())
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)))
  const [dateStr, setDateStr] = useState(formatLocal(new Date()))
  const [fromTs, setFromTs] = useState('')
  const [fromDate, setFromDate] = useState('')

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  function convertTs() {
    const n = Number(ts.trim())
    if (!Number.isFinite(n)) {
      setFromTs('无效时间戳')
      return
    }
    const ms = String(Math.trunc(n)).length >= 13 ? n : n * 1000
    setFromTs(formatLocal(new Date(ms)))
  }

  function convertDate() {
    const d = new Date(dateStr.replace(/-/g, '/'))
    if (Number.isNaN(d.getTime())) {
      setFromDate('无效日期')
      return
    }
    setFromDate(`${Math.floor(d.getTime() / 1000)} 秒 / ${d.getTime()} 毫秒`)
  }

  return (
    <div className="tool-stack">
      <div className="stat-card">
        <p className="hint">当前时间</p>
        <p className="stat-value">{formatLocal(new Date(now))}</p>
        <p className="hint">
          {Math.floor(now / 1000)} 秒 · {now} 毫秒
        </p>
        <CopyButton text={String(Math.floor(now / 1000))} label="复制秒戳" />
      </div>

      <label className="field">
        <span>时间戳 → 日期</span>
        <input value={ts} onChange={(e) => setTs(e.target.value)} inputMode="numeric" />
      </label>
      <button type="button" className="btn-primary btn-sm" onClick={convertTs}>
        转换
      </button>
      {fromTs ? <pre className="tool-pre">{fromTs}</pre> : null}

      <label className="field">
        <span>日期 → 时间戳（YYYY-MM-DD HH:mm:ss）</span>
        <input value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
      </label>
      <button type="button" className="btn-ghost btn-sm" onClick={convertDate}>
        转换
      </button>
      {fromDate ? <pre className="tool-pre">{fromDate}</pre> : null}
    </div>
  )
}
