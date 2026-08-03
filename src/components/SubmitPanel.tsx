import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

export function SubmitPanel() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const payload = {
      name: name.trim(),
      url: url.trim(),
      note: note.trim(),
      at: new Date().toISOString(),
    }
    const prev = JSON.parse(localStorage.getItem('qimiaoxia-submissions') || '[]') as unknown[]
    localStorage.setItem('qimiaoxia-submissions', JSON.stringify([payload, ...prev].slice(0, 50)))
    setDone(true)
    setName('')
    setUrl('')
    setNote('')
  }

  return (
    <section className="panel submit-panel">
      <h2>许愿新工具</h2>
      <p className="panel-lead">想要什么内置工具？告诉我们，下一版可能亲手做出来。</p>

      {done ? (
        <motion.div
          className="submit-success"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p>已记下你的许愿，谢谢！</p>
          <button type="button" className="btn-ghost" onClick={() => setDone(false)}>
            再许一个
          </button>
        </motion.div>
      ) : (
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
            提交许愿
          </button>
        </form>
      )}
    </section>
  )
}
