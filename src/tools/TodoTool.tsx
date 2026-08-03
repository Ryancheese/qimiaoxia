import { useEffect, useState, type FormEvent } from 'react'

interface TodoItem {
  id: string
  text: string
  done: boolean
}

const KEY = 'qimiaoxia-todos'

export function TodoTool() {
  const [items, setItems] = useState<TodoItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]') as TodoItem[]
    } catch {
      return []
    }
  })
  const [text, setText] = useState('')

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  function add(e: FormEvent) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setItems((prev) => [{ id: crypto.randomUUID(), text: t, done: false }, ...prev])
    setText('')
  }

  return (
    <div className="tool-stack">
      <form className="todo-form" onSubmit={add}>
        <input
          className="tool-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="添加待办…"
        />
        <button type="submit" className="btn-primary btn-sm">
          添加
        </button>
      </form>
      <ul className="todo-list">
        {items.map((item) => (
          <li key={item.id} className={item.done ? 'is-done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() =>
                  setItems((prev) =>
                    prev.map((x) => (x.id === item.id ? { ...x, done: !x.done } : x)),
                  )
                }
              />
              <span>{item.text}</span>
            </label>
            <button
              type="button"
              className="link-btn"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
            >
              删除
            </button>
          </li>
        ))}
      </ul>
      {items.length === 0 ? <p className="empty-state">暂无待办</p> : null}
      {items.some((i) => i.done) ? (
        <button
          type="button"
          className="btn-ghost btn-sm"
          onClick={() => setItems((prev) => prev.filter((i) => !i.done))}
        >
          清除已完成
        </button>
      ) : null}
    </div>
  )
}
