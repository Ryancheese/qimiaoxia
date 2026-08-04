import { useMemo, useState } from 'react'
import { CopyButton } from '../components/CopyButton'

function b64UrlToJson(part: string) {
  const padded = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (part.length % 4)) % 4)
  const json = decodeURIComponent(
    [...atob(padded)].map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''),
  )
  return JSON.parse(json) as unknown
}

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2)
}

export function JwtDecodeTool() {
  const [token, setToken] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJ5YW4iLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  )

  const parsed = useMemo(() => {
    const raw = token.trim()
    if (!raw) return { error: '', header: '', payload: '', signature: '' }
    const parts = raw.split('.')
    if (parts.length < 2) {
      return { error: 'JWT 至少应包含 Header 与 Payload 两段', header: '', payload: '', signature: '' }
    }
    try {
      const header = pretty(b64UrlToJson(parts[0]))
      const payload = pretty(b64UrlToJson(parts[1]))
      const signature = parts[2] ?? ''
      return { error: '', header, payload, signature }
    } catch {
      return { error: '解码失败，请确认是合法 JWT', header: '', payload: '', signature: '' }
    }
  }, [token])

  return (
    <div className="tool-stack">
      <label className="field">
        <span>JWT Token</span>
        <textarea
          className="tool-textarea"
          rows={5}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="粘贴 JWT（仅本地解码，不校验签名）"
        />
      </label>
      <p className="hint">仅解析内容，不会验证签名真伪</p>
      {parsed.error ? <p className="tool-error">{parsed.error}</p> : null}

      {parsed.header ? (
        <>
          <div className="tool-actions">
            <span className="hint">Header</span>
            <CopyButton text={parsed.header} />
          </div>
          <pre className="tool-pre">{parsed.header}</pre>
        </>
      ) : null}

      {parsed.payload ? (
        <>
          <div className="tool-actions">
            <span className="hint">Payload</span>
            <CopyButton text={parsed.payload} />
          </div>
          <pre className="tool-pre">{parsed.payload}</pre>
        </>
      ) : null}

      {parsed.signature ? (
        <>
          <div className="tool-actions">
            <span className="hint">Signature</span>
            <CopyButton text={parsed.signature} />
          </div>
          <pre className="tool-pre">{parsed.signature}</pre>
        </>
      ) : null}
    </div>
  )
}
