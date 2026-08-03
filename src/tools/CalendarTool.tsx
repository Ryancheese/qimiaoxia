import { useMemo, useState } from 'react'

const WEEK = ['日', '一', '二', '三', '四', '五', '六']

export function CalendarTool() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const cells = useMemo(() => {
    const first = new Date(year, month, 1)
    const start = first.getDay()
    const days = new Date(year, month + 1, 0).getDate()
    const list: (number | null)[] = []
    for (let i = 0; i < start; i++) list.push(null)
    for (let d = 1; d <= days; d++) list.push(d)
    return list
  }, [year, month])

  function shift(delta: number) {
    const d = new Date(year, month + delta, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
  }

  return (
    <div className="tool-stack">
      <div className="cal-head">
        <button type="button" className="btn-ghost btn-sm" onClick={() => shift(-1)}>
          上月
        </button>
        <h3>
          {year} 年 {month + 1} 月
        </h3>
        <button type="button" className="btn-ghost btn-sm" onClick={() => shift(1)}>
          下月
        </button>
      </div>
      <div className="cal-grid">
        {WEEK.map((w) => (
          <div key={w} className="cal-week">
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          const isToday =
            d === now.getDate() && month === now.getMonth() && year === now.getFullYear()
          return (
            <div key={i} className={isToday ? 'cal-day is-today' : 'cal-day'}>
              {d ?? ''}
            </div>
          )
        })}
      </div>
      <button
        type="button"
        className="btn-ghost btn-sm"
        onClick={() => {
          setYear(now.getFullYear())
          setMonth(now.getMonth())
        }}
      >
        回到今天
      </button>
    </div>
  )
}
