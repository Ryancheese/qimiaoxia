import { useState } from 'react'
import { CopyButton } from '../components/CopyButton'

type LangPair = 'zh|en' | 'en|zh'

const PRESETS = [
  '你好，世界',
  '纯净无广告，一触即达',
  'Hello, how are you?',
  'This tool runs in your browser.',
]

export function TranslateTool() {
  const [text, setText] = useState('纯净无广告，一触即达')
  const [pair, setPair] = useState<LangPair>('zh|en')
  const [result, setResult] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function translate() {
    const q = text.trim()
    if (!q) return
    setBusy(true)
    setError('')
    setResult('')
    try {
      const langpair = pair === 'zh|en' ? 'zh-CN|en' : 'en|zh-CN'
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q.slice(0, 450))}&langpair=${langpair}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`服务异常 ${res.status}`)
      const data = (await res.json()) as {
        responseStatus?: number
        responseData?: { translatedText?: string }
        responseDetails?: string
      }
      const translated = data.responseData?.translatedText?.trim()
      if (!translated || (data.responseStatus && data.responseStatus !== 200)) {
        throw new Error(data.responseDetails || '翻译失败，请稍后重试')
      }
      // MyMemory sometimes returns "QUERY LENGTH LIMIT..." as text
      if (/QUERY LENGTH LIMIT/i.test(translated)) {
        throw new Error('文本过长，请缩短到约 450 字以内')
      }
      setResult(translated)
    } catch (e) {
      setError(e instanceof Error ? e.message : '翻译失败')
    } finally {
      setBusy(false)
    }
  }

  function swap() {
    setPair((p) => (p === 'zh|en' ? 'en|zh' : 'zh|en'))
    if (result) {
      setText(result)
      setResult(text)
    }
  }

  return (
    <div className="tool-stack">
      <p className="hint">使用免费翻译接口，单次建议不超过 450 字；需联网。</p>
      <div className="tool-actions">
        <button
          type="button"
          className={pair === 'zh|en' ? 'chip is-on' : 'chip'}
          onClick={() => setPair('zh|en')}
        >
          中 → 英
        </button>
        <button
          type="button"
          className={pair === 'en|zh' ? 'chip is-on' : 'chip'}
          onClick={() => setPair('en|zh')}
        >
          英 → 中
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={swap}>
          互换
        </button>
      </div>

      <div className="chip-row wrap">
        {PRESETS.map((p) => (
          <button key={p} type="button" className="chip" onClick={() => setText(p)}>
            {p.length > 12 ? `${p.slice(0, 12)}…` : p}
          </button>
        ))}
      </div>

      <textarea
        className="tool-textarea"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入要翻译的内容…"
      />

      <button type="button" className="btn-primary" disabled={busy || !text.trim()} onClick={() => void translate()}>
        {busy ? '翻译中…' : '翻译'}
      </button>

      {error ? <p className="tool-error">{error}</p> : null}

      {result ? (
        <div className="stat-card">
          <div className="tool-actions">
            <span className="hint">译文</span>
            <CopyButton text={result} />
          </div>
          <p className="quote-text">{result}</p>
        </div>
      ) : null}
    </div>
  )
}
