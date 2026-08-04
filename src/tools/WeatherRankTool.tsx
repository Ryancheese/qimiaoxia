import { useCallback, useEffect, useMemo, useState } from 'react'

interface City {
  name: string
  province: string
  lat: number
  lon: number
}

interface WeatherRow {
  name: string
  province: string
  temp: number
  humidity: number
  wind: number
  code: number
  time: string
}

type SortMode = 'hot' | 'cold'

const cities: City[] = [
  { name: '北京', province: '北京', lat: 39.9042, lon: 116.4074 },
  { name: '天津', province: '天津', lat: 39.3434, lon: 117.3616 },
  { name: '上海', province: '上海', lat: 31.2304, lon: 121.4737 },
  { name: '重庆', province: '重庆', lat: 29.563, lon: 106.5516 },
  { name: '石家庄', province: '河北', lat: 38.0428, lon: 114.5149 },
  { name: '太原', province: '山西', lat: 37.8706, lon: 112.5489 },
  { name: '呼和浩特', province: '内蒙古', lat: 40.8429, lon: 111.7492 },
  { name: '沈阳', province: '辽宁', lat: 41.8057, lon: 123.4315 },
  { name: '长春', province: '吉林', lat: 43.8171, lon: 125.3235 },
  { name: '哈尔滨', province: '黑龙江', lat: 45.8038, lon: 126.5349 },
  { name: '南京', province: '江苏', lat: 32.0603, lon: 118.7969 },
  { name: '杭州', province: '浙江', lat: 30.2741, lon: 120.1551 },
  { name: '合肥', province: '安徽', lat: 31.8206, lon: 117.2272 },
  { name: '福州', province: '福建', lat: 26.0745, lon: 119.2965 },
  { name: '南昌', province: '江西', lat: 28.682, lon: 115.8579 },
  { name: '济南', province: '山东', lat: 36.6512, lon: 117.1201 },
  { name: '郑州', province: '河南', lat: 34.7466, lon: 113.6254 },
  { name: '武汉', province: '湖北', lat: 30.5928, lon: 114.3055 },
  { name: '长沙', province: '湖南', lat: 28.2282, lon: 112.9388 },
  { name: '广州', province: '广东', lat: 23.1291, lon: 113.2644 },
  { name: '南宁', province: '广西', lat: 22.817, lon: 108.3669 },
  { name: '海口', province: '海南', lat: 20.044, lon: 110.1999 },
  { name: '成都', province: '四川', lat: 30.5728, lon: 104.0668 },
  { name: '贵阳', province: '贵州', lat: 26.647, lon: 106.6302 },
  { name: '昆明', province: '云南', lat: 25.0389, lon: 102.7183 },
  { name: '拉萨', province: '西藏', lat: 29.6525, lon: 91.1721 },
  { name: '西安', province: '陕西', lat: 34.3416, lon: 108.9398 },
  { name: '兰州', province: '甘肃', lat: 36.0611, lon: 103.8343 },
  { name: '西宁', province: '青海', lat: 36.6171, lon: 101.7782 },
  { name: '银川', province: '宁夏', lat: 38.4872, lon: 106.2309 },
  { name: '乌鲁木齐', province: '新疆', lat: 43.8256, lon: 87.6168 },
  { name: '深圳', province: '广东', lat: 22.5431, lon: 114.0579 },
  { name: '苏州', province: '江苏', lat: 31.2989, lon: 120.5853 },
  { name: '青岛', province: '山东', lat: 36.0671, lon: 120.3826 },
  { name: '大连', province: '辽宁', lat: 38.914, lon: 121.6147 },
  { name: '厦门', province: '福建', lat: 24.4798, lon: 118.0894 },
]

function weatherText(code: number) {
  if (code === 0) return '晴'
  if (code === 1) return '大致晴'
  if (code === 2) return '局部多云'
  if (code === 3) return '阴'
  if (code === 45 || code === 48) return '雾'
  if (code >= 51 && code <= 57) return '毛毛雨'
  if (code >= 61 && code <= 67) return '雨'
  if (code >= 71 && code <= 77) return '雪'
  if (code >= 80 && code <= 82) return '阵雨'
  if (code >= 85 && code <= 86) return '阵雪'
  if (code >= 95 && code <= 99) return '雷暴'
  return '未知'
}

function tempTone(temp: number) {
  if (temp >= 35) return 'hot'
  if (temp >= 28) return 'warm'
  if (temp >= 18) return 'mild'
  if (temp >= 8) return 'cool'
  return 'cold'
}

interface OpenMeteoPoint {
  current?: {
    time?: string
    temperature_2m?: number
    weather_code?: number
    relative_humidity_2m?: number
    wind_speed_10m?: number
  }
}

export function WeatherRankTool() {
  const [rows, setRows] = useState<WeatherRow[]>([])
  const [sort, setSort] = useState<SortMode>('hot')
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')

  const load = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const lats = cities.map((c) => c.lat).join(',')
      const lons = cities.map((c) => c.lon).join(',')
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}` +
        '&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m' +
        '&timezone=Asia%2FShanghai'

      const res = await fetch(url)
      if (!res.ok) throw new Error(`请求失败 ${res.status}`)
      const data = (await res.json()) as OpenMeteoPoint | OpenMeteoPoint[]
      const list = Array.isArray(data) ? data : [data]

      const next: WeatherRow[] = cities.map((city, i) => {
        const cur = list[i]?.current
        return {
          name: city.name,
          province: city.province,
          temp: Number(cur?.temperature_2m ?? NaN),
          humidity: Number(cur?.relative_humidity_2m ?? 0),
          wind: Number(cur?.wind_speed_10m ?? 0),
          code: Number(cur?.weather_code ?? -1),
          time: cur?.time ?? '',
        }
      })

      if (next.every((r) => Number.isNaN(r.temp))) {
        throw new Error('未获取到有效气温数据')
      }

      setRows(next)
      setUpdatedAt(new Date().toLocaleString('zh-CN', { hour12: false }))
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败，请检查网络')
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const ranked = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = rows.filter((r) => {
      if (Number.isNaN(r.temp)) return false
      if (!q) return true
      return `${r.name}${r.province}`.toLowerCase().includes(q)
    })
    return filtered.sort((a, b) => (sort === 'hot' ? b.temp - a.temp : a.temp - b.temp))
  }, [rows, sort, query])

  return (
    <div className="tool-stack">
      <p className="hint">主要城市实时气温排行，数据来自 Open-Meteo</p>

      <div className="chip-row wrap">
        <button
          type="button"
          className={sort === 'hot' ? 'chip is-on' : 'chip'}
          onClick={() => setSort('hot')}
        >
          高温榜
        </button>
        <button
          type="button"
          className={sort === 'cold' ? 'chip is-on' : 'chip'}
          onClick={() => setSort('cold')}
        >
          低温榜
        </button>
        <button type="button" className="chip" disabled={busy} onClick={() => void load()}>
          {busy ? '刷新中…' : '刷新'}
        </button>
      </div>

      <label className="field">
        <span>搜索城市</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="如：杭州 / 浙江"
        />
      </label>

      {updatedAt ? <p className="hint">更新于 {updatedAt}</p> : null}
      {error ? <p className="tool-error">{error}</p> : null}

      {busy && rows.length === 0 ? <p className="hint">正在拉取天气…</p> : null}

      <ol className="weather-rank-list">
        {ranked.map((row, index) => (
          <li key={row.name} className={`weather-rank-item is-${tempTone(row.temp)}`}>
            <span className="weather-rank-no">{index + 1}</span>
            <div className="weather-rank-main">
              <strong>
                {row.name}
                <span className="hint"> · {row.province}</span>
              </strong>
              <span className="hint">
                {weatherText(row.code)} · 湿度 {row.humidity}% · 风 {row.wind.toFixed(0)} km/h
              </span>
            </div>
            <span className="weather-rank-temp">{row.temp.toFixed(1)}°</span>
          </li>
        ))}
      </ol>

      {!busy && !error && ranked.length === 0 ? <p className="hint">没有匹配的城市</p> : null}
    </div>
  )
}
