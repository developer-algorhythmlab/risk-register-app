import { useState } from 'react'

export default function RequestUpdateModal({ risk, onCancel, onSubmit }) {
  const [note, setNote] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(note.trim())
  }

  return (
    <div className="overlay open">
      <div className="panel" style={{ width: 480 }}>
        <div className="panel-head">
          <div>
            <h3>Request assessment update</h3>
            <div className="meta">{risk.risk}</div>
          </div>
          <button className="x" onClick={onCancel} aria-label="Close">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="panel-body">
            <p style={{ marginTop: 0, color: 'var(--ink-muted)', fontSize: 12.5 }}>
              This sends a request to the Risk Management Office to schedule a fresh assessment
              of this risk. It will appear on the Assessment requests board under
              "Request submitted".
            </p>
            <div className="form-field">
              <label>Note for the risk management office (optional)</label>
              <textarea
                rows={3} value={note} onChange={e => setNote(e.target.value)}
                placeholder="Explain what's changed or why an update is needed"
              />
            </div>
          </div>
          <div className="panel-foot">
            <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn">Submit request</button>
          </div>
        </form>
      </div>
    </div>
  )
}
