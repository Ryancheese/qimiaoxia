import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ToolMeta } from '../data/tools'

interface ToolListProps {
  tools: ToolMeta[]
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
  onOpen: (tool: ToolMeta) => void
  emptyText?: string
}

export function ToolList({
  tools,
  isFavorite,
  onToggleFavorite,
  onOpen,
  emptyText = '没有找到匹配的工具',
}: ToolListProps) {
  if (tools.length === 0) {
    return <p className="empty-state">{emptyText}</p>
  }

  return (
    <ul className="tool-list">
      {tools.map((tool, index) => {
        const fav = isFavorite(tool.id)
        return (
          <motion.li
            key={tool.id}
            className="tool-item"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: Math.min(index * 0.03, 0.24) }}
          >
            <button type="button" className="tool-main" onClick={() => onOpen(tool)}>
              <span className="tool-icon" aria-hidden="true">
                {tool.name.slice(0, 1)}
              </span>
              <span className="tool-meta">
                <span className="tool-name-row">
                  <span className="tool-name">{tool.name}</span>
                  {tool.hot ? <span className="badge badge-hot">热门</span> : null}
                  {tool.new ? <span className="badge badge-new">新</span> : null}
                </span>
                <span className="tool-desc">{tool.desc}</span>
                <span className="tool-tags">
                  {tool.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </span>
              </span>
            </button>
            <button
              type="button"
              className={fav ? 'fav-btn is-on' : 'fav-btn'}
              onClick={() => onToggleFavorite(tool.id)}
              aria-label={fav ? `取消收藏 ${tool.name}` : `收藏 ${tool.name}`}
              aria-pressed={fav}
            >
              <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
            </button>
          </motion.li>
        )
      })}
    </ul>
  )
}
