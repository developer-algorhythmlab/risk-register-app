const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'register', label: 'Risk register' },
  { id: 'board', label: 'Assessment requests' },
  { id: 'reports', label: 'Reports' }
]

export default function NavTabs({ view, setView, role }) {
  const tabs = role === 'administrator' ? [{ id: 'admin', label: 'Administration' }, ...TABS] : TABS
  return (
    <div className="nav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={view === t.id ? 'active' : ''}
          onClick={() => setView(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
