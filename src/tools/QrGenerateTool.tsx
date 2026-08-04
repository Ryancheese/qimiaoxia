import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

const sizes = [128, 256, 512] as const
const levels = [
  { id: 'L', label: 'L 低' },
  { id: 'M', label: 'M 中' },
  { id: 'Q', label: 'Q 较高' },
  { id: 'H', label: 'H 高' },
] as const

type EcLevel = (typeof levels)[number]['id']

export function QrGenerateTool() {
  const [text, setText] = useState('https://ryancheese.github.io/qimiaoxia/')
  const [size, setSize] = useState<(typeof sizes)[number]>(256)
  const [level, setLevel] = useState<EcLevel>('M')
  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const value = text.trim()
    if (!value) {
      setDataUrl('')
      setError('')
      return
    }

    void QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      errorCorrectionLevel: level,
      color: { dark: '#1d1d1f', light: '#ffffff' },
    })
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url)
          setError('')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDataUrl('')
          setError('生成失败，内容可能过长')
        }
      })

    return () => {
      cancelled = true
    }
  }, [text, size, level])

  function download() {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `qrcode-${size}.png`
    a.click()
  }

  return (
    <div className="tool-stack">
      <label className="field">
        <span>文本 / 链接</span>
        <textarea
          className="tool-textarea"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入要生成二维码的内容"
        />
      </label>

      <div className="chip-row wrap">
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            className={size === s ? 'chip is-on' : 'chip'}
            onClick={() => setSize(s)}
          >
            {s}px
          </button>
        ))}
      </div>

      <div className="chip-row wrap">
        {levels.map((item) => (
          <button
            key={item.id}
            type="button"
            className={level === item.id ? 'chip is-on' : 'chip'}
            onClick={() => setLevel(item.id)}
          >
            纠错 {item.label}
          </button>
        ))}
      </div>

      {error ? <p className="tool-error">{error}</p> : null}

      {dataUrl ? (
        <div className="qr-preview">
          <img src={dataUrl} alt="二维码预览" width={size} height={size} />
          <div className="tool-actions center">
            <button type="button" className="btn-primary btn-sm" onClick={download}>
              下载 PNG
            </button>
          </div>
        </div>
      ) : (
        <p className="hint">输入内容后自动生成二维码</p>
      )}
    </div>
  )
}
