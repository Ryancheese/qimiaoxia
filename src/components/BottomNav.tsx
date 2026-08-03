import { Compass, Heart, Home, Plus } from 'lucide-react'

export type TabId = 'home' | 'explore' | 'favorites' | 'submit'

interface BottomNavProps {
  active: TabId
  onChange: (tab: TabId) => void
  favoriteCount: number
}

const items: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'explore', label: '发现', icon: Compass },
  { id: 'favorites', label: '收藏', icon: Heart },
  { id: 'submit', label: '许愿', icon: Plus },
]

export function BottomNav({ active, onChange, favoriteCount }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={active === id ? 'nav-item is-active' : 'nav-item'}
          onClick={() => onChange(id)}
          aria-current={active === id ? 'page' : undefined}
        >
          <span className="nav-icon-wrap">
            <Icon size={20} strokeWidth={active === id ? 2.4 : 2} />
            {id === 'favorites' && favoriteCount > 0 ? (
              <span className="nav-badge">{favoriteCount > 9 ? '9+' : favoriteCount}</span>
            ) : null}
          </span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
