import { chiefDirectoratesInBranch, businessUnitsInChiefDirectorate } from '../data/orgStructure.js'

export default function Toolbar({ orgStructure, filters, setFilters, categories, lockLevel, canAddRisk, onAddRisk }) {
  const branchLocked = lockLevel === 'chiefdirector' || lockLevel === 'businessunit'
  const cdLocked = lockLevel === 'chiefdirector' || lockLevel === 'businessunit'
  const buLocked = lockLevel === 'businessunit'

  const branches = orgStructure.map(b => b.branch)
  const chiefDirectorates = filters.branch ? chiefDirectoratesInBranch(filters.branch, orgStructure) : orgStructure.flatMap(b => b.chiefDirectorates.map(cd => cd.name))
  const businessUnits = filters.chiefDirectorate ? businessUnitsInChiefDirectorate(filters.chiefDirectorate, orgStructure) : chiefDirectorates.flatMap(cd => businessUnitsInChiefDirectorate(cd, orgStructure))

  return (
    <div className="toolbar">
      <select
        value={filters.branch} disabled={branchLocked}
        title={branchLocked ? 'Scoped to your own part of the org' : undefined}
        onChange={e => setFilters(f => ({ ...f, branch: e.target.value, chiefDirectorate: '', businessUnit: '' }))}
      >
        <option value="">All branches</option>
        {branches.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <select
        value={filters.chiefDirectorate} disabled={cdLocked}
        title={cdLocked ? 'Scoped to your own part of the org' : undefined}
        onChange={e => setFilters(f => ({ ...f, chiefDirectorate: e.target.value, businessUnit: '' }))}
      >
        <option value="">All chief directorates</option>
        {chiefDirectorates.map(cd => <option key={cd} value={cd}>{cd}</option>)}
      </select>
      <select
        value={filters.businessUnit} disabled={buLocked}
        title={buLocked ? 'Scoped to your own business unit' : undefined}
        onChange={e => setFilters(f => ({ ...f, businessUnit: e.target.value }))}
      >
        <option value="">All business units</option>
        {businessUnits.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <select value={filters.cat} onChange={e => setFilters(f => ({ ...f, cat: e.target.value }))}>
        <option value="">All risk categories</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
        <option value="">All statuses</option>
        <option value="green">On track</option>
        <option value="amber">At risk</option>
        <option value="red">Overdue</option>
      </select>
      <input
        type="text"
        placeholder="Search risks"
        value={filters.q}
        onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
      />
      <div className="spacer" />
      <button
        className="btn"
        disabled={!canAddRisk}
        title={canAddRisk ? undefined : 'Only a Business Unit can capture a new risk'}
        onClick={onAddRisk}
      >
        + Add risk
      </button>
    </div>
  )
}
