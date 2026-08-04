import { useState } from 'react'
import { CopyButton } from '../components/CopyButton'

const RIDDLES = [
  { q: '什么东西越洗越脏？', a: '水' },
  { q: '什么门永远关不上？', a: '球门' },
  { q: '哪个月份有二十八天？', a: '每个月都有' },
  { q: '什么瓜不能吃？', a: '傻瓜' },
  { q: '小明上楼为什么气喘吁吁？', a: '因为他没坐电梯' },
  { q: '什么东西有头无脚？', a: '针 / 火柴' },
  { q: '什么布剪不断？', a: '瀑布' },
  { q: '什么帽不能戴？', a: '螺丝帽' },
  { q: '什么蛋打不破？', a: '鸡蛋的“蛋”字 / 脸蛋（玩笑）' },
  { q: '什么车最干净？', a: '洒水车' },
  { q: '什么东西越热越爱出汗？', a: '冰箱' },
  { q: '什么字人人都写错？', a: '错' },
  { q: '一只青蛙有几条腿？', a: '两只前腿，两只后腿' },
  { q: '什么东西装满了却还是空的？', a: '日历 / 洞' },
  { q: '什么酒不能喝？', a: '碘酒' },
]

function pickIndex(exclude: number) {
  if (RIDDLES.length <= 1) return 0
  let next = Math.floor(Math.random() * RIDDLES.length)
  while (next === exclude) next = Math.floor(Math.random() * RIDDLES.length)
  return next
}

export function RiddleTool() {
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const item = RIDDLES[index]!

  function next() {
    setIndex((prev) => pickIndex(prev))
    setShowAnswer(false)
  }

  return (
    <div className="tool-stack">
      <p className="hint">脑筋急转弯 · 本地题库</p>
      <pre className="tool-pre poem">{item.q}</pre>
      {showAnswer ? (
        <>
          <p className="hint ok">答案：{item.a}</p>
          <CopyButton text={`问：${item.q}\n答：${item.a}`} />
        </>
      ) : (
        <button type="button" className="btn-ghost btn-sm" onClick={() => setShowAnswer(true)}>
          看答案
        </button>
      )}
      <button type="button" className="btn-primary" onClick={next}>
        下一题
      </button>
    </div>
  )
}
