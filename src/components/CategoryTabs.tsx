import { categories, type CategoryId } from '../data/tools'

interface CategoryTabsProps {
  active: CategoryId
  onChange: (id: CategoryId) => void
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="category-tabs" role="tablist" aria-label="工具分类">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          role="tab"
          aria-selected={active === cat.id}
          className={active === cat.id ? 'cat-tab is-active' : 'cat-tab'}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
