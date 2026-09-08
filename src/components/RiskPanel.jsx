import { useState } from 'react'
import { scoreClass, statusLabel, formatDateShort, formatDateTime } from '../utils/helpers.jsx'
import TrendChart from './TrendChart.jsx'
import DiffList from './DiffList.jsx'

const ACTION_ICON = { created: '＋', edited: '✎', proposed: '⇢', approved: '✓', rejected: '✕' }

function HistoryItem({ entry }) {
  const [open, setOpen] = useState(false)
  const hasDiff = entry.diff && entry.diff.length > 0
  return (
    <div className="history-item">
      <div className="history-icon">{ACTION_ICON[entry.action] || '•'}</div>
      <div className="history-body">
        <div className="history-line">
          <strong>{entry.actor}</strong> · {entry.summary}
        </div>
        <div className="history-meta">
          {formatDateTime(entry.timestamp)}
          {hasDiff && (
            <button type="button" className="link-btn" onClick={() => setOpen(o => !o)}>
              {open ? 'Hide changes' : 'Show changes'}
            </button>
          )}
        </div>
        {hasDiff && open && <DiffList diffs={entry.diff} />}
      </div>
    </div>
  )
}

export default function RiskPanel({ risk, role, onClose, onEdit, onPropose, onRequestUpdate, onReviewProposal, onAddComment }) {
  const [commentText, setCommentText] = useState('')
  const [showAllHistory, setShowAllHistory] = useState(false)

  if (!risk) return null
  const isRiskMgmt = role === 'riskmgmt'
  const hasPending = Boolean(risk.pendingChange)
  const history = [...(risk.history || [])].reverse()
  const visibleHistory = showAllHistory ? history : history.slice(0, 3)
  const scoreHistory = risk.scoreHistory || []

  function submitComment(e) {
    e.preventDefault()
    if (!commentText.trim()) return
    onAddComment(risk.nr, commentText)
    setCommentText('')
  }

  return (
    <div className="overlay open">
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>{risk.risk}</h3>
            <div className="meta">{risk.businessUnit} · {risk.category} · Target date {risk.targetDate}</div>
          </div>
          <button className="x" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="panel-body">
          {hasPending && (
            <div className="pending-banner">
              <div>
                <strong>Change proposed</strong> by {risk.pendingChange.proposedBy} on {formatDateShort(risk.pendingChange.proposedAt)} — awaiting risk management approval.
              </div>
              {isRiskMgmt && (
                <button type="button" className="btn sm" onClick={onReviewProposal}>Review changes</button>
              )}
            </div>
          )}

          <div className="field-row">
            <div className="field">
              <label>Inherent risk (IR)</label>
              <div className="val">
                <span className={'score ' + scoreClass(risk.ir)}>{risk.ir}</span>
                <span className="sub" style={{ marginLeft: 8 }}>L{risk.irLikelihood} × I{risk.irImpact}</span>
              </div>
            </div>
            <div className="field">
              <label>Residual risk (RR)</label>
              <div className="val">
                <span className={'score ' + scoreClass(risk.rr)}>{risk.rr}</span>
                <span className="sub" style={{ marginLeft: 8 }}>L{risk.rrLikelihood} × I{risk.rrImpact}</span>
              </div>
            </div>
          </div>

          <div className="block-title">Root causes</div>
          <ul className="plain">{risk.rootCauses.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <div className="block-title">Current controls</div>
          <ul className="plain">{risk.controls.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <div className="block-title">Action plan &amp; progress</div>
          {risk.actionPlan.map((a, i) => (
            <div className="ap-item" key={i}>
              <div className="ap-plan">{a.plan}</div>
              <div className="ap-progress">{a.progress}</div>
              <div className="ap-meta"><span>Target: {a.target}</span><span>{statusLabel[a.status]}</span></div>
            </div>
          ))}

          <div className="field-row" style={{ marginTop: 6 }}>
            <div className="field"><label>Risk owner</label><div className="val">{risk.owner}</div></div>
            <div className="field"><label>Risk response</label><div className="val">{risk.response}</div></div>
          </div>

          {scoreHistory.length >= 2 && (
            <>
              <div className="block-title">Score history</div>
              <TrendChart data={scoreHistory} height={140} />
            </>
          )}

          <div className="block-title">History</div>
          <div className="history-list">
            {history.length === 0 ? (
              <div className="sub">No history recorded.</div>
            ) : (
              visibleHistory.map(h => <HistoryItem key={h.id} entry={h} />)
            )}
          </div>
          {history.length > 3 && (
            <button type="button" className="link-btn" onClick={() => setShowAllHistory(s => !s)}>
              {showAllHistory ? 'Show fewer' : `Show all ${history.length} entries`}
            </button>
          )}

          <div className="block-title">Discussion</div>
          <div className="comment-list">
            {(risk.comments || []).length === 0 ? (
              <div className="sub">No comments yet.</div>
            ) : (
              risk.comments.map(c => (
                <div className="comment-item" key={c.id}>
                  <div className="comment-head">
                    <strong>{c.author}</strong>
                    <span className="sub">{c.role === 'riskmgmt' ? 'Risk management office' : 'Risk official'} · {formatDateTime(c.timestamp)}</span>
                  </div>
                  <div className="comment-text">{c.text}</div>
                </div>
              ))
            )}
          </div>
          <form className="comment-form" onSubmit={submitComment}>
            <textarea
              rows={2} value={commentText} onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment for the other party to see…"
            />
            <button type="submit" className="btn ghost sm" disabled={!commentText.trim()}>Post comment</button>
          </form>
        </div>
        <div className="panel-foot">
          <button className="btn ghost" onClick={onClose}>Close</button>
          {isRiskMgmt ? (
            <button className="btn" onClick={onEdit}>Edit risk</button>
          ) : (
            <>
              <button className="btn ghost" onClick={onRequestUpdate}>Request assessment update</button>
              <button className="btn" onClick={onPropose} disabled={hasPending} title={hasPending ? 'A proposal is already awaiting approval' : undefined}>
                {hasPending ? 'Proposal pending' : 'Propose changes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
