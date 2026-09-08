import { useEffect, useMemo, useState } from 'react'
import Toolbar from './Toolbar.jsx'
import OutcomeGroup from './OutcomeGroup.jsx'
import { CURRENT_USER } from '../data/risks.js'

export default function RegisterView({ risks, role, onSelectRisk, onAddRisk }) {
  const isOfficial = role === 'official'
  const [filters, setFilters] = useState({
    bu: isOfficial ? CURRENT_USER.businessUnit : '',
    cat: '', status: '', q: ''
  })

  useEffect(() => {
    if (isOfficial) setFilters(f => ({ ...f, bu: CURRENT_USER.businessUnit }))
  }, [isOfficial])

  const businessUnits = useMemo(() => [...new Set(risks.map(r => r.businessUnit))].sort(), [risks])
  const categories = useMemo(() => [...new Set(risks.map(r => r.category))].sort(), [risks])

  const filtered = useMemo(() => risks.filter(r =>
    (!filters.bu || r.businessUnit === filters.bu) &&
    (!filters.cat || r.category === filters.cat) &&
    (!filters.status || r.status === filters.status) &&
    (!filters.q ||
      r.risk.toLowerCase().includes(filters.q.toLowerCase()) ||
      r.businessUnit.toLowerCase().includes(filters.q.toLowerCase()))
  ), [risks, filters])

  const outcomes = useMemo(() => [...new Set(filtered.map(r => r.outcome))], [filtered])

  return (
    <div className="view-enter">
      <Toolbar
        businessUnits={businessUnits}
        categories={categories}
        filters={filters}
        setFilters={setFilters}
        buLocked={isOfficial}
        canAddRisk={role === 'riskmgmt'}
        onAddRisk={onAddRisk}
      />
      {outcomes.length === 0 ? (
        <div className="outcome">
          <div style={{ padding: 20, color: 'var(--ink-muted)' }}>No risks match these filters.</div>
        </div>
      ) : (
        outcomes.map(oc => (
          <OutcomeGroup
            key={oc}
            outcome={oc}
            risks={filtered.filter(r => r.outcome === oc)}
            onSelectRisk={onSelectRisk}
          />
        ))
      )}
    </div>
  )
}
