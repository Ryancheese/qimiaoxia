import { useMemo, useState } from 'react'

type TrashType = '可回收物' | '有害垃圾' | '厨余垃圾' | '其他垃圾'

const DB: { name: string; type: TrashType }[] = [
  { name: '塑料瓶', type: '可回收物' },
  { name: '易拉罐', type: '可回收物' },
  { name: '报纸', type: '可回收物' },
  { name: '纸箱', type: '可回收物' },
  { name: '玻璃瓶', type: '可回收物' },
  { name: '旧衣服', type: '可回收物' },
  { name: '电池', type: '有害垃圾' },
  { name: '灯管', type: '有害垃圾' },
  { name: '过期药品', type: '有害垃圾' },
  { name: '油漆桶', type: '有害垃圾' },
  { name: '温度计', type: '有害垃圾' },
  { name: '剩饭剩菜', type: '厨余垃圾' },
  { name: '果皮', type: '厨余垃圾' },
  { name: '茶叶渣', type: '厨余垃圾' },
  { name: '骨头', type: '厨余垃圾' },
  { name: '菜叶', type: '厨余垃圾' },
  { name: '尘土', type: '其他垃圾' },
  { name: '烟头', type: '其他垃圾' },
  { name: '一次性餐具', type: '其他垃圾' },
  { name: '尿不湿', type: '其他垃圾' },
  { name: '破碎陶瓷', type: '其他垃圾' },
  { name: '口罩', type: '其他垃圾' },
]

export function TrashSort() {
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const s = q.trim()
    if (!s) return DB
    return DB.filter((x) => x.name.includes(s) || x.type.includes(s))
  }, [q])

  return (
    <div className="tool-stack">
      <input
        className="tool-input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="输入垃圾名称，如：电池"
      />
      <ul className="trash-list">
        {list.map((x) => (
          <li key={x.name}>
            <span>{x.name}</span>
            <span className={`trash-tag t-${x.type}`}>{x.type}</span>
          </li>
        ))}
      </ul>
      {list.length === 0 ? <p className="empty-state">暂未收录，可换个关键词试试</p> : null}
    </div>
  )
}
