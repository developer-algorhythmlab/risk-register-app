import { statusLabel, formatOwnership } from "./helpers.jsx"

function csvCell(v) {
  const s = String(v ?? "")
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function exportReportCsv({ risks, filterLabel }) {
  const headers = ["Nr", "Risk type", "Business unit", "Outcome", "Risk", "Category", "IR", "RR", "Response", "Status", "Progress %", "Target date", "Accountable unit", "Responsible person(s)", "Assessment date"]
  const rows = risks.map(r => [
    r.nr, r.riskType, r.businessUnit, r.outcome, r.risk, r.category, r.ir, r.rr, r.response,
    statusLabel[r.status] || r.status, r.progressPct, r.targetDate,
    r.ownership?.accountableUnit, (r.ownership?.responsiblePersons || []).filter(Boolean).join("; "),
    r.assessmentDate
  ])
  const csv = [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  const fileSafeLabel = filterLabel.replace(/[^a-z0-9]+/gi, "-").toLowerCase()
  a.href = url
  a.download = `risk-register-report-${fileSafeLabel}-${Date.now()}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
