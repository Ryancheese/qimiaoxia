import { useRef, useState } from 'react'
import { PDFDocument } from 'pdf-lib'

type Mode = 'merge' | 'images'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function PdfTools() {
  const [mode, setMode] = useState<Mode>('merge')
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [doneMsg, setDoneMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function onPick(list: FileList | null) {
    if (!list?.length) return
    const arr = Array.from(list)
    setError('')
    setDoneMsg('')
    if (mode === 'merge') {
      const pdfs = arr.filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
      if (!pdfs.length) {
        setError('请选择 PDF 文件')
        return
      }
      setFiles((prev) => [...prev, ...pdfs])
    } else {
      const images = arr.filter((f) => f.type.startsWith('image/'))
      if (!images.length) {
        setError('请选择图片文件')
        return
      }
      setFiles((prev) => [...prev, ...images])
    }
  }

  async function mergePdfs() {
    if (files.length < 1) {
      setError('至少选择 1 个 PDF')
      return
    }
    setBusy(true)
    setError('')
    setDoneMsg('')
    try {
      const out = await PDFDocument.create()
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const doc = await PDFDocument.load(bytes)
        const pages = await out.copyPages(doc, doc.getPageIndices())
        pages.forEach((p) => out.addPage(p))
      }
      const saved = await out.save()
      downloadBlob(
        new Blob([Uint8Array.from(saved)], { type: 'application/pdf' }),
        `merged-${Date.now()}.pdf`,
      )
      setDoneMsg(`已合并 ${files.length} 个文件并开始下载`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '合并失败（可能含加密 PDF）')
    } finally {
      setBusy(false)
    }
  }

  async function imagesToPdf() {
    if (!files.length) {
      setError('请先选择图片')
      return
    }
    setBusy(true)
    setError('')
    setDoneMsg('')
    try {
      const out = await PDFDocument.create()
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')
        const isJpg =
          file.type === 'image/jpeg' ||
          file.type === 'image/jpg' ||
          /\.jpe?g$/i.test(file.name)
        let image
        if (isPng) image = await out.embedPng(bytes)
        else if (isJpg) image = await out.embedJpg(bytes)
        else {
          // convert other formats via canvas to jpeg
          const bmp = await createImageBitmap(file)
          const canvas = document.createElement('canvas')
          canvas.width = bmp.width
          canvas.height = bmp.height
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('无法处理该图片格式')
          ctx.drawImage(bmp, 0, 0)
          const jpegBytes = await new Promise<ArrayBuffer>((resolve, reject) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) reject(new Error('图片转换失败'))
                else void blob.arrayBuffer().then(resolve, reject)
              },
              'image/jpeg',
              0.92,
            )
          })
          image = await out.embedJpg(jpegBytes)
        }
        const page = out.addPage([image.width, image.height])
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height })
      }
      const saved = await out.save()
      downloadBlob(
        new Blob([Uint8Array.from(saved)], { type: 'application/pdf' }),
        `images-${Date.now()}.pdf`,
      )
      setDoneMsg(`已生成 ${files.length} 页 PDF 并开始下载`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="tool-stack">
      <div className="tool-actions">
        <button
          type="button"
          className={mode === 'merge' ? 'chip is-on' : 'chip'}
          onClick={() => {
            setMode('merge')
            setFiles([])
            setError('')
            setDoneMsg('')
          }}
        >
          合并 PDF
        </button>
        <button
          type="button"
          className={mode === 'images' ? 'chip is-on' : 'chip'}
          onClick={() => {
            setMode('images')
            setFiles([])
            setError('')
            setDoneMsg('')
          }}
        >
          图片转 PDF
        </button>
      </div>

      <p className="hint">
        {mode === 'merge'
          ? '按添加顺序合并多个 PDF，全程在手机本地处理。'
          : '支持 JPG/PNG，其他格式会自动转成 JPEG 后写入 PDF。'}
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={mode === 'merge' ? 'application/pdf,.pdf' : 'image/*'}
        hidden
        onChange={(e) => {
          onPick(e.target.files)
          e.target.value = ''
        }}
      />

      <button type="button" className="btn-ghost" onClick={() => inputRef.current?.click()}>
        {mode === 'merge' ? '添加 PDF' : '添加图片'}
      </button>

      {files.length > 0 ? (
        <ul className="plain-list">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="mono-row">
              <span className="break-all">
                {i + 1}. {f.name}
              </span>
              <button
                type="button"
                className="link-btn"
                onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
              >
                移除
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">还没有文件</p>
      )}

      <div className="tool-actions">
        <button
          type="button"
          className="btn-primary"
          disabled={busy || files.length === 0}
          onClick={() => void (mode === 'merge' ? mergePdfs() : imagesToPdf())}
        >
          {busy ? '处理中…' : mode === 'merge' ? '合并并下载' : '生成 PDF'}
        </button>
        {files.length > 0 ? (
          <button type="button" className="btn-ghost btn-sm" onClick={() => setFiles([])}>
            清空列表
          </button>
        ) : null}
      </div>

      {error ? <p className="tool-error">{error}</p> : null}
      {doneMsg ? <p className="hint ok">{doneMsg}</p> : null}
    </div>
  )
}
