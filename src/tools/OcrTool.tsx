import { useEffect, useRef, useState } from 'react'
import { createWorker, PSM, type Worker } from 'tesseract.js'
import { CopyButton } from '../components/CopyButton'
import { hasCjk, preprocessImageForOcr } from '../utils/ocrPreprocess'

type LangMode = 'chi_sim+eng' | 'chi_sim' | 'eng'

const LANG_OPTIONS: { id: LangMode; label: string }[] = [
  { id: 'chi_sim+eng', label: '中英' },
  { id: 'chi_sim', label: '中文' },
  { id: 'eng', label: '英文' },
]

export function OcrTool() {
  const [preview, setPreview] = useState('')
  const [text, setText] = useState('')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [langMode, setLangMode] = useState<LangMode>('chi_sim+eng')
  const workerRef = useRef<Worker | null>(null)
  const workerLangRef = useRef<LangMode | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const lastFileRef = useRef<File | null>(null)

  useEffect(() => {
    return () => {
      void workerRef.current?.terminate()
      workerRef.current = null
      workerLangRef.current = null
      if (preview) URL.revokeObjectURL(preview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function ensureWorker(mode: LangMode) {
    if (workerRef.current && workerLangRef.current === mode) {
      return workerRef.current
    }

    if (workerRef.current) {
      await workerRef.current.terminate()
      workerRef.current = null
      workerLangRef.current = null
    }

    setStatus('加载识别引擎…')
    const worker = await createWorker(mode, 1, {
      logger: (m) => {
        if (typeof m.progress === 'number') setProgress(Math.round(m.progress * 100))
        if (m.status) setStatus(m.status)
      },
    })

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SPARSE_TEXT,
      user_defined_dpi: '300',
      preserve_interword_spaces: '1',
    })

    workerRef.current = worker
    workerLangRef.current = mode
    return worker
  }

  function pickBestResult(
    candidates: { text: string; confidence: number }[],
    mode: LangMode,
  ): string {
    const ranked = [...candidates].sort((a, b) => b.confidence - a.confidence)
    const best = ranked[0]
    if (!best) return ''

    if (mode === 'eng') return best.text

    const cjkCandidate = ranked.find((item) => hasCjk(item.text) && item.text.trim().length > 0)
    if (cjkCandidate && cjkCandidate.confidence >= best.confidence - 12) {
      return cjkCandidate.text
    }

    return best.text
  }

  async function recognizeFile(file: File, mode: LangMode) {
    const worker = await ensureWorker(mode)
    setStatus('优化图片…')
    const { normal, inverted } = await preprocessImageForOcr(file)

    setStatus('识别中…')
    const [normalResult, invertedResult] = await Promise.all([
      worker.recognize(normal, { rotateAuto: true }),
      worker.recognize(inverted, { rotateAuto: true }),
    ])

    const candidates = [
      { text: normalResult.data.text.trim(), confidence: normalResult.data.confidence },
      { text: invertedResult.data.text.trim(), confidence: invertedResult.data.confidence },
    ]

    return pickBestResult(candidates, mode)
  }

  async function onFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件')
      return
    }

    setError('')
    setText('')
    lastFileRef.current = file

    if (preview) URL.revokeObjectURL(preview)
    const url = URL.createObjectURL(file)
    setPreview(url)

    setBusy(true)
    setProgress(0)
    try {
      const result = await recognizeFile(file, langMode)
      setText(result)
      setStatus('完成')
      setProgress(100)
    } catch (e) {
      setError(e instanceof Error ? e.message : '识别失败')
      setStatus('')
    } finally {
      setBusy(false)
    }
  }

  async function onLangChange(mode: LangMode) {
    setLangMode(mode)
    const file = lastFileRef.current
    if (!file || busy) return

    setBusy(true)
    setProgress(0)
    setError('')
    try {
      const result = await recognizeFile(file, mode)
      setText(result)
      setStatus('完成')
      setProgress(100)
    } catch (e) {
      setError(e instanceof Error ? e.message : '识别失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="tool-stack">
      <p className="hint">
        支持中英文。已自动优化图片对比度；对表情包、艺术字识别率有限，建议使用清晰印刷体。
      </p>

      <div className="chip-row wrap">
        {LANG_OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={langMode === id ? 'chip is-active' : 'chip'}
            disabled={busy}
            onClick={() => void onLangChange(id)}
          >
            {label}
          </button>
        ))}
      </div>

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

      {preview ? <img src={preview} alt="待识别预览" className="media-preview" /> : null}

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
