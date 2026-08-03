import { useMemo, useState } from 'react'

const presets = [
  { name: '邮箱', pattern: '^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$' },
  { name: '手机号', pattern: '^1[3-9]\\d{9}$' },
  { name: 'URL', pattern: '^https?:\\/\\/[^\\s]+$' },
  { name: '中文', pattern: '[\\u4e00-\\u9fa5]+' },
]

export function RegexTester() {
  const [pattern, setPattern] = useState('\\d+')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState('订单号 20260803，金额 128 元，共 3 件。')

  const result = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags)
      const matches: { value: string; index: number; groups: string[] }[] = []
      if (flags.includes('g')) {
        let m: RegExpExecArray | null
        const clone = new RegExp(pattern, flags)
        while ((m = clone.exec(text)) !== null) {
          matches.push({ value: m[0], index: m.index, groups: m.slice(1) })
          if (m[0] === '') clone.lastIndex++
        }
      } else {
        const m = re.exec(text)
        if (m) matches.push({ value: m[0], index: m.index, groups: m.slice(1) })
      }
      return { ok: true as const, matches }
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : '正则错误' }
    }
  }, [pattern, flags, text])

  const highlighted = useMemo(() => {
    if (!result.ok || result.matches.length === 0) return text
    const parts: { t: string; hit: boolean }[] = []
    let cursor = 0
    for (const m of result.matches) {
      if (m.index > cursor) parts.push({ t: text.slice(cursor, m.index), hit: false })
      parts.push({ t: m.value, hit: true })
      cursor = m.index + m.value.length
    }
    if (cursor < text.length) parts.push({ t: text.slice(cursor), hit: false })
    return parts
  }, [result, text])

  return (
    <div className="tool-stack">
      <label className="field">
        <span>正则表达式</span>
        <input value={pattern} onChange={(e) => setPattern(e.target.value)} spellCheck={false} />
      </label>
      <label className="field">
        <span>标志（如 g i m）</span>
        <input value={flags} onChange={(e) => setFlags(e.target.value)} spellCheck={false} />
      </label>
      <div className="chip-row">
        {presets.map((p) => (
          <button key={p.name} type="button" className="chip" onClick={() => setPattern(p.pattern)}>
            {p.name}
          </button>
        ))}
      </div>
      <label className="field">
        <span>测试文本</span>
        <textarea className="tool-textarea" rows={5} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      {!result.ok ? (
        <p className="tool-error">{result.error}</p>
      ) : (
        <>
          <p className="hint">匹配 {result.matches.length} 处</p>
          <div className="regex-preview">
            {typeof highlighted === 'string'
              ? highlighted
              : highlighted.map((p, i) =>
                  p.hit ? <mark key={i}>{p.t}</mark> : <span key={i}>{p.t}</span>,
                )}
          </div>
          {result.matches.length > 0 ? (
            <ul className="match-list">
              {result.matches.map((m, i) => (
                <li key={`${m.index}-${i}`}>
                  <strong>#{i + 1}</strong> @{m.index} → {m.value}
                  {m.groups.length ? ` | 组: ${m.groups.join(', ')}` : ''}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </div>
  )
}
