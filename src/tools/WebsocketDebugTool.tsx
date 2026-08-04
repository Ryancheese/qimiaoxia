import { useEffect, useRef, useState } from 'react'

type ConnState = 'idle' | 'connecting' | 'open' | 'closing' | 'closed'

type LogKind = 'system' | 'sent' | 'recv' | 'error'

interface LogItem {
  id: number
  kind: LogKind
  time: string
  text: string
}

const statusLabel: Record<ConnState, string> = {
  idle: '未连接',
  connecting: '连接中…',
  open: '已连接',
  closing: '断开中…',
  closed: '已断开',
}

function nowTime() {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false })
}

export function WebsocketDebugTool() {
  const [url, setUrl] = useState('wss://echo.websocket.events')
  const [protocols, setProtocols] = useState('')
  const [message, setMessage] = useState('{"hello":"world"}')
  const [status, setStatus] = useState<ConnState>('idle')
  const [logs, setLogs] = useState<LogItem[]>([])
  const [autoScroll, setAutoScroll] = useState(true)
  const socketRef = useRef<WebSocket | null>(null)
  const logIdRef = useRef(0)
  const logEndRef = useRef<HTMLDivElement>(null)

  function pushLog(kind: LogKind, text: string) {
    const id = ++logIdRef.current
    setLogs((prev) => [...prev.slice(-199), { id, kind, time: nowTime(), text }])
  }

  useEffect(() => {
    if (!autoScroll) return
    logEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [logs, autoScroll])

  useEffect(() => {
    return () => {
      const ws = socketRef.current
      if (ws) {
        ws.onopen = null
        ws.onmessage = null
        ws.onerror = null
        ws.onclose = null
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close()
        }
      }
    }
  }, [])

  function connect() {
    const target = url.trim()
    if (!target) {
      pushLog('error', '请填写 WebSocket 地址')
      return
    }
    if (!/^wss?:\/\//i.test(target)) {
      pushLog('error', '地址需以 ws:// 或 wss:// 开头')
      return
    }
    if (socketRef.current) {
      pushLog('system', '先断开当前连接')
      disconnect()
    }

    setStatus('connecting')
    pushLog('system', `正在连接 ${target}`)

    try {
      const protoList = protocols
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
      const ws = protoList.length > 0 ? new WebSocket(target, protoList) : new WebSocket(target)
      socketRef.current = ws

      ws.onopen = () => {
        setStatus('open')
        pushLog('system', '连接成功')
      }
      ws.onmessage = (event) => {
        const data =
          typeof event.data === 'string'
            ? event.data
            : event.data instanceof Blob
              ? `[Binary Blob ${event.data.size} bytes]`
              : event.data instanceof ArrayBuffer
                ? `[ArrayBuffer ${event.data.byteLength} bytes]`
                : String(event.data)
        pushLog('recv', data)
      }
      ws.onerror = () => {
        pushLog('error', '连接出错（详见浏览器控制台）')
      }
      ws.onclose = (event) => {
        setStatus('closed')
        socketRef.current = null
        pushLog(
          'system',
          `连接关闭 code=${event.code}${event.reason ? ` reason=${event.reason}` : ''}`,
        )
      }
    } catch (e) {
      setStatus('closed')
      socketRef.current = null
      pushLog('error', e instanceof Error ? e.message : '创建连接失败')
    }
  }

  function disconnect() {
    const ws = socketRef.current
    if (!ws) {
      setStatus('closed')
      return
    }
    setStatus('closing')
    pushLog('system', '主动断开…')
    ws.close(1000, 'client close')
  }

  function send() {
    const ws = socketRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      pushLog('error', '当前未连接，无法发送')
      return
    }
    const payload = message
    try {
      ws.send(payload)
      pushLog('sent', payload)
    } catch (e) {
      pushLog('error', e instanceof Error ? e.message : '发送失败')
    }
  }

  const canConnect = status !== 'connecting' && status !== 'open' && status !== 'closing'
  const canDisconnect = status === 'open' || status === 'connecting'
  const canSend = status === 'open'

  return (
    <div className="tool-stack">
      <label className="field">
        <span>WebSocket URL</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="wss://example.com/ws"
          spellCheck={false}
        />
      </label>
      <label className="field">
        <span>子协议（可选，逗号分隔）</span>
        <input
          value={protocols}
          onChange={(e) => setProtocols(e.target.value)}
          placeholder="如 protocol1, protocol2"
          spellCheck={false}
        />
      </label>

      <div className="tool-actions">
        <span className={`hint ws-status is-${status}`}>{statusLabel[status]}</span>
        <button type="button" className="btn-primary btn-sm" disabled={!canConnect} onClick={connect}>
          连接
        </button>
        <button
          type="button"
          className="btn-ghost btn-sm"
          disabled={!canDisconnect}
          onClick={disconnect}
        >
          断开
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={() => setLogs([])}>
          清空日志
        </button>
      </div>

      <label className="field">
        <span>发送内容</span>
        <textarea
          className="tool-textarea"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="文本或 JSON"
          spellCheck={false}
        />
      </label>
      <div className="tool-actions">
        <button type="button" className="btn-primary btn-sm" disabled={!canSend} onClick={send}>
          发送
        </button>
        <label className="hint ws-autoscroll">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
          />
          自动滚动
        </label>
      </div>

      <div className="ws-log" role="log" aria-live="polite">
        {logs.length === 0 ? (
          <p className="hint">连接后会在这里显示收发与系统日志</p>
        ) : (
          logs.map((item) => (
            <div key={item.id} className={`ws-log-item is-${item.kind}`}>
              <span className="ws-log-meta">
                {item.time} · {kindLabel(item.kind)}
              </span>
              <pre>{item.text}</pre>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  )
}

function kindLabel(kind: LogKind) {
  switch (kind) {
    case 'sent':
      return '发送'
    case 'recv':
      return '接收'
    case 'error':
      return '错误'
    default:
      return '系统'
  }
}
