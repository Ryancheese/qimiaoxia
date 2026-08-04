import { useCallback, useEffect, useState } from 'react'
import { CopyButton } from '../components/CopyButton'

interface HitokotoData {
  hitokoto?: string
  from?: string
  from_who?: string | null
}

export function HitokotoTool() {
  const [data, setData] = useState<HitokotoData | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('https://v1.hitokoto.cn/?encode=json&charset=utf-8')
      if (!res.ok) throw new Error(`请求失败 ${res.status}`)
      const json = (await res.json()) as HitokotoData
      if (!json.hitokoto) throw new Error('未获取到内容')
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败')
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const source = [data?.from_who, data?.from].filter(Boolean).join(' · ')

  return (
    <div className="tool-stack">
      <p className="hint">随机一句，来自 Hitokoto</p>
      {error ? <p className="tool-error">{error}</p> : null}
      {data?.hitokoto ? (
        <>
          <pre className="tool-pre poem">{data.hitokoto}</pre>
          {source ? <p className="hint">—— {source}</p> : null}
          <div className="tool-actions">
            <CopyButton text={`${data.hitokoto}${source ? `\n—— ${source}` : ''}`} />
            <button type="button" className="btn-primary btn-sm" disabled={busy} onClick={() => void load()}>
              {busy ? '换一句…' : '换一句'}
            </button>
          </div>
        </>
      ) : (
        <p className="hint">{busy ? '加载中…' : '暂无内容'}</p>
      )}
    </div>
  )
}
