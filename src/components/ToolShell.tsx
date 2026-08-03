import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

interface ToolShellProps {
  title: string
  subtitle?: string
  onBack: () => void
  children: ReactNode
  actions?: ReactNode
}

export function ToolShell({ title, subtitle, onBack, children, actions }: ToolShellProps) {
  return (
    <section className="tool-shell">
      <header className="tool-shell-bar">
        <button type="button" className="back-btn" onClick={onBack} aria-label="返回">
          <ArrowLeft size={20} />
        </button>
        <div className="tool-shell-titles">
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div className="tool-shell-actions">{actions}</div> : <span className="tool-shell-spacer" />}
      </header>
      <div className="tool-shell-body">{children}</div>
    </section>
  )
}
