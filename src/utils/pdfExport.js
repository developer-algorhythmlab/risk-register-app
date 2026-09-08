import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { statusLabel } from "./helpers.jsx"

export function exportReportPdf({ risks, filterLabel, summary, byBU, byStatus }) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" })
  const marginX = 40
  let y = 44

  doc.setFontSize(16)
  doc.setTextColor(18, 42, 78)
  doc.text("Gauteng Province — Risk Register Report", marginX, y)

  y += 18
  doc.setFontSize(10)
  doc.setTextColor(90, 100, 112)
  doc.text(`Scope: ${filterLabel}`, marginX, y)
  y += 14
  doc.text(`Generated: ${new Date().toLocaleString("en-ZA")}`, marginX, y)

  y += 20
  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [["Total risks", "High IR (≥20)", "On track", "At risk", "Delayed"]],
    body: [[summary.total, summary.highIr, summary.green, summary.amber, summary.red]],
    theme: "grid",
    headStyles: { fillColor: [30, 90, 160] },
    styles: { fontSize: 10, halign: "center" }
  })

  const afterSummaryY = doc.lastAutoTable.finalY + 24

  autoTable(doc, {
    startY: afterSummaryY,
    margin: { left: marginX, right: 420 },
    head: [["Business unit", "Risks"]],
    body: Object.entries(byBU).map(([bu, n]) => [bu, n]),
    theme: "striped",
    headStyles: { fillColor: [30, 90, 160] },
    styles: { fontSize: 9 }
  })

  autoTable(doc, {
    startY: afterSummaryY,
    margin: { left: doc.internal.pageSize.getWidth() - 420, right: marginX },
    head: [["Status", "Risks"]],
    body: [
      ["On track", byStatus.green],
      ["At risk", byStatus.amber],
      ["Delayed", byStatus.red]
    ],
    theme: "striped",
    headStyles: { fillColor: [30, 90, 160] },
    styles: { fontSize: 9 }
  })

  const afterBothY = Math.max(
    doc.lastAutoTable.finalY,
    afterSummaryY
  ) + 24

  autoTable(doc, {
    startY: afterBothY,
    margin: { left: marginX, right: marginX },
    head: [["Nr", "Business unit", "Risk", "Category", "IR", "RR", "Response", "Status", "Progress", "Target date", "Owner"]],
    body: risks.map(r => [
      r.nr,
      r.businessUnit,
      r.risk,
      r.category,
      r.ir,
      r.rr,
      r.response,
      statusLabel[r.status] || r.status,
      `${r.progressPct}%`,
      r.targetDate,
      r.owner
    ]),
    theme: "grid",
    headStyles: { fillColor: [18, 42, 78] },
    styles: { fontSize: 8, cellPadding: 5, overflow: "linebreak" },
    columnStyles: {
      2: { cellWidth: 170 },
      10: { cellWidth: 130 }
    },
    didDrawPage: () => {
      const pageCount = doc.internal.getNumberOfPages()
      doc.setFontSize(8)
      doc.setTextColor(140, 145, 150)
      doc.text(
        `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - marginX - 60,
        doc.internal.pageSize.getHeight() - 18
      )
    }
  })

  const fileSafeLabel = filterLabel.replace(/[^a-z0-9]+/gi, "-").toLowerCase()
  doc.save(`risk-register-report-${fileSafeLabel}-${Date.now()}.pdf`)
}
