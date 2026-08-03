import { useState } from 'react'
import { CopyButton } from '../components/CopyButton'

export function Base64Tool() {
  const [input, setInput] = useState('奇妙匣')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  function encode() {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))))
      setError('')
    } catch {
      setError('编码失败')
    }
  }

  function decode() {
    try {
      setOutput(decodeURIComponent(escape(atob(input))))
      setError('')
    } catch {
      setError('解码失败，请确认是合法 Base64')
    }
  }

  return (
    <div className="tool-stack">
      <textarea className="tool-textarea" rows={5} value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="tool-actions">
        <button type="button" className="btn-primary btn-sm" onClick={encode}>
          编码
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={decode}>
          解码
        </button>
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
