export default function Toolbar({ businessUnits, categories, filters, setFilters, buLocked, canAddRisk, onAddRisk }) {
  return (
    <div className="toolbar">
      <select
        value={filters.bu}
        disabled={buLocked}
        title={buLocked ? 'Risk officials view their own business unit' : undefined}
        onChange={e => setFilters(f => ({ ...f, bu: e.target.value }))}
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
        <option value="red">Delayed</option>
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
        title={canAddRisk ? undefined : 'Only the Risk management office can add risks'}
        onClick={onAddRisk}
      >
        + Add risk
      </button>
    </div>
  )
}
