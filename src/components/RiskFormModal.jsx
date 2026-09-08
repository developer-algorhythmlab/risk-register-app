import { useState } from 'react'
import { BUSINESS_UNITS, CATEGORIES, RESPONSES, OUTCOMES } from '../data/risks.js'
import { emptyRisk, computeScore, scoreClass, LIKELIHOOD_LABELS, IMPACT_LABELS } from '../utils/helpers.jsx'

function ListField({ label, items, onChange, placeholder }) {
  function setItem(i, value) {
    const next = [...items]
    next[i] = value
    onChange(next)
  }
  function addItem() {
    onChange([...items, ''])
  }
  function removeItem(i) {
    onChange(items.filter((_, idx) => idx !== i))
  }
  return (
    <div className="form-field">
      <label>{label}</label>
      {items.map((v, i) => (
        <div className="list-row" key={i}>
          <input
            type="text"
            value={v}
            placeholder={placeholder}
            onChange={e => setItem(i, e.target.value)}
          />
          <button type="button" className="btn ghost sm" onClick={() => removeItem(i)} disabled={items.length <= 1}>Remove</button>
        </div>
      ))}
      <button type="button" className="btn ghost sm" onClick={addItem}>+ Add</button>
    </div>
  )
}

function ActionPlanField({ items, onChange }) {
  function setItem(i, patch) {
    const next = items.map((a, idx) => (idx === i ? { ...a, ...patch } : a))
    onChange(next)
  }
  function addItem() {
    onChange([...items, { plan: '', progress: '', target: '', status: 'amber' }])
  }
  function removeItem(i) {
    onChange(items.filter((_, idx) => idx !== i))
  }
  return (
    <div className="form-field">
      <label>Action plan &amp; progress</label>
      {items.map((a, i) => (
        <div className="ap-form-item" key={i}>
          <input
            type="text" placeholder="Action / plan"
            value={a.plan} onChange={e => setItem(i, { plan: e.target.value })}
          />
          <input
            type="text" placeholder="Progress to date"
            value={a.progress} onChange={e => setItem(i, { progress: e.target.value })}
          />
          <div className="ap-form-row">
            <input
              type="text" placeholder="Target date"
              value={a.target} onChange={e => setItem(i, { target: e.target.value })}
            />
            <select value={a.status} onChange={e => setItem(i, { status: e.target.value })}>
              <option value="green">On track</option>
              <option value="amber">At risk</option>
              <option value="red">Delayed</option>
            </select>
            <button type="button" className="btn ghost sm" onClick={() => removeItem(i)} disabled={items.length <= 1}>Remove</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn ghost sm" onClick={addItem}>+ Add action</button>
    </div>
  )
}

const TITLES = {
  create: 'Add risk',
  edit: 'Edit risk',
  propose: 'Propose changes'
}

const SUBMIT_LABELS = {
  create: 'Add risk',
  edit: 'Save changes',
  propose: 'Submit for approval'
}

function ScorePicker({ title, likelihood, impact, onLikelihood, onImpact }) {
  const score = computeScore(likelihood, impact)
  return (
    <div className="score-picker">
      <div className="score-picker-head">
        <span>{title}</span>
        <span className={'score ' + scoreClass(score)}>{score}</span>
      </div>
      <div className="field-row">
        <div className="form-field">
          <label>Likelihood</label>
          <select value={likelihood} onChange={e => onLikelihood(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{LIKELIHOOD_LABELS[v]}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label>Impact</label>
          <select value={impact} onChange={e => onImpact(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{IMPACT_LABELS[v]}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}

export default function RiskFormModal({ mode, risk, defaultBusinessUnit, onCancel, onCreate, onSave, onPropose, onDelete }) {
  const [form, setForm] = useState(() => risk ? { ...risk } : emptyRisk({ businessUnit: defaultBusinessUnit }))
  const [error, setError] = useState('')
  const lockBusinessUnit = mode === 'propose'

  function set(patch) {
    setForm(f => ({ ...f, ...patch }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.risk.trim() || !form.businessUnit || !form.category || !form.owner.trim() || !form.outcome.trim()) {
      setError('Please complete risk description, outcome, business unit, category and owner.')
      return
    }
    // nr / history / scoreHistory / comments / pendingChange are managed by
    // the caller (App.jsx), not by this form - drop whatever snapshot of
    // them we picked up from `risk` so they can't shadow the real values.
    const { nr: _nr, history: _history, scoreHistory: _scoreHistory, comments: _comments, pendingChange: _pendingChange, ...formFields } = form
    const cleaned = {
      ...formFields,
      ir: computeScore(form.irLikelihood, form.irImpact),
      rr: computeScore(form.rrLikelihood, form.rrImpact),
      progressPct: Number(form.progressPct),
      rootCauses: form.rootCauses.filter(x => x.trim()),
      controls: form.controls.filter(x => x.trim()),
      actionPlan: form.actionPlan.filter(a => a.plan.trim())
    }
    if (mode === 'create') onCreate(cleaned)
    else if (mode === 'propose') onPropose(cleaned)
    else onSave(cleaned)
  }

  return (
    <div className="overlay open">
      <div className="panel form-panel">
        <div className="panel-head">
          <div>
            <h3>{TITLES[mode]}</h3>
            <div className="meta">{mode === 'create' ? 'New entry in the risk register' : `Nr ${risk.nr} · ${risk.businessUnit}`}</div>
          </div>
          <button className="x" onClick={onCancel} aria-label="Close">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="panel-body">
            {error && <div className="form-error">{error}</div>}

            <div className="form-field">
              <label>Outcome</label>
              <input
                type="text" list="outcome-options" value={form.outcome}
                onChange={e => set({ outcome: e.target.value })}
                placeholder="Strategic outcome this risk relates to"
              />
              <datalist id="outcome-options">
                {OUTCOMES.map(o => <option key={o} value={o} />)}
              </datalist>
            </div>

            <div className="field-row">
              <div className="form-field">
                <label>Business unit</label>
                <select
                  value={form.businessUnit} disabled={lockBusinessUnit}
                  title={lockBusinessUnit ? 'Proposed changes stay within your own business unit' : undefined}
                  onChange={e => set({ businessUnit: e.target.value })}
                >
                  <option value="">Select…</option>
                  {BUSINESS_UNITS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Category</label>
                <select value={form.category} onChange={e => set({ category: e.target.value })}>
                  <option value="">Select…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Risk description</label>
              <textarea
                rows={2} value={form.risk}
                onChange={e => set({ risk: e.target.value })}
                placeholder="Describe the risk"
              />
            </div>

            <ListField label="Root causes" items={form.rootCauses} onChange={v => set({ rootCauses: v })} placeholder="Root cause" />
            <ListField label="Current controls" items={form.controls} onChange={v => set({ controls: v })} placeholder="Control" />

            <div className="field-row">
              <ScorePicker
                title="Inherent risk"
                likelihood={form.irLikelihood} impact={form.irImpact}
                onLikelihood={v => set({ irLikelihood: v })} onImpact={v => set({ irImpact: v })}
              />
              <ScorePicker
                title="Residual risk"
                likelihood={form.rrLikelihood} impact={form.rrImpact}
                onLikelihood={v => set({ rrLikelihood: v })} onImpact={v => set({ rrImpact: v })}
              />
            </div>

            <div className="field-row">
              <div className="form-field">
                <label>Risk response</label>
                <select value={form.response} onChange={e => set({ response: e.target.value })}>
                  {RESPONSES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Overall status</label>
                <select value={form.status} onChange={e => set({ status: e.target.value })}>
                  <option value="green">On track</option>
                  <option value="amber">At risk</option>
                  <option value="red">Delayed</option>
                </select>
              </div>
            </div>

            <ActionPlanField items={form.actionPlan} onChange={v => set({ actionPlan: v })} />

            <div className="field-row">
              <div className="form-field">
                <label>Risk owner</label>
                <input type="text" value={form.owner} onChange={e => set({ owner: e.target.value })} placeholder="Name and title" />
              </div>
              <div className="form-field">
                <label>Overall progress (%)</label>
                <input type="number" min={0} max={100} value={form.progressPct} onChange={e => set({ progressPct: e.target.value })} />
              </div>
            </div>

            <div className="field-row">
              <div className="form-field">
                <label>Target date</label>
                <input type="text" value={form.targetDate} onChange={e => set({ targetDate: e.target.value })} placeholder="e.g. 31 Mar 2027" />
              </div>
              <div className="form-field">
                <label>Assessment date (drives FY / month in reports)</label>
                <input type="date" value={form.assessmentDate} onChange={e => set({ assessmentDate: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="panel-foot">
            {mode === 'edit' && (
              <button
                type="button" className="btn danger"
                onClick={() => { if (confirm('Delete this risk? This cannot be undone.')) onDelete() }}
              >
                Delete risk
              </button>
            )}
            <div className="spacer" />
            <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn">{SUBMIT_LABELS[mode]}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
