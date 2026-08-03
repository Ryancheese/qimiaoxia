import { useEffect, useState } from 'react'

export function IpLookup() {
  const [online, setOnline] = useState(navigator.onLine)
  const [ip, setIp] = useState('查询中…')
  const [ua] = useState(navigator.userAgent)
  const [lang] = useState(navigator.language)
  const [tz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [screenInfo] = useState(`${window.screen.width}×${window.screen.height}`)

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json')
        const data = (await res.json()) as { ip?: string }
        if (!cancelled) setIp(data.ip || '未知')
      } catch {
        if (!cancelled) setIp('无法获取（网络受限）')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="tool-stack">
      <div className="stat-grid">
        <div className="stat-card compact">
          <p className="hint">公网 IP</p>
          <p className="stat-value small">{ip}</p>
        </div>
        <div className="stat-card compact">
          <p className="hint">网络状态</p>
          <p className="stat-value small">{online ? '在线' : '离线'}</p>
        </div>
        <div className="stat-card compact">
          <p className="hint">时区</p>
          <p className="stat-value small">{tz}</p>
        </div>
        <div className="stat-card compact">
          <p className="hint">语言</p>
          <p className="stat-value small">{lang}</p>
        </div>
        <div className="stat-card compact">
          <p className="hint">屏幕</p>
          <p className="stat-value small">{screenInfo}</p>
        </div>
      </div>
      <div className="stat-card">
        <p className="hint">User Agent</p>
        <p className="break-all hint">{ua}</p>
      </div>
    </div>
  )
}
