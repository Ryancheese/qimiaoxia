import { useState } from 'react'
import { CopyButton } from '../components/CopyButton'

const MAP: Record<string, string> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  ' ': '/',
}

const REV = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [v, k]))

export function MorseTool() {
  const [input, setInput] = useState('HELLO')
  const [output, setOutput] = useState('')

  function encode() {
    const out = input
      .toUpperCase()
      .split('')
      .map((c) => MAP[c] || '')
      .filter(Boolean)
      .join(' ')
    setOutput(out)
  }

  function decode() {
    const out = input
      .trim()
      .split(/\s+/)
      .map((c) => REV[c] || '?')
      .join('')
    setOutput(out)
  }

  return (
    <div className="tool-stack">
      <p className="hint">支持英文字母、数字与空格。中文请先转拼音再编码。</p>
      <textarea className="tool-textarea" rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="tool-actions">
        <button type="button" className="btn-primary btn-sm" onClick={encode}>
          编码
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={decode}>
          解码
        </button>
      </div>
      {output ? (
        <>
          <div className="tool-actions">
            <span className="hint">结果</span>
            <CopyButton text={output} />
          </div>
          <pre className="tool-pre">{output}</pre>
        </>
      ) : null}
    </div>
  )
}
