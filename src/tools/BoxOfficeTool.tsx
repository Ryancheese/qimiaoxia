import { useCallback, useEffect, useState } from 'react'

interface MovieItem {
  rank?: number
  maoyan_id?: number
  movie_name?: string
  release_year?: string
  box_office_desc?: string
  box_office?: number
}

export function BoxOfficeTool() {
  const [list, setList] = useState<MovieItem[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('https://60s.viki.moe/v2/maoyan')
      if (!res.ok) throw new Error(`请求失败 ${res.status}`)
      const json = (await res.json()) as {
        code?: number
        data?: { list?: MovieItem[] }
        message?: string
      }
      const rows = json.data?.list ?? []
      if (json.code !== 200 || rows.length === 0) {
        throw new Error(json.message || '未获取到票房数据')
      }
      setList(rows)
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
        <span className="hint">猫眼影史票房榜</span>
        <button type="button" className="btn-ghost btn-sm" disabled={busy} onClick={() => void load()}>
          {busy ? '刷新中…' : '刷新'}
        </button>
      </div>
      {error ? <p className="tool-error">{error}</p> : null}
      <ol className="weather-rank-list">
        {list.slice(0, 20).map((item, index) => (
          <li key={`${item.maoyan_id ?? item.movie_name}-${index}`} className="weather-rank-item">
            <span className="weather-rank-no">{item.rank ?? index + 1}</span>
            <div className="weather-rank-main">
              <strong>{item.movie_name || '未知影片'}</strong>
              <span className="hint">{item.release_year ? `${item.release_year} 年` : '年份未知'}</span>
            </div>
            <span className="box-office-value">{item.box_office_desc || '—'}</span>
          </li>
        ))}
      </ol>
      {busy && list.length === 0 ? <p className="hint">加载中…</p> : null}
    </div>
  )
}
