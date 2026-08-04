import { useRef, useState } from 'react'
import jsQR from 'jsqr'
import { CopyButton } from '../components/CopyButton'

export function QrParseTool() {
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function clearPreview() {
    if (preview) URL.revokeObjectURL(preview)
  }

  async function decodeFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件')
      return
    }

    clearPreview()
    setBusy(true)
    setError('')
    setResult('')
    const url = URL.createObjectURL(file)
    setPreview(url)

    try {
      const img = await loadImage(url)
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('无法读取画布')
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth',
      })
      if (!code?.data) {
        setError('未识别到二维码，请换一张更清晰的图片')
        return
      }
      setResult(code.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '解析失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="tool-stack">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void decodeFile(e.target.files?.[0])}
      />
      <button
        type="button"
        className="btn-primary"
        disabled={busy}
        onClick={() => fileRef.current?.click()}
      >
        {busy ? '识别中…' : '选择二维码图片'}
      </button>
      <p className="hint">支持从相册或截图识别，纯前端本地解析</p>

      {preview ? (
        <div className="qr-preview">
          <img src={preview} alt="待解析图片" />
        </div>
      ) : null}

      {error ? <p className="tool-error">{error}</p> : null}

      {result ? (
        <>
          <div className="tool-actions">
            <span className="hint">解析结果</span>
            <CopyButton text={result} />
          </div>
          <pre className="tool-pre">{result}</pre>
        </>
      ) : null}
    </div>
  )
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = src
  })
}
