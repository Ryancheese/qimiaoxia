import { useState } from 'react'
import { CopyButton } from '../components/CopyButton'

export function UrlCodecTool() {
  const [input, setInput] = useState('https://example.com/?q=Ryan 工具箱&x=1')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  function encode() {
    try {
      setOutput(encodeURIComponent(input))
      setError('')
    } catch {
      setError('编码失败')
    }
  }

  function decode() {
    try {
      setOutput(decodeURIComponent(input.replace(/\+/g, ' ')))
      setError('')
    } catch {
      setError('解码失败，请确认是合法 URL 编码')
    }
  }

  function swap() {
    if (!output) return
    setInput(output)
    setOutput('')
    setError('')
  }

  return (
    <div className="tool-stack">
      <textarea
        className="tool-textarea"
        rows={5}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入文本或 URL 编码串"
      />
      <div className="tool-actions">
        <button type="button" className="btn-primary btn-sm" onClick={encode}>
          编码
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={decode}>
          解码
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={swap} disabled={!output}>
          结果填入输入
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
