import { useState } from 'react'
import { CATEGORIES, RESPONSES, OUTCOMES } from '../data/risks.js'
import { allBusinessUnits, allChiefDirectorates } from '../data/orgStructure.js'
import { COMPLIANCE_UNIVERSE, COMPLIANCE_CATEGORIES, complianceActByName } from '../data/complianceUniverse.js'
import { emptyRisk, computeScore, scoreClass, LIKELIHOOD_LABELS, IMPACT_LABELS, RISK_TYPES } from '../utils/helpers.jsx'

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
              <option value="red">Overdue</option>
            </select>
            <button type="button" className="btn ghost sm" onClick={() => removeItem(i)} disabled={items.length <= 1}>Remove</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn ghost sm" onClick={addItem}>+ Add action</button>
    </div>
  )
}

const TITLES = { new: 'Add risk', edit: 'Edit risk' }

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

export default function RiskFormModal({ mode, risk, defaultBusinessUnit, orgStructure, onCancel, onSaveDraft, onSubmit }) {
  const [form, setForm] = useState(() => risk ? { ...risk } : emptyRisk({ businessUnit: defaultBusinessUnit }))
  const [error, setError] = useState('')
  const businessUnits = allBusinessUnits(orgStructure)
  const accountableUnitOptions = [...businessUnits, ...allChiefDirectorates(orgStructure)]
  const isCompliance = form.riskType === 'Compliance'
  const selectedAct = complianceActByName(form.act)

  function set(patch) {
    setForm(f => ({ ...f, ...patch }))
  }

  function setOwnership(patch) {
    setForm(f => ({ ...f, ownership: { ...f.ownership, ...patch } }))
  }

  function clean() {
    // nr / history / scoreHistory / comments / approvalStatus / approvalStage /
    // pendingChange are managed by the caller (App.jsx), not by this form -
    // drop whatever snapshot of them we picked up from `risk`.
    const { nr: _nr, history: _h, scoreHistory: _sh, comments: _c, approvalStatus: _as, approvalStage: _ag, pendingChange: _pc, ...formFields } = form
    return {
      ...formFields,
      ir: computeScore(form.irLikelihood, form.irImpact),
      rr: computeScore(form.rrLikelihood, form.rrImpact),
      progressPct: Number(form.progressPct),
      rootCauses: form.rootCauses.filter(x => x.trim()),
      controls: form.controls.filter(x => x.trim()),
      actionPlan: form.actionPlan.filter(a => a.plan.trim()),
      act: isCompliance ? form.act : '',
      provisionReference: isCompliance ? form.provisionReference : '',
      ownership: {
        accountableUnit: form.ownership.accountableUnit,
        responsiblePersons: form.ownership.responsiblePersons.filter(x => x.trim())
      }
    }
  }

  function validate() {
    if (!form.risk.trim() || !form.businessUnit || !form.category || !form.outcome.trim()) {
      setError('Please complete risk description, outcome, business unit and category.')
      return false
    }
    if (!form.ownership.accountableUnit || !form.ownership.responsiblePersons.some(x => x.trim())) {
      setError('Please set an accountable unit and at least one responsible person.')
      return false
    }
    if (isCompliance && !form.act) {
      setError('Please select the Act/Regulation this compliance risk relates to.')
      return false
    }
    return true
  }

  function handleSaveDraft() {
    if (!validate()) return
    onSaveDraft(clean())
  }

  function handleSubmit() {
    if (!validate()) return
    onSubmit(clean())
  }

  return (
    <div className="overlay open">
      <div className="panel form-panel">
        <div className="panel-head">
          <div>
            <h3>{TITLES[mode]}</h3>
            <div className="meta">{mode === 'new' ? 'New entry in the risk register' : `Nr ${risk.nr} · ${risk.businessUnit}`}</div>
          </div>
          <button className="x" onClick={onCancel} aria-label="Close">&times;</button>
        </div>

        <div className="panel-body">
          {error && <div className="form-error">{error}</div>}

          <div className="form-field">
            <label>Risk type</label>
            <select value={form.riskType} onChange={e => set({ riskType: e.target.value })}>
              {RISK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

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
                value={form.businessUnit} disabled
                title="Risks stay within your own business unit"
                onChange={e => set({ businessUnit: e.target.value })}
              >
                <option value="">Select…</option>
                {businessUnits.map(b => <option key={b} value={b}>{b}</option>)}
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

          {isCompliance && (
            <div className="compliance-fields">
              <div className="form-field">
                <label>Act / Regulation</label>
                <select value={form.act} onChange={e => set({ act: e.target.value })}>
                  <option value="">Select from the Compliance Universe…</option>
                  {COMPLIANCE_CATEGORIES.map(cat => (
                    <optgroup label={cat} key={cat}>
                      {COMPLIANCE_UNIVERSE.filter(a => a.category === cat).map(a => (
                        <option key={a.name} value={a.name}>{a.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              {selectedAct && (
                <div className="field-row">
                  <div className="field">
                    <label>Category</label>
                    <div className="val"><span className={'approval-pill tone-' + (selectedAct.category === 'Core' ? 'bad' : selectedAct.category === 'Topical' ? 'warn' : 'neutral')}>{selectedAct.category}</span></div>
                  </div>
                  <div className="field">
                    <label>Purpose of the Act/Regulation</label>
                    <div className="val sub">{selectedAct.purpose}</div>
                  </div>
                </div>
              )}
              <div className="form-field">
                <label>Provision reference &amp; regulatory requirement</label>
                <textarea
                  rows={2} value={form.provisionReference}
                  onChange={e => set({ provisionReference: e.target.value })}
                  placeholder="The specific section/clause this risk relates to"
                />
              </div>
            </div>
          )}

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
                <option value="red">Overdue</option>
              </select>
              <div className="field-caption">Reflects whether the business unit is hitting its own targets.</div>
            </div>
          </div>

          <ActionPlanField items={form.actionPlan} onChange={v => set({ actionPlan: v })} />

          <div className="form-field">
            <label>Accountable unit</label>
            <select value={form.ownership.accountableUnit} onChange={e => setOwnership({ accountableUnit: e.target.value })}>
              <option value="">Select…</option>
              {accountableUnitOptions.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <ListField
            label="Responsible person(s)"
            items={form.ownership.responsiblePersons}
            onChange={v => setOwnership({ responsiblePersons: v })}
            placeholder="Title and name, e.g. Director: Human Resource"
          />

          <div className="field-row">
            <div className="form-field">
              <label>Overall progress (%)</label>
              <input type="number" min={0} max={100} value={form.progressPct} onChange={e => set({ progressPct: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Target date</label>
              <input type="text" value={form.targetDate} onChange={e => set({ targetDate: e.target.value })} placeholder="e.g. 31 Mar 2027" />
            </div>
          </div>

          <div className="form-field">
            <label>Assessment date (drives FY / month in reports)</label>
            <input type="date" value={form.assessmentDate} onChange={e => set({ assessmentDate: e.target.value })} />
          </div>
        </div>

        <div className="panel-foot">
          <div className="spacer" />
          <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn ghost" onClick={handleSaveDraft}>Save as draft</button>
          <button type="button" className="btn" onClick={handleSubmit}>Submit for approval</button>
        </div>
      </div>
    </div>
  )
}
