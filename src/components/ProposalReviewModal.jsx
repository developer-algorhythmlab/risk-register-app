import { useState } from 'react'
import DiffList from './DiffList.jsx'
import { diffRisk } from '../utils/audit.js'
import { formatDateTime } from '../utils/helpers.jsx'

export default function ProposalReviewModal({ risk, readOnly, onClose, onApprove, onReject }) {
  const [reason, setReason] = useState('')
  const diffs = diffRisk(risk, risk.pendingChange.data)

  return (
    <div className="overlay open">
      <div className="panel" style={{ width: 600 }}>
        <div className="panel-head">
          <div>
            <h3>{readOnly ? 'Proposed changes' : 'Review proposed changes'}</h3>
            <div className="meta">{risk.risk}</div>
          </div>
          <button className="x" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="panel-body">
          <p style={{ marginTop: 0, fontSize: 12.5, color: 'var(--ink-muted)' }}>
            Proposed by <strong>{risk.pendingChange.proposedBy}</strong> on {formatDateTime(risk.pendingChange.proposedAt)}.
          </p>

          {diffs.length === 0 ? (
            <p style={{ fontSize: 12.5, color: 'var(--ink-muted)' }}>No field changes were detected in this proposal.</p>
          ) : (
            <DiffList diffs={diffs} />
          )}

          {!readOnly && (
            <div className="form-field" style={{ marginTop: 16 }}>
              <label>Reason (required to reject, optional to approve)</label>
              <textarea rows={2} value={reason} onChange={e => setReason(e.target.value)} placeholder="Explain your decision" />
            </div>
          )}
        </div>
        <div className="panel-foot">
          <button className="btn ghost" onClick={onClose}>Close</button>
          {!readOnly && (
            <>
              <button
                className="btn danger"
                onClick={() => onReject(reason.trim())}
              >
                Reject
              </button>
              <button className="btn" onClick={() => onApprove()}>Approve</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
