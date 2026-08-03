import { useMemo, useState } from 'react'

function bmiLevel(bmi: number) {
  if (bmi < 18.5) return { label: '偏瘦', color: '#7dffc4' }
  if (bmi < 24) return { label: '正常', color: '#c8f542' }
  if (bmi < 28) return { label: '偏胖', color: '#ffc857' }
  return { label: '肥胖', color: '#ff8a7a' }
}

export function BmiTool() {
  const [cm, setCm] = useState(170)
  const [kg, setKg] = useState(60)

  const bmi = useMemo(() => {
    const m = cm / 100
    if (m <= 0) return 0
    return kg / (m * m)
  }, [cm, kg])

  const level = bmiLevel(bmi)

  return (
    <div className="tool-stack">
      <label className="field">
        <span>身高 {cm} cm</span>
        <input type="range" min={120} max={220} value={cm} onChange={(e) => setCm(Number(e.target.value))} />
      </label>
      <label className="field">
        <span>体重 {kg} kg</span>
        <input type="range" min={30} max={150} value={kg} onChange={(e) => setKg(Number(e.target.value))} />
      </label>
      <div className="stat-card center-stack">
        <p className="hint">BMI</p>
        <p className="stat-value" style={{ color: level.color }}>
          {bmi.toFixed(1)}
        </p>
        <p>{level.label}</p>
        <p className="hint">参考中国成人标准，仅供娱乐参考，不构成医疗建议。</p>
      </div>
    </div>
  )
}
