import { useMemo, useState } from 'react'
import { CopyButton } from '../components/CopyButton'

export function JsonFormatter() {
  const [input, setInput] = useState('{\n  "hello": "Ryan 的工具箱"\n}')
  const [error, setError] = useState('')
  const [output, setOutput] = useState('')

  function beautify() {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'JSON 无效')
      setOutput('')
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'JSON 无效')
      setOutput('')
    }
  }

  const validHint = useMemo(() => {
    if (!input.trim()) return ''
    try {
      JSON.parse(input)
      return '语法有效'
    } catch {
      return '语法有误'
    }
  }, [input])

  return (
    <div className="tool-stack">
      <textarea
        className="tool-textarea"
        rows={8}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="粘贴 JSON…"
        spellCheck={false}
      />
      <div className="tool-actions">
        <button type="button" className="btn-primary btn-sm" onClick={beautify}>
          美化
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={minify}>
          压缩
        </button>
        <span className={validHint === '语法有效' ? 'hint ok' : 'hint bad'}>{validHint}</span>
      </div>
      {error ? <p className="tool-error">{error}</p> : null}
      {output ? (
        <>
          <div className="tool-actions">
            <span className="hint">结果</span>
            <CopyButton text={output} />
          </div>
          <pre className="tool-pre">{output}</pre>
        </>
      ) : null}
    </div>
  )
}
