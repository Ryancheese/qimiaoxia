import { useState } from 'react'
import { CopyButton } from '../components/CopyButton'

const RAINBOW = [
  '你不是人间理想，你是理想本身。',
  '今天的风很甜，大概是因为吹过了你。',
  '你一出现，平平无奇的日子也开始闪光。',
  '别人靠滤镜，你靠本人。',
  '你走路带风，风都不好意思抢戏。',
  '你认真的样子，能把周一变成周五。',
  '宇宙很大，但我的目光很专一。',
  '你不是锦上添花，你是雪中送炭再加朵花。',
  '你说话温柔，连标点符号都在微笑。',
  '如果可爱能充电，你就是移动电站。',
  '你的存在，让普通也变得值得截图。',
  '再难的题，也挡不住你眼里的光。',
]

const THURSDAY = [
  '今天疯狂星期四，V我50，请你吃炸鸡！',
  '兄弟，星期四了，不V50说得过去吗？',
  'KFC疯狂星期四，我可以不吃，但你不能V我。',
  '有人说爱要说出口，所以：V我50。',
  '你先V我50，剩下的我们慢慢聊。',
  '不是我想吃炸鸡，是星期四它先惹我。',
  '这不是乞讨，这是星期四仪式感。',
]

const SCUMBAG = [
  '我不是不爱你，我是更爱自由。',
  '你很好，但我配不上……也没打算配。',
  '我们就是差一个合适的时机，比如永远。',
  '别误会，我对每个人都这么温柔。',
  '我没骗你，我只是没把实话说完。',
  '你要想开点，我本来就这样。',
]

const SIMP = [
  '今天她已读不回，我把聊天记录又看了三遍，发现原来是我不够好。',
  '她说下雨了，我立刻跑去给她送伞。到了才知道她在家没出门。',
  '我问她吃了吗，她说吃了。我又问好喝吗。她说你有病吧。我想她开始关心我了。',
  '她朋友圈点了别人赞，我把相册里她的照片又精修了一遍。',
  '今天她说“嗯”，我高兴得像中了彩票。',
]

const QUESTIONS = [
  '如果动物会开会，狮子和企鹅谁当主席？',
  '你愿意用一年寿命换一次重生选角色吗？',
  '假如情绪有颜色，你今天是什么色号？',
  '如果手机突然有了自我意识，它最想卸载哪个 App？',
  '你和平行世界的自己见面，会先问什么？',
  '云会不会也有KPI？',
  '如果梦可以续集，你想续哪一段？',
]

const ANSWERS = [
  '是的',
  '不是现在',
  '再等等',
  '放手吧',
  '值得一试',
  '答案就在你心里',
  '别想太多',
  '会好起来的',
  '换个角度',
  '相信自己',
  '时机未到',
  '立刻行动',
  '保持沉默',
  '问问朋友',
  '这是一个机会',
  '不必勉强',
  '继续坚持',
  '重新开始',
  '顺其自然',
  '大胆一点',
]

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function RainbowFart() {
  const [text, setText] = useState(pick(RAINBOW))
  return (
    <Generator title="再夸一句" text={text} onNext={() => setText(pick(RAINBOW))} />
  )
}

export function CrazyThursday() {
  const [text, setText] = useState(pick(THURSDAY))
  return <Generator title="再来一条" text={text} onNext={() => setText(pick(THURSDAY))} />
}

export function ScumbagQuotes() {
  const [text, setText] = useState(pick(SCUMBAG))
  return (
    <div className="tool-stack">
      <p className="hint">纯属娱乐，请勿用于真实伤害。</p>
      <Generator title="下一条" text={text} onNext={() => setText(pick(SCUMBAG))} />
    </div>
  )
}

export function SimpDiary() {
  const [text, setText] = useState(pick(SIMP))
  return <Generator title="下一天" text={text} onNext={() => setText(pick(SIMP))} />
}

export function RandomQ() {
  const [text, setText] = useState(pick(QUESTIONS))
  return <Generator title="换个脑洞" text={text} onNext={() => setText(pick(QUESTIONS))} />
}

export function BookOfAnswers() {
  const [ready, setReady] = useState(false)
  const [answer, setAnswer] = useState('')
  const [shake, setShake] = useState(false)

  function reveal() {
    setShake(true)
    window.setTimeout(() => {
      setAnswer(pick(ANSWERS))
      setReady(true)
      setShake(false)
    }, 700)
  }

  return (
    <div className="tool-stack center-stack">
      <p className="hint">心中默念问题，然后翻开答案之书。</p>
      <div className={shake ? 'answer-book is-shake' : 'answer-book'}>
        {ready ? <p className="answer-text">{answer}</p> : <p className="hint">准备好了吗？</p>}
      </div>
      <button type="button" className="btn-primary" onClick={reveal}>
        {ready ? '再问一次' : '翻开书页'}
      </button>
    </div>
  )
}

function Generator({
  title,
  text,
  onNext,
}: {
  title: string
  text: string
  onNext: () => void
}) {
  return (
    <div className="tool-stack">
      <div className="stat-card">
        <p className="quote-text">{text}</p>
        <div className="tool-actions">
          <button type="button" className="btn-primary btn-sm" onClick={onNext}>
            {title}
          </button>
          <CopyButton text={text} />
        </div>
      </div>
    </div>
  )
}
