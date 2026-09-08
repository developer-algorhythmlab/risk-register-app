# Gauteng Province — Risk Register (prototype)

A React/Vite rebuild of the risk register prototype, mirroring the BarnOwl-style
register (NR / Risk / Category / Root causes / IR / Controls / RR / Response /
Action Plan / Progress / Target date / Owner / Status) and the As-Is assessment
workflow (Business Unit submits → Risk Management receives, schedules, conducts,
reports).

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build a static production bundle:

```bash
npm run build
npm run preview
```

**Note:** the risk data schema changed to add likelihood/impact scoring,
audit history, comments and proposals. If you have an older version of this
app open in the same browser, clear its site data (or open in a private
window) so it doesn't try to load the old-shaped records from `localStorage`.

## Project structure

```
src/
  App.jsx                    top-level state: risks, board cards, role, open modals
  main.jsx                   React entry point
  index.css                  design tokens + all component styles
  data/risks.js               seed risk register, board data, canonical lists
  utils/helpers.jsx          score bands, FY/month helpers, score-history merge, empty-risk factory
  utils/storage.js           localStorage load/save for risks + board cards
  utils/audit.js             field-level diffing for the audit trail + proposal review
  utils/reminders.js         loose date parsing + overdue/due-soon detection
  utils/pdfExport.js         jsPDF report generation
  utils/csvExport.js         CSV report generation
  components/
    Header.jsx                client logo, system name, role switcher
    NavTabs.jsx                Dashboard / Risk register / Assessment requests / Reports tabs
    DashboardView.jsx          role-aware landing dashboard (see below)
    Toolbar.jsx                business unit / category / status filters + search + add risk
    RegisterView.jsx           filtered risk list, grouped by outcome
    OutcomeGroup.jsx           one collapsible outcome group + its risk table
    RiskPanel.jsx              risk detail: scores, action plan, score history, audit trail, discussion
    RiskFormModal.jsx          add / edit / propose-changes form (likelihood × impact, dynamic lists)
    ProposalReviewModal.jsx    diff view + approve/reject for a proposed change
    RequestUpdateModal.jsx     risk-official's "request assessment update" form
    RequestDetailModal.jsx     assessment-request detail: stage tracker, notes, stage advance
    BoardView.jsx              assessment-request Kanban board
    ReportsView.jsx            filters (FY/month/BU) + metrics + heat map + trend + PDF/CSV export
    RiskHeatmap.jsx            reusable 5×5 likelihood × impact heat map
    TrendChart.jsx             reusable inline-SVG IR/RR line chart
    DiffList.jsx               reusable before/after field diff renderer
    StatWidgets.jsx            CountUp / AnimatedBar / StatTile, shared by Dashboard + Reports
  assets/gpg-logo.png          client crest, used in the header
```

## Data model

`src/data/risks.js` holds the seed data and canonical lists (`BUSINESS_UNITS`,
`CATEGORIES`, `RESPONSES`, `OUTCOMES`, `CURRENT_USER`). Each risk carries:

- `irLikelihood`/`irImpact` and `rrLikelihood`/`rrImpact` (1–5 each), with
  `ir`/`rr` derived as their product — this is what feeds the heat map.
- `scoreHistory` — a `{date, ir, rr}` point per reassessment, feeding the
  trend charts.
- `history` — an audit trail (`created`/`edited`/`proposed`/`approved`/
  `rejected` entries, each with actor, timestamp, and an optional field diff).
- `comments` — a discussion thread on the risk.
- `pendingChange` — set when a Risk official has a change awaiting approval
  (`{data, proposedBy, proposedAt}`); `null` otherwise.

Live state is lifted into `App.jsx` (`risks`, `boardCards`) and persisted to
`localStorage` via `src/utils/storage.js`, so everything survives a page
refresh. That's the seam to replace with a real backend later — swap the
storage helpers for fetch/API calls and the components won't need to change.

## What's functional

- **Dashboard (per role)** — a landing view with a hero summary, stat tiles,
  a heat map, a score trend chart, an "Attention needed" reminders panel, and
  a pending-approvals / my-proposals widget. Risk official sees their own
  business unit only; Risk management office sees the whole province plus a
  province-wide "Risks by business unit" chart and a `+ Add risk` shortcut.
- **Add / edit / delete a risk** — Risk management office can add a risk,
  edit any risk directly, or delete one from the edit form. Root causes,
  controls, and action-plan rows are dynamic (add/remove). Inherent and
  residual risk are scored as Likelihood × Impact (1–5 each) rather than a
  raw 1–25 number, which is what powers the heat map.
- **Propose → approve/reject workflow** — a Risk official can't edit a risk
  directly; they submit a **proposed change** (same form, business unit
  locked) which a Risk management office reviewer opens in a **diff view**
  (`ProposalReviewModal`) and approves or rejects with an optional reason.
  Approving applies the change and logs it to the risk's audit trail.
- **Audit trail** — every create/edit/propose/approve/reject is recorded on
  the risk (`risk.history`), with a field-level before/after diff where
  relevant, visible in the risk panel.
- **Score history + trend charts** — every scored change appends a
  `{date, ir, rr}` point; the risk panel shows a per-risk sparkline, and
  Reports/Dashboard show a portfolio-wide trend (each risk's latest known
  score, averaged, over time).
- **5×5 risk heat map** — Likelihood × Impact grid, colour-banded, with a
  toggle between inherent and residual, shown on both the Dashboard and
  Reports.
- **Overdue / upcoming reminders** — risk target dates and action-plan
  target dates are parsed and surfaced as "overdue" or "due within 30 days"
  on the Dashboard's "Attention needed" panel (BU-scoped for officials,
  province-wide for risk management).
- **Discussion thread** — each risk has a comment thread (author, role,
  timestamp) for back-and-forth between a business unit and risk management,
  visible in the risk panel.
- **Assessment requests board** — cards are clickable and open a detail view
  with a stage tracker; Risk management office can advance a request through
  its stages and leave notes, and jump straight to the linked risk register
  entry if there is one.
- **Reports + PDF/CSV export** — filters by financial year (Apr–Mar GPG FY,
  derived from each risk's assessment date), month, business unit, or an
  "Overall report" (all data). "Export PDF" (jsPDF + jspdf-autotable) and
  "Export CSV" both respect the active filters.
- **Role-based behaviour** — switching "Viewing as" changes what you can do,
  not just a label: see the propose/approve workflow above, plus Risk
  official's register/dashboard views are scoped to their own business unit.

## Known gaps / next steps

- **No real backend** — persistence is `localStorage` only, per browser. A
  production rollout needs a real API/database and server-side access
  control (the current role gating is client-side only, by design for demo
  purposes — "Viewing as" is a switch, not authentication).
- **Loose-text dates** — `targetDate` and action-plan `target` are free text
  (matching the source register's style); the reminders parser only
  recognises "D Mon YYYY" and silently skips anything else (e.g. "2027/2028
  FY"). A structured date field would make this more robust.
- Logo currently in `src/assets/gpg-logo.png` reads "Gauteng Province
  Education" — confirm this is the right crest for the e-Government system
  before this goes further, since the register spans multiple business units.
