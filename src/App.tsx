import { useDeferredValue, useMemo, useRef, useState } from 'react'
import { Hero } from './components/Hero'
import { SearchBar } from './components/SearchBar'
import { CategoryTabs } from './components/CategoryTabs'
import { ToolList } from './components/ToolList'
import { BottomNav, type TabId } from './components/BottomNav'
import { SubmitPanel } from './components/SubmitPanel'
import { categories, searchTools, tools, type CategoryId, type Tool } from './data/tools'
import { useFavorites } from './hooks/useFavorites'
import './App.css'

function byIds(ids: string[]): Tool[] {
  const map = new Map(tools.map((t) => [t.id, t]))
  return ids.map((id) => map.get(id)).filter((t): t is Tool => Boolean(t))
}

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryId>('all')
  const deferredQuery = useDeferredValue(query)
  const exploreRef = useRef<HTMLElement>(null)
  const { favorites, recent, toggleFavorite, isFavorite, addRecent } = useFavorites()

  const filtered = useMemo(
    () => searchTools(deferredQuery, category),
    [deferredQuery, category],
  )

  const hotTools = useMemo(() => tools.filter((t) => t.hot), [])
  const favoriteTools = useMemo(() => byIds(favorites), [favorites])
  const recentTools = useMemo(() => byIds(recent), [recent])

  function openTool(tool: Tool) {
    addRecent(tool.id)
    window.open(tool.url, '_blank', 'noopener,noreferrer')
  }

  function goExplore() {
    setTab('explore')
    requestAnimationFrame(() => {
      exploreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const activeHint = categories.find((c) => c.id === category)?.hint ?? ''

  return (
    <div className="app-shell">
      <main className="app-main">
        {tab === 'home' ? (
          <>
            <Hero onExplore={goExplore} />
            <section className="panel home-panel">
              <div className="section-head">
                <h2>热门推荐</h2>
                <button type="button" className="link-btn" onClick={goExplore}>
                  看全部
                </button>
              </div>
              <ToolList
                tools={hotTools}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onOpen={openTool}
              />
              {recentTools.length > 0 ? (
                <>
                  <div className="section-head section-head-spaced">
                    <h2>最近打开</h2>
                  </div>
                  <ToolList
                    tools={recentTools}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                    onOpen={openTool}
                  />
                </>
              ) : null}
            </section>
          </>
        ) : null}

        {tab === 'explore' ? (
          <section className="panel explore-panel" ref={exploreRef}>
            <h2 className="page-title">发现工具</h2>
            <p className="panel-lead">{activeHint} · 已收录 {tools.length} 个</p>
            <SearchBar value={query} onChange={setQuery} />
            <CategoryTabs active={category} onChange={setCategory} />
            <p className="result-count">共 {filtered.length} 个结果</p>
            <ToolList
              tools={filtered}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onOpen={openTool}
            />
          </section>
        ) : null}

        {tab === 'favorites' ? (
          <section className="panel">
            <h2 className="page-title">我的收藏</h2>
            <p className="panel-lead">收藏保存在本机，换设备不会同步。</p>
            <ToolList
              tools={favoriteTools}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onOpen={openTool}
              emptyText="还没有收藏，去发现页挑几个吧"
            />
          </section>
        ) : null}

        {tab === 'submit' ? <SubmitPanel /> : null}
      </main>

      <BottomNav active={tab} onChange={setTab} favoriteCount={favorites.length} />
    </div>
  )
}
