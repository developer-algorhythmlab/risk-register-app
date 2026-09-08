import { useMemo } from 'react'
import { CURRENT_USER, BOARD_STAGES } from '../data/risks.js'
import { formatDateShort, computePortfolioTrend } from '../utils/helpers.jsx'
import { getReminders } from '../utils/reminders.js'
import { StatTile, AnimatedBar } from './StatWidgets.jsx'
import RiskHeatmap from './RiskHeatmap.jsx'
import TrendChart from './TrendChart.jsx'

function ReminderRow({ item, onOpenRisk }) {
  return (
    <div className={'reminder-row ' + item.severity} onClick={() => onOpenRisk(item.riskNr)}>
      <div className="reminder-main">
        <div className="reminder-label">{item.label}</div>
        <div className="sub">{item.businessUnit} · {item.kind}</div>
      </div>
      <div className="reminder-when">
        {item.severity === 'overdue' ? `${Math.abs(item.days)}d overdue` : item.days === 0 ? 'Due today' : `Due in ${item.days}d`}
      </div>
    </div>
  )
}

export default function DashboardView({ risks, boardCards, role, onNavigate, onOpenRisk, onOpenProposalReview, onOpenCard, onQuickAdd }) {
  const isRiskMgmt = role === 'riskmgmt'
  const scope = isRiskMgmt ? risks : risks.filter(r => r.businessUnit === CURRENT_USER.businessUnit)
  const scopeCards = isRiskMgmt ? boardCards : boardCards.filter(c => c.businessUnit === CURRENT_USER.businessUnit)

  const counts = useMemo(() => {
    const c = { green: 0, amber: 0, red: 0 }
    scope.forEach(r => c[r.status]++)
    return c
  }, [scope])
  const highRisk = scope.filter(r => r.ir >= 20).length

  const reminders = useMemo(() => getReminders(scope, { withinDays: 30 }), [scope])
  const overdue = reminders.filter(r => r.severity === 'overdue')
  const dueSoon = reminders.filter(r => r.severity === 'due-soon')

  const pendingProposals = useMemo(
    () => risks.filter(r => r.pendingChange && (isRiskMgmt || r.businessUnit === CURRENT_USER.businessUnit)),
    [risks, isRiskMgmt]
  )

  const byBU = useMemo(() => {
    const o = {}
    scope.forEach(r => { o[r.businessUnit] = (o[r.businessUnit] || 0) + 1 })
    return o
  }, [scope])
  const maxBU = Math.max(1, ...Object.values(byBU))

  const stageCounts = useMemo(() => {
    const o = {}
    BOARD_STAGES.forEach(s => { o[s] = 0 })
    scopeCards.forEach(c => { o[c.stage] = (o[c.stage] || 0) + 1 })
    return o
  }, [scopeCards])

  const activeCards = scopeCards.filter(c => c.stage !== 'Report prepared').slice(0, 5)
  const trend = useMemo(() => computePortfolioTrend(scope), [scope])

  return (
    <div className="view-enter">
      <div className="dash-hero">
        <div>
          <div className="dash-hero-eyebrow">{isRiskMgmt ? 'Risk management office' : `${CURRENT_USER.businessUnit} · Risk official`}</div>
          <h2>Welcome back, {CURRENT_USER.name}</h2>
          <p>
            {isRiskMgmt
              ? 'Province-wide view across every business unit — approvals, assessment requests, and risk posture in one place.'
              : `Here's what needs your attention in ${CURRENT_USER.businessUnit}.`}
          </p>
        </div>
        {isRiskMgmt && (
          <button className="btn hero-btn" onClick={onQuickAdd}>+ Add risk</button>
        )}
      </div>

      <div className="metrics">
        <StatTile label={isRiskMgmt ? 'Total risks (province)' : 'Risks in my business unit'} value={scope.length} />
        <StatTile label="High inherent risk (IR ≥ 20)" value={highRisk} />
        <StatTile label="On track" value={counts.green} />
        <StatTile label="Needs attention (at risk + delayed)" value={counts.amber + counts.red} />
      </div>

      <div className="report-grid">
        <div className="report-card">
          <h4>{isRiskMgmt ? 'Pending approvals' : 'My proposed changes'}</h4>
          {pendingProposals.length === 0 ? (
            <div className="sub">Nothing awaiting approval.</div>
          ) : (
            <div className="approval-list">
              {pendingProposals.map(r => (
                <div className="approval-row" key={r.nr}>
                  <div>
                    <div className="approval-title">{r.risk}</div>
                    <div className="sub">{r.businessUnit} · proposed by {r.pendingChange.proposedBy} · {formatDateShort(r.pendingChange.proposedAt)}</div>
                  </div>
                  {isRiskMgmt ? (
                    <button className="btn sm" onClick={() => onOpenProposalReview(r.nr)}>Review</button>
                  ) : (
                    <button className="btn ghost sm" onClick={() => onOpenRisk(r.nr)}>View</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="report-card">
          <h4>Attention needed</h4>
          {reminders.length === 0 ? (
            <div className="sub">No overdue or upcoming deadlines in the next 30 days.</div>
          ) : (
            <div className="reminder-list">
              {overdue.slice(0, 4).map(item => <ReminderRow key={item.id} item={item} onOpenRisk={onOpenRisk} />)}
              {dueSoon.slice(0, 4).map(item => <ReminderRow key={item.id} item={item} onOpenRisk={onOpenRisk} />)}
            </div>
          )}
        </div>

        <div className="report-card">
          <h4>Risk heat map (inherent)</h4>
          <RiskHeatmap risks={scope} likelihoodKey="irLikelihood" impactKey="irImpact" size="sm" />
        </div>

        <div className="report-card">
          <h4>Risk score trend</h4>
          {trend.length >= 2 ? (
            <TrendChart data={trend} height={170} />
          ) : (
            <div className="sub">Not enough reassessment history yet.</div>
          )}
        </div>

        <div className="report-card">
          <h4>Assessment requests</h4>
          <div className="stage-summary">
            {BOARD_STAGES.map(s => (
              <div key={s} className="stage-summary-item">
                <div className="stage-summary-count">{stageCounts[s]}</div>
                <div className="sub">{s}</div>
              </div>
            ))}
          </div>
          {activeCards.length > 0 && (
            <div className="board-mini-list">
              {activeCards.map(c => (
                <div className="board-mini-row" key={c.id} onClick={() => onOpenCard(c)}>
                  <span>{c.risk}</span>
                  <span className="sub">{c.stage}</span>
                </div>
              ))}
            </div>
          )}
          <button type="button" className="link-btn" onClick={() => onNavigate('board')}>Open assessment board →</button>
        </div>

        {isRiskMgmt && (
          <div className="report-card">
            <h4>Risks by business unit</h4>
            {Object.entries(byBU).map(([bu, n]) => (
              <div className="bar-row" key={bu}>
                <div className="lbl2">{bu}</div>
                <AnimatedBar pct={(n / maxBU) * 100} />
                <div className="val2">{n}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dash-quicklinks">
        <button type="button" className="btn ghost" onClick={() => onNavigate('register')}>
          {isRiskMgmt ? 'Open full risk register' : 'View my risks'}
        </button>
        <button type="button" className="btn ghost" onClick={() => onNavigate('reports')}>Open reports</button>
      </div>
    </div>
  )
}
