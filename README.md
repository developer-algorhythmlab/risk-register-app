# EGOV Risk Register (prototype)

A React/Vite risk register for the Gauteng Department of e-Government (EGOV),
mirroring the BarnOwl-style register (NR / Risk / Category / Root causes /
IR / Controls / RR / Response / Action Plan / Progress / Target date /
Owner / Status) and modelled on AlgoAtWork's **SCM Procurement Plan** system
for its five-role capture → approval workflow.

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

**Note:** the risk schema has changed twice now (likelihood/impact scoring
+ audit trail, then the five-role approval chain + compliance fields). If
you have an older version of this app open in the same browser, clear its
site data (or open in a private window) so it doesn't try to load
old-shaped records from `localStorage` — the storage keys are versioned
(`grr.risks.v2`, etc.) specifically so this fails safe rather than crashing.

## Roles

Five roles, modelled directly on the SCM Procurement Plan manual's
Director → Chief Director → DDG → SCM Manager/CFO chain:

| Role | Scope | Can do |
|---|---|---|
| Business Unit | Own business unit | Capture/edit risks (Draft, Changes Required, Rejected, or a fresh round on an Approved risk), submit for approval, comment, request an assessment |
| Chief Director | Own chief directorate | 1st approval stage: authorise / request changes / reject |
| DDG | Whole of EGOV | 2nd approval stage: authorise / request changes / reject |
| CRO | Whole of EGOV | Final approval stage (applies the change to the register); owns opening/closing the capture period for a financial year |
| Administrator | System-wide | Manages the org structure (Branch → Chief Directorate → Business Unit) and the demo personas; doesn't touch the approval chain |

There's no real login — `src/data/orgStructure.js` has one named demo
persona per role (`ROLE_PERSONAS`), and "Viewing as" in the header just
swaps which persona you're acting as. Real auth is a production concern,
not solved here on purpose.

## Approval workflow

```
Business Unit (Draft) → Chief Director → DDG → CRO → Approved
```

At each stage the approver can **Authorise** (moves to the next stage; only
the CRO's authorise actually applies the change to the published register —
earlier stages just advance it), **Request changes** (comment required,
returns to Business Unit), or **Reject** (reason required, returns to
Business Unit — deliberately *not* terminal, unlike the SCM manual this is
modelled on). A risk's `approvalStatus`/`approvalStage` are tracked
separately from its own on-track/overdue status — see `src/utils/permissions.js`
and the `authoriseStage`/`requestChanges`/`rejectSubmission` functions in
`App.jsx`.

## Project structure

```
src/
  App.jsx                     top-level state: risks, board cards, role, period, org structure, open modals
  main.jsx                    React entry point
  index.css                   design tokens + all component styles
  data/
    risks.js                   seed risk register + board data + canonical category/response/outcome lists
    orgStructure.js             Branch -> Chief Directorate -> Business Unit, roles, approval chain, demo personas
    complianceUniverse.js       reference list of Acts/Regulations a Compliance-type risk selects from
  utils/
    helpers.jsx                 score bands, FY/month helpers, score-history merge, empty-risk factory, ownership formatting
    permissions.js               role-based scoping (which risks a role sees) and edit/create checks
    period.js                    FY capture-period defaults
    storage.js                   localStorage load/save for risks, board cards, period, org structure, personas
    audit.js                     field-level diffing for the audit trail + proposal review
    reminders.js                 loose date parsing + overdue/due-soon detection
    pdfExport.js / csvExport.js  report export
  components/
    Header.jsx                  role switcher (5 roles), persona display
    NavTabs.jsx                  Dashboard / Risk register / Assessment requests / Reports (+ Administration for admins)
    DashboardView.jsx            role-aware landing dashboard (see below)
    Toolbar.jsx                  cascading Branch/Chief Directorate/Business Unit filters + category/status/search + add risk
    RegisterView.jsx             filtered risk list, grouped by outcome, scoped by role
    OutcomeGroup.jsx             one collapsible outcome group + its risk table
    RiskPanel.jsx                risk detail: scores, legislative fields (if Compliance), action plan, score history, audit trail, discussion
    RiskFormModal.jsx            capture/edit form: risk type, compliance fields, likelihood x impact, ownership, dynamic lists
    ProposalReviewModal.jsx      stage tracker + diff view + authorise/request-changes/reject
    RequestUpdateModal.jsx       Business Unit's "request assessment update" form
    RequestDetailModal.jsx       assessment-request detail: stage tracker, notes, stage advance
    BoardView.jsx                assessment-request Kanban board
    AdminView.jsx                org structure editor + demo persona roster
    ReportsView.jsx              filters (FY/month/BU) + metrics + heat map + trend + PDF/CSV export
    RiskHeatmap.jsx / TrendChart.jsx / DiffList.jsx / StatWidgets.jsx   reusable pieces
  assets/gpg-logo.png            client crest, used in the header
```

## Data model

Each risk (`src/data/risks.js`) carries:

- `riskType` — `Operational` or `Compliance`. Compliance risks additionally
  carry `act` (a name from `complianceUniverse.js` — category and purpose
  are looked up from there, never duplicated per risk) and
  `provisionReference` (free text, the specific clause this risk relates to).
- `irLikelihood`/`irImpact` and `rrLikelihood`/`rrImpact` (1–5 each), with
  `ir`/`rr` derived as their product — this is what feeds the heat map.
- `ownership` — `{ accountableUnit, responsiblePersons: [] }`, replacing a
  single free-text owner. `accountableUnit` can be a business unit or a
  chief directorate (real compliance risks are often owned at chief
  directorate level even though the risk itself sits under one business unit).
- `approvalStatus` / `approvalStage` — see Approval workflow above. Kept
  separate from `status` (the risk's own on-track/at-risk/overdue indicator).
- `pendingChange` — the in-flight draft while a risk is Submitted/Changes
  Required/Rejected, or while a fresh reassessment round has started on an
  Approved risk. The risk's top-level fields stay frozen at the last
  *approved* values until the CRO authorises the new round — so anyone
  viewing the register mid-review never sees an unapproved edit.
- `scoreHistory` — a `{date, ir, rr}` point per reassessment, feeding the
  trend charts.
- `history` — a full audit trail (`created`/`edited`/`proposed`/
  `changes-requested`/`rejected`/`approved`), each entry with actor, role,
  timestamp, and an optional field-level diff.
- `comments` — a discussion thread on the risk.

`src/data/orgStructure.js` holds the Branch → Chief Directorate → Business
Unit hierarchy. Only "Resource Management" and its four business units
(Human Resource, Security & Auxiliary Services, HRD, DRMC) are real,
confirmed EGOV structure — everything else is clearly-marked placeholder
(`"... (placeholder)"`) pending the rest of the org chart. Swapping
placeholder names for real ones is a pure data change; nothing else reads
hardcoded org names.

Live state is lifted into `App.jsx` and persisted to `localStorage` via
`src/utils/storage.js`, so everything survives a page refresh. That's the
seam to replace with a real backend later — swap the storage helpers for
fetch/API calls and the components won't need to change.

## Known gaps / next steps

- **No real backend or auth** — persistence is `localStorage` only, per
  browser; the role switch is a demo convenience, not login. A production
  rollout needs a real API/database and server-side access control.
- **Compliance-review stage** — the SCM manual's SCM Manager compliance
  review is currently absorbed into the CRO's final approval, per the
  client's decision. The approval chain is an ordered array
  (`APPROVAL_CHAIN` in `orgStructure.js`) specifically so inserting a
  distinct stage later is a small change, not a rewrite.
- **Rest of the EGOV org chart** — only Resource Management is confirmed
  real; the remaining branches/chief directorates are placeholder.
- **Loose-text dates** — `targetDate` and action-plan `target` are free text;
  the reminders parser only recognises "D Mon YYYY" and silently skips
  anything else (e.g. "2027/2028 FY" or "Monthly"). A structured date field
  would make this more robust.
- Logo currently in `src/assets/gpg-logo.png` reads "Gauteng Province
  Education" — confirm this is the right crest for EGOV.
