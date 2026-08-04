import { useMemo, useState } from 'react'
import { CopyButton } from '../components/CopyButton'

const UPPER = [
  '春风得意马蹄疾',
  '青山不老松常绿',
  '海阔凭鱼跃',
  '一帆风顺年年好',
  '福如东海长流水',
  '云开日出光照暖',
  '竹报平安如意事',
  '花香鸟语春光好',
]

const LOWER: Record<string, string> = {
  春风得意马蹄疾: '一日看尽长安花',
  青山不老松常绿: '碧水长流柳更青',
  海阔凭鱼跃: '天高任鸟飞',
  一帆风顺年年好: '万事如意步步高',
  福如东海长流水: '寿比南山不老松',
  云开日出光照暖: '雨过天晴花更红',
  竹报平安如意事: '梅开五福吉祥年',
  花香鸟语春光好: '人寿年丰喜事多',
}

const CHAR_MAP: Record<string, string[]> = {
  春: ['秋', '冬', '夏'],
  风: ['雨', '雪', '月'],
  得: ['失', '见', '遇'],
  意: ['心', '情', '志'],
  马: ['牛', '龙', '鹤'],
  蹄: ['角', '爪', '翼'],
  疾: ['缓', '稳', '徐'],
  青: ['绿', '碧', '翠'],
  山: ['水', '海', '湖'],
  不: ['常', '永', '自'],
  老: ['新', '幼', '少'],
  松: ['竹', '梅', '柳'],
  常: ['更', '自', '长'],
  绿: ['青', '翠', '红'],
  海: ['天', '江', '湖'],
  阔: ['高', '远', '深'],
  凭: ['任', '随', '依'],
  鱼: ['鸟', '雁', '鹤'],
  跃: ['飞', '翔', '游'],
  一: ['万', '百', '千'],
  帆: ['船', '桨', '舟'],
  顺: ['畅', '通', '达'],
  年: ['岁', '日', '季'],
  好: ['高', '兴', '吉'],
  福: ['寿', '禄', '喜'],
  如: ['似', '比', '同'],
  东: ['南', '西', '北'],
  长: ['远', '久', '深'],
  流: ['涌', '淌', '奔'],
  水: ['山', '云', '潮'],
}

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function inventLower(upper: string) {
  return [...upper]
    .map((ch) => {
      const options = CHAR_MAP[ch]
      return options ? pick(options) : ch
    })
    .join('')
}

export function CoupletTool() {
  const [keyword, setKeyword] = useState('')
  const [upper, setUpper] = useState(UPPER[0])
  const [lower, setLower] = useState(LOWER[UPPER[0]])

  function generate() {
    const seed = keyword.trim()
    let nextUpper = pick(UPPER)
    if (seed) {
      const hit = UPPER.find((item) => item.includes(seed[0]!))
      nextUpper = hit ?? `${seed[0]}${pick(UPPER).slice(1)}`
    }
    const nextLower = LOWER[nextUpper] ?? inventLower(nextUpper)
    setUpper(nextUpper)
    setLower(nextLower)
  }

  const text = useMemo(() => `上联：${upper}\n下联：${lower}`, [upper, lower])

  return (
    <div className="tool-stack">
      <label className="field">
        <span>可选关键字（取首字灵感）</span>
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="如：春 / 福" />
      </label>
      <button type="button" className="btn-primary" onClick={generate}>
        生成对联
      </button>
      <pre className="tool-pre poem">{text}</pre>
      <CopyButton text={text} />
      <p className="hint">偏娱乐向，正式场合请再润色</p>
    </div>
  )
}
