import { useEffect, useRef, useState } from 'react'
import { createWorker, type Worker } from 'tesseract.js'
import { CopyButton } from '../components/CopyButton'

export function OcrTool() {
  const [preview, setPreview] = useState('')
  const [text, setText] = useState('')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const workerRef = useRef<Worker | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      void workerRef.current?.terminate()
      workerRef.current = null
      if (preview) URL.revokeObjectURL(preview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function ensureWorker() {
    if (workerRef.current) return workerRef.current
    setStatus('加载识别引擎…')
    const worker = await createWorker('chi_sim+eng', 1, {
      logger: (m) => {
        if (typeof m.progress === 'number') setProgress(Math.round(m.progress * 100))
        if (m.status) setStatus(m.status)
      },
    })
    workerRef.current = worker
    return worker
  }

  async function onFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件')
      return
    }
    setError('')
    setText('')
    if (preview) URL.revokeObjectURL(preview)
    const url = URL.createObjectURL(file)
    setPreview(url)
    setBusy(true)
    setProgress(0)
    try {
      const worker = await ensureWorker()
      setStatus('识别中…')
      const result = await worker.recognize(file)
      setText(result.data.text.trim())
      setStatus('完成')
      setProgress(100)
    } catch (e) {
      setError(e instanceof Error ? e.message : '识别失败')
      setStatus('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="tool-stack">
      <p className="hint">支持中英文。首次使用会下载语言包，请稍等几秒。</p>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
      <button
        type="button"
        className="btn-primary"
        disabled={busy}
        onClick={() => fileRef.current?.click()}
      >
        {busy ? '识别中…' : '选择 / 拍摄图片'}
      </button>

      {busy || status ? (
        <div className="stat-card">
          <p className="hint">{status || '处理中'}</p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="hint">{progress}%</p>
        </div>
      ) : null}

      {preview ? (
        <img src={preview} alt="待识别预览" className="media-preview" />
      ) : null}

      {error ? <p className="tool-error">{error}</p> : null}

      {text ? (
        <>
          <div className="tool-actions">
            <span className="hint">识别结果</span>
            <CopyButton text={text} />
          </div>
          <textarea
            className="tool-textarea"
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </>
      ) : null}

      {!text && !busy && preview === '' ? (
        <p className="empty-state">还没有图片。清晰、对比度高的文字效果更好。</p>
      ) : null}
    </div>
  )
}
