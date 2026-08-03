import { useEffect, useRef, useState } from 'react'

type NoiseKind = 'rain' | 'ocean' | 'forest' | 'fan'

function createNoise(kind: NoiseKind, ctx: AudioContext) {
  const bufferSize = 2 * ctx.sampleRate
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1
    if (kind === 'rain') {
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    } else if (kind === 'ocean') {
      last = (last + 0.01 * white) / 1.01
      data[i] = last * 4 * (0.6 + 0.4 * Math.sin(i / 12000))
    } else if (kind === 'forest') {
      data[i] = white * 0.15 + (Math.random() > 0.995 ? white * 0.6 : 0)
    } else {
      last = 0.95 * last + 0.05 * white
      data[i] = last
    }
  }
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.loop = true
  const filter = ctx.createBiquadFilter()
  filter.type = kind === 'fan' ? 'lowpass' : 'bandpass'
  filter.frequency.value = kind === 'ocean' ? 400 : kind === 'rain' ? 1200 : kind === 'fan' ? 800 : 2000
  const gain = ctx.createGain()
  gain.gain.value = 0.2
  src.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  return { src, gain }
}

const LABELS: Record<NoiseKind, string> = {
  rain: '雨声',
  ocean: '海浪',
  forest: '森林',
  fan: '风扇',
}

export function WhiteNoise() {
  const [kind, setKind] = useState<NoiseKind>('rain')
  const [playing, setPlaying] = useState(false)
  const [vol, setVol] = useState(0.2)
  const ref = useRef<{ ctx: AudioContext; src: AudioBufferSourceNode; gain: GainNode } | null>(null)

  function stop() {
    try {
      ref.current?.src.stop()
      void ref.current?.ctx.close()
    } catch {
      /* ignore */
    }
    ref.current = null
    setPlaying(false)
  }

  async function start(next: NoiseKind = kind) {
    stop()
    const ctx = new AudioContext()
    const { src, gain } = createNoise(next, ctx)
    gain.gain.value = vol
    src.start()
    ref.current = { ctx, src, gain }
    setPlaying(true)
  }

  useEffect(() => () => stop(), [])

  useEffect(() => {
    if (ref.current) ref.current.gain.gain.value = vol
  }, [vol])

  return (
    <div className="tool-stack center-stack">
      <div className="chip-row wrap">
        {(Object.keys(LABELS) as NoiseKind[]).map((k) => (
          <button
            key={k}
            type="button"
            className={kind === k ? 'chip is-on' : 'chip'}
            onClick={() => {
              setKind(k)
              if (playing) void start(k)
            }}
          >
            {LABELS[k]}
          </button>
        ))}
      </div>
      <label className="field">
        <span>音量 {Math.round(vol * 100)}%</span>
        <input
          type="range"
          min={0}
          max={0.6}
          step={0.01}
          value={vol}
          onChange={(e) => setVol(Number(e.target.value))}
        />
      </label>
      <button
        type="button"
        className="btn-primary"
        onClick={() => (playing ? stop() : void start())}
      >
        {playing ? '停止' : '播放'}
      </button>
      <p className="hint">纯前端合成，无需联网；请调高手机媒体音量。</p>
    </div>
  )
}
