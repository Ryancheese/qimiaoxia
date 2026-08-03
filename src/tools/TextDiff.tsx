import { useMemo, useState } from 'react'

function diffLines(a: string, b: string) {
  const left = a.split('\n')
  const right = b.split('\n')
  const max = Math.max(left.length, right.length)
  const rows: { type: 'same' | 'del' | 'add' | 'change'; left?: string; right?: string }[] = []
  for (let i = 0; i < max; i++) {
    const L = left[i]
    const R = right[i]
    if (L === R) rows.push({ type: 'same', left: L ?? '', right: R ?? '' })
    else if (L !== undefined && R === undefined) rows.push({ type: 'del', left: L })
    else if (L === undefined && R !== undefined) rows.push({ type: 'add', right: R })
    else rows.push({ type: 'change', left: L, right: R })
  }
  return rows
}

export function TextDiff() {
  const [a, setA] = useState('苹果\n香蕉\n橙子')
  const [b, setB] = useState('苹果\n葡萄\n橙子\n西瓜')
  const rows = useMemo(() => diffLines(a, b), [a, b])

  return (
    <div className="tool-stack">
      <div className="split-2">
        <label className="field">
          <span>文本 A</span>
          <textarea className="tool-textarea" rows={6} value={a} onChange={(e) => setA(e.target.value)} />
        </label>
        <label className="field">
          <span>文本 B</span>
          <textarea className="tool-textarea" rows={6} value={b} onChange={(e) => setB(e.target.value)} />
        </label>
      </div>
      <ul className="diff-list">
        {rows.map((r, i) => (
          <li key={i} className={`diff-${r.type}`}>
            {r.type === 'same' && <span>  {r.left}</span>}
            {r.type === 'del' && <span>- {r.left}</span>}
            {r.type === 'add' && <span>+ {r.right}</span>}
            {r.type === 'change' && (
              <span>
                - {r.left}
                <br />+ {r.right}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
