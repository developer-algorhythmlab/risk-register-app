export default function DiffList({ diffs }) {
  if (!diffs || diffs.length === 0) return null
  return (
    <div className="diff-list">
      {diffs.map(d => (
        <div className="diff-row" key={d.field}>
          <div className="diff-label">{d.label}</div>
          <div className="diff-values">
            <span className="diff-before">{d.before}</span>
            <span className="diff-arrow">→</span>
            <span className="diff-after">{d.after}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
