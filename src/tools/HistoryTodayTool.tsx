import { useCallback, useEffect, useState } from 'react'

interface HistoryItem {
  title?: string
  year?: string
  description?: string
}

interface HistoryData {
  date?: string
  month?: number
  day?: number
  items?: HistoryItem[]
}

export function HistoryTodayTool() {
  const [data, setData] = useState<HistoryData | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('https://60s.viki.moe/v2/today-in-history')
      if (!res.ok) throw new Error(`请求失败 ${res.status}`)
      const json = (await res.json()) as { code?: number; data?: HistoryData; message?: string }
      if (json.code !== 200 || !json.data?.items?.length) {
        throw new Error(json.message || '未获取到历史事件')
      }
      setData(json.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败')
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="tool-stack">
      <div className="tool-actions">
        <span className="hint">
          {data?.month && data?.day ? `${data.month} 月 ${data.day} 日` : '历史上的今天'}
        </span>
        <button type="button" className="btn-ghost btn-sm" disabled={busy} onClick={() => void load()}>
          {busy ? '刷新中…' : '刷新'}
        </button>
      </div>
      {error ? <p className="tool-error">{error}</p> : null}
      <ul className="plain-list history-list">
        {(data?.items ?? []).slice(0, 30).map((item, i) => (
          <li key={`${item.year}-${item.title}-${i}`} className="history-item">
            <strong>
              <span className="history-year">{item.year || '？'}</span>
              {item.title}
            </strong>
            {item.description ? <p className="hint">{item.description}</p> : null}
          </li>
        ))}
      </ul>
      {busy && !data ? <p className="hint">加载中…</p> : null}
    </div>
  )
}
