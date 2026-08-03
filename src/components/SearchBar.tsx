import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = '搜索工具名称或标签…' }: SearchBarProps) {
  return (
    <label className="search-bar">
      <Search size={18} strokeWidth={2} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        enterKeyHint="search"
        autoComplete="off"
      />
      {value ? (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="清除搜索"
        >
          <X size={16} />
        </button>
      ) : null}
    </label>
  )
}
