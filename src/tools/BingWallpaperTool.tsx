import { useCallback, useEffect, useState } from 'react'
import { CopyButton } from '../components/CopyButton'

interface BingData {
  title?: string
  headline?: string
  description?: string
  main_text?: string
  cover?: string
  cover_4k?: string
  copyright?: string
}

export function BingWallpaperTool() {
  const [data, setData] = useState<BingData | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('https://60s.viki.moe/v2/bing')
      if (!res.ok) throw new Error(`请求失败 ${res.status}`)
      const json = (await res.json()) as { code?: number; data?: BingData; message?: string }
      if (json.code !== 200 || !json.data?.cover) {
        throw new Error(json.message || '未获取到壁纸')
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

  const title = data?.title || data?.headline || data?.main_text || '今日必应壁纸'
  const image = data?.cover_4k || data?.cover || ''

  return (
    <div className="tool-stack">
      <p className="hint">今日 Bing 壁纸</p>
      {error ? <p className="tool-error">{error}</p> : null}
      {image ? (
        <>
          <div className="wallpaper-preview">
            <img src={image} alt={title} loading="lazy" />
          </div>
          <strong>{title}</strong>
          {data?.copyright ? <p className="hint">{data.copyright}</p> : null}
          {data?.description && data.description !== title ? (
            <p className="hint">{data.description}</p>
          ) : null}
          <div className="tool-actions">
            <a className="btn-primary btn-sm" href={image} target="_blank" rel="noreferrer">
              打开原图
            </a>
            {data?.cover_4k ? (
              <a className="btn-ghost btn-sm" href={data.cover_4k} target="_blank" rel="noreferrer">
                4K
              </a>
            ) : null}
            <CopyButton text={image} label="复制链接" />
            <button type="button" className="btn-ghost btn-sm" disabled={busy} onClick={() => void load()}>
              {busy ? '刷新中…' : '刷新'}
            </button>
          </div>
        </>
      ) : (
        <p className="hint">{busy ? '加载中…' : '暂无壁纸'}</p>
      )}
    </div>
  )
}
