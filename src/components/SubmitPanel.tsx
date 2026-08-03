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
    if (!name.trim() || !url.trim()) return
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
      <h2>投稿奇妙工具</h2>
      <p className="panel-lead">发现了好用的在线工具？告诉我们，下一版可能收录进奇妙匣。</p>

      {done ? (
        <motion.div
          className="submit-success"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p>已记下你的推荐，谢谢！</p>
          <button type="button" className="btn-ghost" onClick={() => setDone(false)}>
            再推荐一个
          </button>
        </motion.div>
      ) : (
        <form className="submit-form" onSubmit={handleSubmit}>
          <label>
            <span>工具名称</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：Excalidraw"
            />
          </label>
          <label>
            <span>网址</span>
            <input
              required
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
            />
          </label>
          <label>
            <span>一句话介绍（可选）</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="这个工具妙在哪里？"
              rows={3}
            />
          </label>
          <button type="submit" className="btn-primary btn-block">
            <Send size={16} />
            提交推荐
          </button>
        </form>
      )}
    </section>
  )
}
