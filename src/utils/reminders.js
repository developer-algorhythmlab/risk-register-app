const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
}

// Register dates are free text ("31 Jul 2026", "2027/2028 FY", "—"). Parse the
// common "D Mon YYYY" form used throughout the seed data; anything else (FY
// strings, dashes) is treated as not date-bound and simply skipped.
export function parseLooseDate(str) {
  if (!str) return null
  const m = String(str).trim().match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/)
  if (!m) return null
  const month = MONTHS[m[2].slice(0, 3).toLowerCase()]
  if (month === undefined) return null
  const d = new Date(Number(m[3]), month, Number(m[1]))
  return Number.isNaN(d.getTime()) ? null : d
}

export function getReminders(risks, { withinDays = 30, today = new Date() } = {}) {
  const items = []
  const dayMs = 86400000
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  function classify(date, base) {
    const days = Math.round((date - startOfToday) / dayMs)
    if (days < 0) return { ...base, date, days, severity: "overdue" }
    if (days <= withinDays) return { ...base, date, days, severity: "due-soon" }
    return null
  }

  risks.forEach(r => {
    const d = parseLooseDate(r.targetDate)
    if (d) {
      const item = classify(d, {
        id: `risk-${r.nr}`,
        riskNr: r.nr,
        businessUnit: r.businessUnit,
        label: r.risk,
        kind: "Risk target date"
      })
      if (item) items.push(item)
    }
    ;(r.actionPlan || []).forEach((a, i) => {
      const ad = parseLooseDate(a.target)
      if (ad) {
        const item = classify(ad, {
          id: `risk-${r.nr}-action-${i}`,
          riskNr: r.nr,
          businessUnit: r.businessUnit,
          label: a.plan,
          kind: "Action plan"
        })
        if (item) items.push(item)
      }
    })
  })

  items.sort((a, b) => a.days - b.days)
  return items
}
