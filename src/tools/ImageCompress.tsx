import { useRef, useState } from 'react'
import imageCompression from 'browser-image-compression'

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

export function ImageCompress() {
  const [original, setOriginal] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const [resultSize, setResultSize] = useState(0)
  const [quality, setQuality] = useState(0.7)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function clearUrls() {
    if (preview) URL.revokeObjectURL(preview)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
  }

  async function onFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('请上传图片')
      return
    }
    clearUrls()
    setError('')
    setOriginal(file)
    setPreview(URL.createObjectURL(file))
    setResultUrl('')
    setResultSize(0)
  }

  async function compress() {
    if (!original) return
    setBusy(true)
    setError('')
    try {
      const out = await imageCompression(original, {
        maxSizeMB: 1,
        maxWidthOrHeight: maxWidth,
        initialQuality: quality,
        useWebWorker: true,
        fileType: original.type.includes('png') ? 'image/png' : 'image/jpeg',
      })
      if (resultUrl) URL.revokeObjectURL(resultUrl)
      setResultUrl(URL.createObjectURL(out))
      setResultSize(out.size)
    } catch (e) {
      setError(e instanceof Error ? e.message : '压缩失败')
    } finally {
      setBusy(false)
    }
  }

  const ratio =
    original && resultSize
      ? Math.max(0, Math.round((1 - resultSize / original.size) * 100))
      : 0

  return (
    <div className="tool-stack">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
      <button type="button" className="btn-primary" onClick={() => fileRef.current?.click()}>
        选择图片
      </button>

      <label className="field">
        <span>质量 {Math.round(quality * 100)}%</span>
        <input
          type="range"
          min={0.3}
          max={0.95}
          step={0.05}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
        />
      </label>
      <label className="field">
        <span>最长边 {maxWidth}px</span>
        <input
          type="range"
          min={640}
          max={4096}
          step={64}
          value={maxWidth}
          onChange={(e) => setMaxWidth(Number(e.target.value))}
        />
      </label>

      {original ? (
        <div className="stat-grid">
          <div className="stat-card compact">
            <p className="hint">原图</p>
            <p className="stat-value small">{formatBytes(original.size)}</p>
          </div>
          <div className="stat-card compact">
            <p className="hint">压缩后</p>
            <p className="stat-value small">{resultSize ? formatBytes(resultSize) : '-'}</p>
          </div>
        </div>
      ) : null}

      {preview ? <img src={preview} alt="原图预览" className="media-preview" /> : null}

      <button type="button" className="btn-primary" disabled={!original || busy} onClick={() => void compress()}>
        {busy ? '压缩中…' : '开始压缩'}
      </button>

      {error ? <p className="tool-error">{error}</p> : null}

      {resultUrl ? (
        <div className="stat-card">
          <p className="hint">已减小约 {ratio}%</p>
          <img src={resultUrl} alt="压缩结果" className="media-preview" />
          <a className="btn-primary btn-sm" href={resultUrl} download={`compressed-${original?.name || 'image.jpg'}`}>
            下载压缩图
          </a>
        </div>
      ) : null}
    </div>
  )
}
