import { useMemo, useState } from 'react'
import { CopyButton } from '../components/CopyButton'

const SIGNS = [
  '白羊座',
  '金牛座',
  '双子座',
  '巨蟹座',
  '狮子座',
  '处女座',
  '天秤座',
  '天蝎座',
  '射手座',
  '摩羯座',
  '水瓶座',
  '双鱼座',
] as const

type Sign = (typeof SIGNS)[number]

const MOODS = ['平稳', '小爆发', '需要充电', '灵感在线', '适合整理', '贵人运旺']
const ADVICES = [
  '先把最难的那件事做完，后面会顺很多。',
  '少刷消息，多做一件具体的小事。',
  '今天适合表达，但别急着下结论。',
  '身体信号比计划更重要，记得喝水休息。',
  '财务上谨慎一点，冲动消费先放放。',
  '和重要的人说一句真心话就够了。',
  '把期待调低半格，惊喜会自己来。',
  '适合学习新东西，哪怕只学 20 分钟。',
]

function hashSeed(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function scoreFrom(seed: number, salt: number) {
  const n = (seed + salt * 97) % 41
  return 55 + n // 55-95
}

export function HoroscopeTool() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [sign, setSign] = useState<Sign>('天秤座')

  const fortune = useMemo(() => {
    const seed = hashSeed(`${today}:${sign}`)
    const love = scoreFrom(seed, 1)
    const career = scoreFrom(seed, 2)
    const wealth = scoreFrom(seed, 3)
    const mood = MOODS[seed % MOODS.length]!
    const advice = ADVICES[(seed >> 3) % ADVICES.length]!
    const overall = Math.round((love + career + wealth) / 3)
    return { love, career, wealth, mood, advice, overall }
  }, [sign, today])

  const text = `${today} ${sign}\n综合 ${fortune.overall}\n爱情 ${fortune.love} · 事业 ${fortune.career} · 财运 ${fortune.wealth}\n心情：${fortune.mood}\n建议：${fortune.advice}`

  return (
    <div className="tool-stack">
      <p className="hint">按日期生成的趣味运势，仅供娱乐</p>
      <div className="chip-row wrap">
        {SIGNS.map((item) => (
          <button
            key={item}
            type="button"
            className={sign === item ? 'chip is-on' : 'chip'}
            onClick={() => setSign(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="stat-grid">
        <div className="stat-card compact">
          <p className="hint">综合</p>
          <p className="stat-value small">{fortune.overall}</p>
        </div>
        <div className="stat-card compact">
          <p className="hint">爱情</p>
          <p className="stat-value small">{fortune.love}</p>
        </div>
        <div className="stat-card compact">
          <p className="hint">事业</p>
          <p className="stat-value small">{fortune.career}</p>
        </div>
        <div className="stat-card compact">
          <p className="hint">财运</p>
          <p className="stat-value small">{fortune.wealth}</p>
        </div>
      </div>

      <div className="stat-card">
        <p className="hint">今日心情 · {fortune.mood}</p>
        <p>{fortune.advice}</p>
      </div>

      <CopyButton text={text} label="复制运势" />
    </div>
  )
}
