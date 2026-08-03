import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function useCopy() {
  const [copied, setCopied] = useState(false)

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
      return true
    } catch {
      return false
    }
  }

  return { copied, copy }
}

export function CopyButton({ text, label = '复制' }: { text: string; label?: string }) {
  const { copied, copy } = useCopy()
  return (
    <button type="button" className="btn-ghost btn-sm" onClick={() => void copy(text)} disabled={!text}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? '已复制' : label}
    </button>
  )
}
