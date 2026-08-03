import { useMemo, useState } from 'react'
import { CopyButton } from '../components/CopyButton'

const LINES: Record<string, string[]> = {
  春: ['春风轻拂柳丝长', '春色满园花事忙', '春雨润物细无声', '春日迟迟暖意生'],
  夏: ['夏日炎炎蝉声起', '夏荷映水影依依', '夏云如峰映碧空', '夏夜萤火点点明'],
  秋: ['秋月明净照窗纱', '秋风送爽入万家', '秋叶飘零满径黄', '秋水共长天一色'],
  冬: ['冬雪纷纷银装裹', '冬梅傲骨立寒坡', '冬日暖阳洒山河', '冬夜围炉话更多'],
  爱: ['爱意深藏不言中', '爱到极致是包容', '爱如灯火暖长空', '爱在日常细微中'],
  梦: ['梦想点亮前行路', '梦里花开满庭树', '梦随云帆济沧海', '梦醒仍是少年心'],
  奇: ['奇思妙想入云端', '奇迹往往在眼前', '奇峰迭起风光好', '奇文共赏意绵绵'],
  妙: ['妙手偶得佳句来', '妙不可言是情怀', '妙笔生花写未来', '妙趣横生笑颜开'],
  匣: ['匣中珍藏万千意', '匣启一缕清风起', '匣里乾坤藏智慧', '匣开见日满心喜'],
  你: ['你是人间四月天', '你眼有光如星悬', '你一笑倾尽岁月', '你来春色自无边'],
  我: ['我以青春赴山海', '我心匪石不可转', '我自横刀向天笑', '我见青山多妩媚'],
  心: ['心有猛虎细嗅蔷', '心底澄明见远方', '心安即是归处好', '心灯不灭夜自光'],
  福: ['福到门前喜气浓', '福满人间万事通', '福星高照平安夜', '福泽绵长乐融融'],
  安: ['安得广厦千万间', '安然自若度流年', '安心即是避风港', '安步当车看云闲'],
  好: ['好风凭借力飞扬', '好景常在心头亮', '好花终有盛开日', '好梦圆时月正光'],
}

const DEFAULT = ['清风徐来水波兴', '明月何时照我还', '一蓑烟雨任平生', '山高水长意悠悠', '岁月静好现安稳']

function pick(char: string, used: Set<string>) {
  const pool = LINES[char] || DEFAULT
  for (const line of pool) {
    if (!used.has(line)) {
      used.add(line)
      return line
    }
  }
  return pool[Math.floor(Math.random() * pool.length)]
}

export function Acrostic() {
  const [word, setWord] = useState('奇妙匣')
  const [seed, setSeed] = useState(0)

  const poem = useMemo(() => {
    void seed
    const chars = word.trim().split('').filter(Boolean).slice(0, 8)
    const used = new Set<string>()
    return chars.map((c) => `${c}：${pick(c, used)}`)
  }, [word, seed])

  return (
    <div className="tool-stack">
      <label className="field">
        <span>输入藏头字（建议 2-8 字）</span>
        <input value={word} onChange={(e) => setWord(e.target.value)} maxLength={8} />
      </label>
      <button type="button" className="btn-primary" onClick={() => setSeed((s) => s + 1)}>
        生成藏头诗
      </button>
      {poem.length ? (
        <div className="stat-card">
          <pre className="tool-pre poem">{poem.join('\n')}</pre>
          <CopyButton text={poem.join('\n')} />
        </div>
      ) : null}
    </div>
  )
}
