import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'

const WISH_EMAIL = '17625416243@163.com'

export function SubmitPanel() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    const toolName = name.trim()
    const ref = url.trim() || '（未填写）'
    const reason = note.trim() || '（未填写）'
    const subject = `【Ryan 的工具箱】许愿：${toolName}`
    const body = [
      `工具名：${toolName}`,
      `参考说明 / 链接：${ref}`,
      `使用场景：${reason}`,
      '',
      '—— 来自 Ryan 的工具箱',
    ].join('\n')

    const href = `mailto:${WISH_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = href
  }

  return (
    <section className="panel submit-panel">
      <h2>许愿新工具</h2>
      <p className="panel-lead">想要什么内置工具？填写后会打开你的邮件应用，确认发送即可。</p>

      <form className="submit-form" onSubmit={handleSubmit}>
        <label>
          <span>想要的工具名</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：二维码生成"
          />
        </label>
        <label>
          <span>参考说明 / 链接（可选）</span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="可以留空"
          />
        </label>
        <label>
          <span>为什么需要它</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="使用场景是什么？"
            rows={3}
          />
        </label>
        <button type="submit" className="btn-primary btn-block">
          <Send size={16} />
          打开邮件发送
        </button>
      </form>
    </section>
  )
}
