import { useMemo, useState } from 'react'

export function WordCount() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const trimmed = text.trim()
    const chars = text.length
    const charsNoSpace = text.replace(/\s/g, '').length
    const cn = (text.match(/[\u4e00-\u9fa5]/g) || []).length
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0
    const paras = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim()).length : 0
    const lines = text ? text.split('\n').length : 0
    const readMin = Math.max(1, Math.ceil((cn + words) / 300))
    return { chars, charsNoSpace, cn, words, paras, lines, readMin }
  }, [text])

  return (
    <div className="tool-stack">
      <textarea
        className="tool-textarea"
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="在此输入或粘贴文本…"
      />
      <div className="stat-grid">
        <div className="stat-card compact">
          <p className="hint">字符</p>
          <p className="stat-value">{stats.chars}</p>
        </div>
        <div className="stat-card compact">
          <p className="hint">去空格</p>
          <p className="stat-value">{stats.charsNoSpace}</p>
        </div>
        <div className="stat-card compact">
          <p className="hint">汉字</p>
          <p className="stat-value">{stats.cn}</p>
        </div>
        <div className="stat-card compact">
          <p className="hint">词数</p>
          <p className="stat-value">{stats.words}</p>
        </div>
        <div className="stat-card compact">
          <p className="hint">段落</p>
          <p className="stat-value">{stats.paras}</p>
        </div>
        <div className="stat-card compact">
          <p className="hint">约读分钟</p>
          <p className="stat-value">{text.trim() ? stats.readMin : 0}</p>
        </div>
      </div>
    </div>
  )
}
