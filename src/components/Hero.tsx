import { motion } from 'framer-motion'
import type { ToolId, ToolMeta } from '../data/tools'
import { HeroTagScroller } from './HeroTagScroller'

interface HeroProps {
  onExplore: () => void
  onOpenTool: (tool: ToolMeta) => void
  tools: ToolMeta[]
  toolCount: number
}

const ease = [0.22, 1, 0.36, 1] as const

export function Hero({ onExplore, onOpenTool, tools, toolCount }: HeroProps) {
  const mid = Math.ceil(tools.length / 2)
  const leftTools = tools.slice(0, mid)
  const rightTools = tools.slice(mid)

  const handleSelect = (id: ToolId) => {
    const tool = tools.find((t) => t.id === id)
    if (tool) onOpenTool(tool)
  }

  return (
    <header className="hero">
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-mesh" />
      </div>

      <div className="hero-visual">
        <motion.div
          className="hero-tag-panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
        >
          <p className="hero-tag-label">快速直达 · {toolCount}+ 工具</p>
          <div className="hero-tag-columns">
            <HeroTagScroller tools={leftTools} onSelect={handleSelect} />
            <HeroTagScroller tools={rightTools} onSelect={handleSelect} reverse />
          </div>
          <p className="hero-tag-hint">点击标签立即打开</p>
        </motion.div>
      </div>

      <div className="hero-content">
        <motion.p
          className="brand"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          Ryan 的工具箱
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease }}
        >
          纯净无广告，一触即达
        </motion.h1>
        <motion.p
          className="hero-lead"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease }}
        >
          {toolCount}+ 个原创内置工具，点开即用，不跳转外部网站。
        </motion.p>
        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26, ease }}
        >
          <button type="button" className="btn-primary" onClick={onExplore}>
            打开工具箱
          </button>
        </motion.div>
      </div>
    </header>
  )
}
