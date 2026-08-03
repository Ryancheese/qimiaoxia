import { useState } from 'react'
import { CopyButton } from '../components/CopyButton'

function makeUuid() {
  if (crypto.randomUUID) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function UuidTool() {
  const [count, setCount] = useState(5)
  const [list, setList] = useState<string[]>(() => Array.from({ length: 5 }, makeUuid))

  function regen() {
    const n = Math.min(50, Math.max(1, count))
    setList(Array.from({ length: n }, makeUuid))
  }

  return (
    <div className="tool-stack">
      <label className="field">
        <span>生成数量（1-50）</span>
        <input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </label>
      <div className="tool-actions">
        <button type="button" className="btn-primary btn-sm" onClick={regen}>
          重新生成
        </button>
        <CopyButton text={list.join('\n')} label="复制全部" />
      </div>
      <ul className="plain-list">
        {list.map((id) => (
          <li key={id} className="mono-row">
            <code>{id}</code>
            <CopyButton text={id} label="复制" />
          </li>
        ))}
      </ul>
    </div>
  )
}
