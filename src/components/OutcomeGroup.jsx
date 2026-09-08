import { useEffect, useState } from 'react'
import { scoreClass, statusLabel, StatusFace } from '../utils/helpers.jsx'

function ProgressBar({ pct }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setWidth(pct)))
    return () => cancelAnimationFrame(raf)
  }, [pct])
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: width + '%' }} />
    </div>
  )
}

export default function OutcomeGroup({ outcome, risks, onSelectRisk }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={'outcome' + (collapsed ? ' collapsed' : '')}>
      <div className="outcome-head" onClick={() => setCollapsed(c => !c)}>
        <span>
          {outcome.toUpperCase()} <span className="count">{risks.length} risk{risks.length > 1 ? 's' : ''}</span>
        </span>
        <span className="chev">&#9662;</span>
      </div>
      <div className="outcome-body">
        <div>
          <table>
            <colgroup>
              <col style={{ width: 34 }} />
              <col />
              <col style={{ width: 110 }} />
              <col style={{ width: 50 }} />
              <col style={{ width: 50 }} />
              <col style={{ width: 110 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 170 }} />
            </colgroup>
            <thead>
              <tr>
                <th>Nr</th><th>Risk / Business unit</th><th>Category</th><th>IR</th><th>RR</th>
                <th>Response</th><th>Progress</th><th>Owner / status</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r, i) => (
                <tr
                  key={r.nr}
                  className="risk-row"
                  style={{ animationDelay: (i * 35) + 'ms' }}
                  onClick={() => onSelectRisk(r)}
                >
                  <td>{r.nr}</td>
                  <td>
                    <div className="risk-name">{r.risk}</div>
                    <div className="sub">{r.businessUnit}</div>
                  </td>
                  <td className="sub">{r.category}</td>
                  <td><span className={'score ' + scoreClass(r.ir)}>{r.ir}</span></td>
                  <td><span className={'score ' + scoreClass(r.rr)}>{r.rr}</span></td>
                  <td className="sub">{r.response}</td>
                  <td>
                    <div className="sub">{r.progressPct}%</div>
                    <ProgressBar pct={r.progressPct} />
                  </td>
                  <td>
                    <div className="sub">{r.owner}</div>
                    <div className="status-cell">
                      <StatusFace status={r.status} />
                      <span className="status-label">{statusLabel[r.status]}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
