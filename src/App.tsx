import { Suspense, useDeferredValue, useMemo, useRef, useState } from 'react'
import { Hero } from './components/Hero'
import { SearchBar } from './components/SearchBar'
import { CategoryTabs } from './components/CategoryTabs'
import { ToolList } from './components/ToolList'
import { BottomNav, type TabId } from './components/BottomNav'
import { SubmitPanel } from './components/SubmitPanel'
import { ToolShell } from './components/ToolShell'
import { categories, getTool, searchTools, tools, type CategoryId, type ToolId, type ToolMeta } from './data/tools'
import { useFavorites } from './hooks/useFavorites'
import { toolComponents } from './tools'
import './App.css'

function byIds(ids: string[]): ToolMeta[] {
  return ids.map((id) => getTool(id)).filter((t): t is ToolMeta => Boolean(t))
}

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryId>('all')
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(null)
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

  function openTool(tool: ToolMeta) {
    addRecent(tool.id)
    setActiveToolId(tool.id)
  }

  function goExplore() {
    setActiveToolId(null)
    setTab('explore')
    requestAnimationFrame(() => {
      exploreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function changeTab(next: TabId) {
    setActiveToolId(null)
    setTab(next)
  }

  const activeHint = categories.find((c) => c.id === category)?.hint ?? ''
  const activeTool = activeToolId ? getTool(activeToolId) : undefined
  const ActiveComponent = activeToolId ? toolComponents[activeToolId] : null

  if (activeTool && ActiveComponent) {
    return (
      <div className="app-shell tool-mode">
        <ToolShell
          title={activeTool.name}
          subtitle={activeTool.desc}
          onBack={() => setActiveToolId(null)}
          actions={
            <button
              type="button"
              className={isFavorite(activeTool.id) ? 'fav-btn bar is-on' : 'fav-btn bar'}
              onClick={() => toggleFavorite(activeTool.id)}
              aria-label="收藏"
            >
              ♥
            </button>
          }
        >
          <Suspense fallback={<p className="empty-state">工具加载中…</p>}>
            <ActiveComponent />
          </Suspense>
        </ToolShell>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        {tab === 'home' ? (
          <>
            <Hero onExplore={goExplore} toolCount={tools.length} />
            <section className="panel home-panel">
              <div className="section-head">
                <h2>热门工具</h2>
                <button type="button" className="link-btn" onClick={goExplore}>
                  全部
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
                    <h2>最近使用</h2>
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
            <p className="panel-lead">
              {activeHint} · 已内置 {tools.length} 个
            </p>
            <SearchBar value={query} onChange={setQuery} placeholder="搜索内置工具…" />
            <CategoryTabs active={category} onChange={setCategory} />
            <p className="result-count">共 {filtered.length} 个工具</p>
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
            <p className="panel-lead">收藏保存在本机，随时一触即达。</p>
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

      <BottomNav active={tab} onChange={changeTab} favoriteCount={favorites.length} />
    </div>
  )
}
