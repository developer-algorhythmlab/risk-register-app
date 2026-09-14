import logo from '../assets/gpg-logo.png'
import { ROLES, ROLE_PERSONAS } from '../data/orgStructure.js'

export default function Header({ role, setRole }) {
  const persona = ROLE_PERSONAS[role]
  const initials = persona.name.split(' ').map(p => p[0]).join('')
  const scopeLabel = persona.businessUnit || persona.chiefDirectorate || 'EGOV'

  return (
    <div className="topbar">
      <div className="brand">
        <img src={logo} alt="Gauteng Province logo" className="crest-logo" />
        <div className="sysname">Risk Register</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="role-switch">
          Viewing as
          <select value={role} onChange={e => setRole(e.target.value)}>
            {Object.entries(ROLES).map(([key, r]) => (
              <option key={key} value={key}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="user"><div className="av">{initials}</div>{persona.name} · {scopeLabel}</div>
      </div>
    </div>
  )
}
