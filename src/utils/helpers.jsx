export function scoreClass(v) {
  return v >= 20 ? "hi" : v >= 11 ? "mid" : "lo"
}

// Gauteng Provincial Government financial year runs 1 Apr - 31 Mar.
export function fyFromDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ""
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  return m >= 4 ? `${y}/${y + 1}` : `${y - 1}/${y}`
}

export function monthKeyFromDate(dateStr) {
  if (!dateStr) return ""
  return dateStr.slice(0, 7) // "YYYY-MM"
}

export function monthLabelFromKey(key) {
  const [y, m] = key.split("-").map(Number)
  return new Date(y, m - 1, 1).toLocaleString("en-US", { month: "long", year: "numeric" })
}

export function nextNr(risks) {
  return risks.reduce((max, r) => Math.max(max, r.nr), 0) + 1
}

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function nowIso() {
  return new Date().toISOString()
}

export function formatDateShort(iso) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })
}

export function formatDateTime(iso) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

export const LIKELIHOOD_LABELS = ["", "1 · Rare", "2 · Unlikely", "3 · Possible", "4 · Likely", "5 · Almost certain"]
export const IMPACT_LABELS = ["", "1 · Insignificant", "2 · Minor", "3 · Moderate", "4 · Major", "5 · Severe"]

export function computeScore(likelihood, impact) {
  return Number(likelihood) * Number(impact)
}

// Merge a new (date, ir, rr) reading into a risk's score history, collapsing
// same-day reassessments into one point rather than stacking near-duplicates.
export function appendScoreHistory(history, { assessmentDate, ir, rr }) {
  const list = history || []
  const last = list[list.length - 1]
  const point = { date: assessmentDate, ir, rr }
  if (last && last.date === assessmentDate) {
    return [...list.slice(0, -1), point]
  }
  return [...list, point].sort((a, b) => a.date.localeCompare(b.date))
}

// Portfolio-level trend: for each date any risk was reassessed, average the
// most-recent-known IR/RR of every risk that had a reading by then (carrying
// each risk's last known score forward between its own reassessment dates).
export function computePortfolioTrend(risks) {
  const allDates = [...new Set(risks.flatMap(r => (r.scoreHistory || []).map(p => p.date)))].sort()
  return allDates.map(date => {
    let irSum = 0, rrSum = 0, count = 0
    risks.forEach(r => {
      const points = (r.scoreHistory || []).filter(p => p.date <= date)
      if (points.length) {
        const latest = points[points.length - 1]
        irSum += latest.ir
        rrSum += latest.rr
        count++
      }
    })
    return { date, ir: count ? irSum / count : 0, rr: count ? rrSum / count : 0 }
  })
}

export function emptyRisk(defaults = {}) {
  return {
    nr: null,
    outcome: "",
    businessUnit: defaults.businessUnit || "",
    category: "",
    risk: "",
    rootCauses: [""],
    controls: [""],
    irLikelihood: 4,
    irImpact: 3,
    rrLikelihood: 3,
    rrImpact: 3,
    ir: 12,
    rr: 9,
    response: "Mitigate",
    actionPlan: [{ plan: "", progress: "", target: "", status: "amber" }],
    owner: "",
    targetDate: "",
    status: "amber",
    progressPct: 0,
    assessmentDate: new Date().toISOString().slice(0, 10),
    history: [],
    scoreHistory: [],
    comments: [],
    pendingChange: null
  }
}

export const statusLabel = { green: "On track", amber: "At risk", red: "Delayed" }

const FACE_COLORS = {
  green: { fg: "#3B6D11", bg: "#EAF3DE" },
  amber: { fg: "#854F0B", bg: "#FAEEDA" },
  red: { fg: "#A32D2D", bg: "#FCEBEB" }
}

export function StatusFace({ status }) {
  const { fg, bg } = FACE_COLORS[status]
  return (
    <svg className="face" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill={bg} stroke={fg} strokeWidth="1" />
      <circle cx="7" cy="8" r="1" fill={fg} />
      <circle cx="13" cy="8" r="1" fill={fg} />
      {status === "green" && (
        <path d="M7 13 Q10 16 13 13" stroke={fg} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      )}
      {status === "amber" && (
        <line x1="7" y1="13.5" x2="13" y2="13.5" stroke={fg} strokeWidth="1.4" strokeLinecap="round" />
      )}
      {status === "red" && (
        <path d="M7 14.5 Q10 11.5 13 14.5" stroke={fg} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      )}
    </svg>
  )
}
