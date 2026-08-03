import { motion } from 'framer-motion'

interface HeroProps {
  onExplore: () => void
  toolCount: number
}

export function Hero({ onExplore, toolCount }: HeroProps) {
  return (
    <header className="hero">
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-grid" />
        <svg className="hero-illustration" viewBox="0 0 390 280" fill="none">
          <defs>
            <linearGradient id="boxGrad" x1="80" y1="60" x2="310" y2="240" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C8F542" />
              <stop offset="1" stopColor="#7DFFC4" />
            </linearGradient>
            <linearGradient id="lidGrad" x1="100" y1="40" x2="280" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E8FFB0" />
              <stop offset="1" stopColor="#7DFFC4" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <ellipse cx="195" cy="240" rx="120" ry="18" fill="#000" opacity="0.35" />
          <path
            d="M95 130 L195 80 L295 130 L295 200 Q195 245 95 200 Z"
            fill="url(#boxGrad)"
            opacity="0.95"
          />
          <path d="M95 130 L195 165 L295 130 L195 95 Z" fill="#0B2E2A" opacity="0.25" />
          <path d="M110 95 L195 50 L280 95 L195 125 Z" fill="url(#lidGrad)" className="hero-lid" />
          <circle cx="160" cy="155" r="8" fill="#071A18" opacity="0.5" />
          <circle cx="195" cy="168" r="10" fill="#071A18" opacity="0.55" />
          <circle cx="230" cy="155" r="8" fill="#071A18" opacity="0.5" />
          <path
            d="M150 100 Q195 70 240 100"
            stroke="#7DFFC4"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
            className="hero-spark"
          />
        </svg>
      </div>

      <div className="hero-content">
        <motion.p
          className="brand"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          奇妙匣
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          纯净无广告，一触即达
        </motion.h1>
        <motion.p
          className="hero-lead"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          {toolCount}+ 个原创内置工具，点开即用，不跳转外部网站。
        </motion.p>
        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
        >
          <button type="button" className="btn-primary" onClick={onExplore}>
            打开工具箱
          </button>
        </motion.div>
      </div>
    </header>
  )
}
