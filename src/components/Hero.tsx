import { useState } from 'react'
import { motion } from 'framer-motion'
import { Braces, Clock3, KeyRound, Palette, TextCursorInput, Timer } from 'lucide-react'
import { HeroToolbox3D } from './HeroToolbox3D'

interface HeroProps {
  onExplore: () => void
  toolCount: number
}

const tools = [
  { name: 'JSON', Icon: Braces, color: '#0071e3', x: -108, y: -78, r: -7, d: 0.05 },
  { name: '番茄钟', Icon: Timer, color: '#34c759', x: 100, y: -82, r: 6, d: 0.1 },
  { name: '密码', Icon: KeyRound, color: '#ff9500', x: -114, y: 12, r: -5, d: 0.15 },
  { name: '字数', Icon: TextCursorInput, color: '#ff2d55', x: 108, y: 8, r: 5, d: 0.2 },
  { name: '颜色', Icon: Palette, color: '#5ac8fa', x: -22, y: -108, r: -2, d: 0.25 },
  { name: '时间戳', Icon: Clock3, color: '#5856d6', x: 30, y: -104, r: 3, d: 0.3 },
] as const

const ease = [0.22, 1, 0.36, 1] as const

export function Hero({ onExplore, toolCount }: HeroProps) {
  const [toolboxOpen, setToolboxOpen] = useState(false)

  return (
    <header className="hero">
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-mesh" />
      </div>

      <div className="hero-visual">
        <div className="hero-showcase">
          <div className="hero-showcase-glow" aria-hidden="true" />
          <div className="hero-showcase-ring" aria-hidden="true" />

          {tools.map(({ name, Icon, color, x, y, r, d }) => (
            <motion.div
              key={name}
              className="hero-tool-pill"
              initial={{ opacity: 0, x: 0, y: 40, scale: 0.4, rotate: 0 }}
              animate={
                toolboxOpen
                  ? { opacity: 1, x, y, scale: 1, rotate: r }
                  : { opacity: 0, x: 0, y: 40, scale: 0.4, rotate: 0 }
              }
              transition={{ duration: 0.65, delay: toolboxOpen ? d + 0.15 : 0, ease }}
              aria-hidden={!toolboxOpen}
            >
              <span className="hero-tool-pill-icon" style={{ background: color }}>
                <Icon size={14} strokeWidth={2.5} />
              </span>
              <span>{name}</span>
            </motion.div>
          ))}

          <HeroToolbox3D toolCount={toolCount} onOpenChange={setToolboxOpen} />
        </div>
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
