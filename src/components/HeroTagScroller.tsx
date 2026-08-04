import type { ToolId, ToolMeta } from '../data/tools'

interface HeroTagScrollerProps {
  tools: Pick<ToolMeta, 'id' | 'name'>[]
  onSelect: (id: ToolId) => void
  reverse?: boolean
}

export function HeroTagScroller({ tools, onSelect, reverse = false }: HeroTagScrollerProps) {
  const loop = [...tools, ...tools]

  return (
    <div className={`hero-tag-scroller${reverse ? ' is-reverse' : ''}`}>
      <div className="hero-tag-track">
        {loop.map((tool, index) => (
          <button
            key={`${tool.id}-${index}`}
            type="button"
            className="hero-tag"
            onClick={() => onSelect(tool.id)}
          >
            {tool.name}
          </button>
        ))}
      </div>
    </div>
  )
}
