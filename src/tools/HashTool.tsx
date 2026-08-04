import { useState } from 'react'
import { CopyButton } from '../components/CopyButton'

const algorithms = [
  { id: 'SHA-1', label: 'SHA-1' },
  { id: 'SHA-256', label: 'SHA-256' },
  { id: 'SHA-384', label: 'SHA-384' },
  { id: 'SHA-512', label: 'SHA-512' },
] as const

type Algo = (typeof algorithms)[number]['id']

export function HashTool() {
  const [input, setInput] = useState('Ryan 的工具箱')
  const [algo, setAlgo] = useState<Algo>('SHA-256')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function compute() {
    setBusy(true)
    setError('')
    try {
      const data = new TextEncoder().encode(input)
      const digest = await crypto.subtle.digest(algo, data)
      const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
      setOutput(hex)
    } catch {
      setError('计算失败，当前环境可能不支持该算法')
      setOutput('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="tool-stack">
      <textarea
        className="tool-textarea"
        rows={5}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入要计算哈希的文本"
      />
      <div className="chip-row wrap">
        {algorithms.map((item) => (
          <button
            key={item.id}
            type="button"
            className={algo === item.id ? 'chip is-on' : 'chip'}
            onClick={() => setAlgo(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="tool-actions">
        <button type="button" className="btn-primary btn-sm" disabled={busy} onClick={() => void compute()}>
          {busy ? '计算中…' : '计算哈希'}
        </button>
      </div>
      {error ? <p className="tool-error">{error}</p> : null}
      {output ? (
        <>
          <div className="tool-actions">
            <span className="hint">{algo} 结果</span>
            <CopyButton text={output} />
          </div>
          <pre className="tool-pre">{output}</pre>
        </>
      ) : null}
    </div>
  )
}
