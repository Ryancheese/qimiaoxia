import { useState } from 'react'

export function Scoreboard() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [nameA, setNameA] = useState('红队')
  const [nameB, setNameB] = useState('蓝队')

  return (
    <div className="tool-stack">
      <div className="score-board">
        <div className="score-side side-a">
          <input value={nameA} onChange={(e) => setNameA(e.target.value)} />
          <p className="score-num">{a}</p>
          <div className="tool-actions center">
            <button type="button" className="btn-primary btn-sm" onClick={() => setA((v) => v + 1)}>
              +1
            </button>
            <button type="button" className="btn-ghost btn-sm" onClick={() => setA((v) => Math.max(0, v - 1))}>
              -1
            </button>
          </div>
        </div>
        <div className="score-side side-b">
          <input value={nameB} onChange={(e) => setNameB(e.target.value)} />
          <p className="score-num">{b}</p>
          <div className="tool-actions center">
            <button type="button" className="btn-primary btn-sm" onClick={() => setB((v) => v + 1)}>
              +1
            </button>
            <button type="button" className="btn-ghost btn-sm" onClick={() => setB((v) => Math.max(0, v - 1))}>
              -1
            </button>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="btn-ghost"
        onClick={() => {
          setA(0)
          setB(0)
        }}
      >
        重置比分
      </button>
    </div>
  )
}
