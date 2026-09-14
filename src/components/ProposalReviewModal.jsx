import { useState } from 'react'
import DiffList from './DiffList.jsx'
import { diffRisk } from '../utils/audit.js'
import { formatDateTime } from '../utils/helpers.jsx'
import { ROLES, APPROVAL_CHAIN } from '../data/orgStructure.js'

const STAGE_TRACK = ['Draft', ...APPROVAL_CHAIN.map(k => ROLES[k].label), 'Approved']

export default function ProposalReviewModal({ risk, canAct, onClose, onAuthorise, onRequestChanges, onReject }) {
  const [action, setAction] = useState(null) // null | 'changes' | 'reject'
  const [note, setNote] = useState('')
  const diffs = diffRisk(risk, risk.pendingChange.data)
  const currentStageIndex = 1 + APPROVAL_CHAIN.indexOf(risk.approvalStage)

  function submitNote(handler) {
    if (!note.trim()) return
    handler(note.trim())
  }

  return (
    <div className="overlay open">
      <div className="panel" style={{ width: 620 }}>
        <div className="panel-head">
          <div>
            <h3>{canAct ? 'Review submission' : 'Submission in review'}</h3>
            <div className="meta">{risk.risk}</div>
          </div>
          <button className="x" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="panel-body">
          <div className="stage-track">
            {STAGE_TRACK.map((label, i) => (
              <div key={label} className={'stage-pip' + (i === currentStageIndex ? ' current' : i < currentStageIndex ? ' done' : '')}>
                {label}
              </div>
            ))}
          </div>

          <p style={{ marginTop: 0, fontSize: 12.5, color: 'var(--ink-muted)' }}>
            Submitted by <strong>{risk.pendingChange.submittedBy}</strong> on {formatDateTime(risk.pendingChange.submittedAt)}.
          </p>

          {diffs.length === 0 ? (
            <p style={{ fontSize: 12.5, color: 'var(--ink-muted)' }}>No field changes were detected in this submission.</p>
          ) : (
            <DiffList diffs={diffs} />
          )}

          {canAct && action && (
            <div className="form-field" style={{ marginTop: 16 }}>
              <label>{action === 'reject' ? 'Reason for rejection (required)' : 'Comment for the business unit (required)'}</label>
              <textarea
                rows={2} value={note} onChange={e => setNote(e.target.value)}
                placeholder={action === 'reject' ? 'Explain why this is being rejected' : 'Explain what needs to change'}
                autoFocus
              />
            </div>
          )}
        </div>
        <div className="panel-foot">
          <button className="btn ghost" onClick={onClose}>Close</button>
          {canAct && (
            action === null ? (
              <>
                <button className="btn danger" onClick={() => setAction('reject')}>Reject</button>
                <button className="btn ghost" onClick={() => setAction('changes')}>Request changes</button>
                <button className="btn" onClick={onAuthorise}>Authorise</button>
              </>
            ) : (
              <>
                <button className="btn ghost" onClick={() => { setAction(null); setNote('') }}>Back</button>
                <button
                  className={action === 'reject' ? 'btn danger' : 'btn'}
                  disabled={!note.trim()}
                  onClick={() => submitNote(action === 'reject' ? onReject : onRequestChanges)}
                >
                  {action === 'reject' ? 'Confirm rejection' : 'Send back for changes'}
                </button>
              </>
            )
          )}
        </div>
      </div>
    </div>
  )
}
