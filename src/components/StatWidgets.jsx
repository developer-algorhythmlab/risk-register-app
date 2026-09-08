import { useEffect, useState } from 'react'

export function CountUp({ target }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let cur = 0
    let raf
    const step = Math.max(1, Math.ceil(target / 16))
    const tick = () => {
      cur = Math.min(target, cur + step)
      setN(cur)
      if (cur < target) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return <>{n}</>
}

export function AnimatedBar({ pct, className }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setW(pct)))
    return () => cancelAnimationFrame(raf)
  }, [pct])
  return (
    <div className="bar-track">
      <div className={'bar-fill ' + (className || '')} style={{ width: w + '%' }} />
    </div>
  )
}

export function StatTile({ label, value, tone }) {
  return (
    <div className={'metric' + (tone ? ' tone-' + tone : '')}>
      <div className="num"><CountUp target={value} /></div>
      <div className="lbl">{label}</div>
    </div>
  )
}
