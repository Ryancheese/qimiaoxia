import { useEffect, useMemo, useState, type FormEvent } from 'react'

interface DayItem {
  id: string
  title: string
  date: string
}

const KEY = 'qimiaoxia-anniv'

function daysBetween(a: Date, b: Date) {
  const ms = 24 * 60 * 60 * 1000
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((ub - ua) / ms)
}

export function Anniversary() {
  const [items, setItems] = useState<DayItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]') as DayItem[]
    } catch {
      return []
    }
  })
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  const view = useMemo(() => {
    const today = new Date()
    return items
      .map((it) => {
        const d = new Date(it.date.replace(/-/g, '/'))
        const diff = daysBetween(d, today)
        return { ...it, diff }
      })
      .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))
  }, [items])

  function add(e: FormEvent) {
    e.preventDefault()
    if (!title.trim() || !date) return
    setItems((prev) => [{ id: crypto.randomUUID(), title: title.trim(), date }, ...prev])
    setTitle('')
  }

  return (
    <div className="tool-stack">
      <form className="todo-form" onSubmit={add}>
        <input className="tool-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="纪念日名称" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="submit" className="btn-primary btn-sm">
          添加
        </button>
      </form>
      <ul className="anniv-list">
        {view.map((it) => (
          <li key={it.id}>
            <div>
              <strong>{it.title}</strong>
              <p className="hint">{it.date}</p>
            </div>
            <div className="anniv-diff">
              {it.diff === 0 ? '就是今天' : it.diff > 0 ? `已过 ${it.diff} 天` : `还有 ${-it.diff} 天`}
              <button
                type="button"
                className="link-btn"
                onClick={() => setItems((prev) => prev.filter((x) => x.id !== it.id))}
              >
                删除
              </button>
            </div>
          </li>
        ))}
      </ul>
      {view.length === 0 ? <p className="empty-state">还没有纪念日</p> : null}
    </div>
  )
}
