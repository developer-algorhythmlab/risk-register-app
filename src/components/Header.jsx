import logo from '../assets/gpg-logo.png'
import { CURRENT_USER } from '../data/risks.js'

export default function Header({ role, setRole }) {
  const initials = CURRENT_USER.name.split(' ').map(p => p[0]).join('')
  const roleLabel = role === 'riskmgmt' ? 'Risk management office' : CURRENT_USER.businessUnit
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
            <option value="official">Risk official</option>
            <option value="riskmgmt">Risk management office</option>
          </select>
        </div>
        <div className="user"><div className="av">{initials}</div>{CURRENT_USER.name} · {roleLabel}</div>
      </div>
    </div>
  )
}
