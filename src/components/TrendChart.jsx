import { formatDateShort } from '../utils/helpers.jsx'

const SERIES = [
  { key: 'ir', color: 'var(--red-line)', label: 'Inherent risk' },
  { key: 'rr', color: 'var(--green-line)', label: 'Residual risk' }
]

export default function TrendChart({ data, width = 480, height = 150, maxY = 25 }) {
  const pad = { l: 24, r: 12, t: 12, b: 22 }
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b
  const n = data.length
  const stepX = n > 1 ? innerW / (n - 1) : 0

  const x = i => pad.l + i * stepX
  const y = v => pad.t + innerH - (v / maxY) * innerH

  const gridLines = [0, Math.round(maxY / 2), maxY]

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Inherent vs residual risk score trend">
        {gridLines.map(g => (
          <g key={g}>
            <line x1={pad.l} x2={width - pad.r} y1={y(g)} y2={y(g)} stroke="var(--line-soft)" strokeWidth="1" />
            <text x={2} y={y(g) + 3} fontSize="9" fill="var(--ink-faint)">{g}</text>
          </g>
        ))}

        {SERIES.map(s => (
          <polyline
            key={s.key}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={data.map((d, i) => `${x(i)},${y(d[s.key])}`).join(' ')}
          />
        ))}

        {SERIES.map(s => (
          <g key={s.key}>
            {data.map((d, i) => (
              <circle key={i} cx={x(i)} cy={y(d[s.key])} r="3" fill={s.color} />
            ))}
          </g>
        ))}

        {data.map((d, i) => (
          (n <= 6 || i === 0 || i === n - 1) && (
            <text key={i} x={x(i)} y={height - 4} fontSize="9" fill="var(--ink-faint)" textAnchor="middle">
              {formatDateShort(d.date).replace(/ \d{4}$/, '')}
            </text>
          )
        ))}
      </svg>
      <div className="trend-legend">
        {SERIES.map(s => (
          <span key={s.key}><i style={{ background: s.color }} />{s.label}</span>
        ))}
      </div>
    </div>
  )
}
