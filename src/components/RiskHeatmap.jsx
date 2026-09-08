import { scoreClass } from '../utils/helpers.jsx'

const IMPACT_ROWS = [5, 4, 3, 2, 1]
const LIKELIHOOD_COLS = [1, 2, 3, 4, 5]

export default function RiskHeatmap({ risks, likelihoodKey, impactKey, size = 'lg', onCellClick }) {
  const cellSize = size === 'sm' ? 30 : 42

  function risksInCell(likelihood, impact) {
    return risks.filter(r => r[likelihoodKey] === likelihood && r[impactKey] === impact)
  }

  return (
    <div className="heatmap">
      <div className="heatmap-axis-y">Impact</div>
      <div className="heatmap-grid" style={{ gridTemplateColumns: `28px repeat(5, ${cellSize}px)` }}>
        {IMPACT_ROWS.map(impact => (
          <div className="heatmap-row" key={impact} style={{ display: 'contents' }}>
            <div className="heatmap-rowlabel">{impact}</div>
            {LIKELIHOOD_COLS.map(likelihood => {
              const inCell = risksInCell(likelihood, impact)
              const cls = scoreClass(likelihood * impact)
              const clickable = Boolean(onCellClick && inCell.length)
              return (
                <div
                  key={likelihood}
                  className={'heatmap-cell ' + cls + (clickable ? ' clickable' : '')}
                  style={{ width: cellSize, height: cellSize }}
                  title={inCell.length ? inCell.map(r => r.risk).join('\n') : `Likelihood ${likelihood} × Impact ${impact}`}
                  onClick={clickable ? () => onCellClick(inCell) : undefined}
                >
                  {inCell.length > 0 && inCell.length}
                </div>
              )
            })}
          </div>
        ))}
        <div />
        {LIKELIHOOD_COLS.map(l => <div className="heatmap-collabel" key={l}>{l}</div>)}
      </div>
      <div className="heatmap-axis-x">Likelihood</div>
    </div>
  )
}
