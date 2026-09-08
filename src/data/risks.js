export const CURRENT_USER = { name: "Freddy M.", businessUnit: "e-Government" }

export const BUSINESS_UNITS = [
  "e-Government", "Health", "Human Settlements", "Social Development",
  "Education", "Infrastructure Development", "Treasury"
]

export const CATEGORIES = [
  "Project and programme management", "ICT infrastructure", "Compliance",
  "Financial management", "Human resources", "Service delivery", "Governance"
]

export const RESPONSES = ["Mitigate", "Accept", "Transfer", "Avoid"]

export const OUTCOMES = [
  "Modernised provincial ICT infrastructure and connectivity",
  "Improved risk and governance maturity across departments"
]

export const RISKS = [
  {
    outcome: "Modernised provincial ICT infrastructure and connectivity",
    nr: 1, businessUnit: "e-Government", category: "Project and programme management",
    risk: "Failure to modernise and innovate infrastructure services",
    rootCauses: [
      "Lack of asset lifecycle and equipment management",
      "Failure to procure current/up to date equipment",
      "Insufficient budget/funding to replace obsolete equipment"
    ],
    controls: [
      "Lifecycle roadmaps on Microsoft products",
      "Asset register",
      "Asset management policy",
      "e-Waste policy"
    ],
    irLikelihood: 5, irImpact: 5, rrLikelihood: 3, rrImpact: 5,
    ir: 25, rr: 15, response: "Mitigate",
    actionPlan: [
      { plan: "Allocate a portion of the budget to the replacement of capital equipment.", progress: "An amount of R241M has been allocated to networking equipment.", target: "2027/2028 FY", status: "amber" },
      { plan: "Develop a standard for computer operating systems (N-1).", progress: "The OS (N-1) is incorporated on the GPG server standard.", target: "31 Dec 2026", status: "amber" },
      { plan: "Contribute to the review of the asset management policy.", progress: "Asset management policy was reviewed.", target: "15 Feb 2027", status: "green" }
    ],
    owner: "Acting DDG: ICT — Mr L. Canca", targetDate: "31 Jul 2026", status: "amber", progressPct: 55,
    assessmentDate: "2026-05-14",
    history: [
      { id: "h1-1", timestamp: "2026-02-10T09:00:00.000Z", actor: "Director: Risk Management", actorRole: "riskmgmt", action: "created", summary: "Risk added to the register." },
      { id: "h1-2", timestamp: "2026-05-14T11:30:00.000Z", actor: "Acting DDG: ICT — Mr L. Canca", actorRole: "riskmgmt", action: "edited", summary: "Reassessed following Q1 budget allocation.", diff: [
        { field: "Residual risk (RR)", label: "Residual risk (RR)", before: "18", after: "15" },
        { field: "progressPct", label: "Overall progress", before: "40%", after: "55%" }
      ] }
    ],
    scoreHistory: [
      { date: "2026-02-10", ir: 25, rr: 20 },
      { date: "2026-04-01", ir: 25, rr: 18 },
      { date: "2026-05-14", ir: 25, rr: 15 }
    ],
    comments: [
      { id: "c1-1", author: "Director: Risk Management", role: "riskmgmt", text: "Please confirm the N-1 OS standard is now enforced at all sites, not just GPG core.", timestamp: "2026-05-16T08:12:00.000Z" },
      { id: "c1-2", author: "Freddy M.", role: "official", text: "Confirmed with infrastructure team — rollout to district sites completes end of June.", timestamp: "2026-05-18T14:40:00.000Z" }
    ],
    pendingChange: null
  },
  {
    outcome: "Modernised provincial ICT infrastructure and connectivity",
    nr: 2, businessUnit: "Health", category: "ICT infrastructure",
    risk: "Network downtime at facility level affecting service delivery",
    rootCauses: [
      "Ageing switches at clinic sites",
      "No redundant links at priority facilities"
    ],
    controls: [
      "GPN service level agreement",
      "Incident management process"
    ],
    irLikelihood: 4, irImpact: 5, rrLikelihood: 3, rrImpact: 4,
    ir: 20, rr: 12, response: "Mitigate",
    actionPlan: [
      { plan: "Prioritise GPN link replacement at top 20 facilities.", progress: "8 of 20 sites completed.", target: "25 Sep 2026", status: "amber" }
    ],
    owner: "Chief Director: Infrastructure — Mr M. Ludwig", targetDate: "30 Nov 2026", status: "green", progressPct: 40,
    assessmentDate: "2026-06-02",
    history: [
      { id: "h2-1", timestamp: "2026-03-01T09:00:00.000Z", actor: "Director: Risk Management", actorRole: "riskmgmt", action: "created", summary: "Risk added to the register." },
      { id: "h2-2", timestamp: "2026-06-02T10:00:00.000Z", actor: "Chief Director: Infrastructure — Mr M. Ludwig", actorRole: "riskmgmt", action: "edited", summary: "Updated after site rollout progress review." }
    ],
    scoreHistory: [
      { date: "2026-03-01", ir: 20, rr: 16 },
      { date: "2026-06-02", ir: 20, rr: 12 }
    ],
    comments: [],
    pendingChange: null
  },
  {
    outcome: "Improved risk and governance maturity across departments",
    nr: 3, businessUnit: "e-Government", category: "Compliance",
    risk: "Departmental risk registers maintained manually outside BarnOwl",
    rootCauses: [
      "Only one BarnOwl licence per department",
      "Managers without licences default to spreadsheets",
      "No single source of truth for risk status"
    ],
    controls: [
      "Manual risk register templates",
      "Quarterly risk committee review"
    ],
    irLikelihood: 4, irImpact: 4, rrLikelihood: 3, rrImpact: 3,
    ir: 16, rr: 9, response: "Mitigate",
    actionPlan: [
      { plan: "Roll out the new risk register system to unlicensed managers.", progress: "Prototype in review with e-Government.", target: "31 Mar 2027", status: "green" }
    ],
    owner: "Director: Risk Management", targetDate: "31 Mar 2027", status: "green", progressPct: 20,
    assessmentDate: "2026-04-21",
    history: [
      { id: "h3-1", timestamp: "2026-01-15T09:00:00.000Z", actor: "Director: Risk Management", actorRole: "riskmgmt", action: "created", summary: "Risk added to the register." },
      { id: "h3-2", timestamp: "2026-04-21T09:30:00.000Z", actor: "Director: Risk Management", actorRole: "riskmgmt", action: "edited", summary: "Reassessed at Q4 risk committee review." }
    ],
    scoreHistory: [
      { date: "2026-01-15", ir: 16, rr: 12 },
      { date: "2026-04-21", ir: 16, rr: 9 }
    ],
    comments: [
      { id: "c3-1", author: "Freddy M.", role: "official", text: "Prototype demo went well with the e-Government risk champions — rollout plan attached in SharePoint.", timestamp: "2026-05-02T09:20:00.000Z" }
    ],
    pendingChange: {
      proposedBy: "Freddy M.",
      proposedByRole: "official",
      proposedAt: "2026-08-20T13:05:00.000Z",
      data: {
        outcome: "Improved risk and governance maturity across departments",
        businessUnit: "e-Government",
        category: "Compliance",
        risk: "Departmental risk registers maintained manually outside BarnOwl",
        rootCauses: [
          "Only one BarnOwl licence per department",
          "Managers without licences default to spreadsheets",
          "No single source of truth for risk status"
        ],
        controls: [
          "Manual risk register templates",
          "Quarterly risk committee review",
          "Interim web-based risk register prototype"
        ],
        irLikelihood: 4, irImpact: 4, rrLikelihood: 3, rrImpact: 3,
        ir: 16, rr: 9, response: "Mitigate",
        actionPlan: [
          { plan: "Roll out the new risk register system to unlicensed managers.", progress: "Prototype demoed to e-Government risk champions; 3 of 9 unlicensed managers onboarded.", target: "31 Mar 2027", status: "green" }
        ],
        owner: "Director: Risk Management",
        targetDate: "31 Mar 2027",
        status: "green",
        progressPct: 35,
        assessmentDate: "2026-08-20"
      }
    }
  },
  {
    outcome: "Improved risk and governance maturity across departments",
    nr: 4, businessUnit: "Human Settlements", category: "Financial management",
    risk: "Delayed reporting of emerging risks to risk management office",
    rootCauses: [
      "No formal escalation route for business units",
      "Risk assessments requested ad hoc"
    ],
    controls: [
      "Risk assessment request form (manual)"
    ],
    irLikelihood: 4, irImpact: 3, rrLikelihood: 4, rrImpact: 2,
    ir: 12, rr: 8, response: "Accept",
    actionPlan: [
      { plan: "Introduce a standard request-for-assessment workflow.", progress: "Workflow mapped; system build in progress.", target: "20 Aug 2026", status: "red" }
    ],
    owner: "Risk Champion: Human Settlements", targetDate: "28 Feb 2027", status: "red", progressPct: 10,
    assessmentDate: "2026-07-09",
    history: [
      { id: "h4-1", timestamp: "2026-05-01T09:00:00.000Z", actor: "Director: Risk Management", actorRole: "riskmgmt", action: "created", summary: "Risk added to the register." },
      { id: "h4-2", timestamp: "2026-07-09T15:15:00.000Z", actor: "Director: Risk Management", actorRole: "riskmgmt", action: "edited", summary: "Target date slipped; workflow build behind schedule." }
    ],
    scoreHistory: [
      { date: "2026-05-01", ir: 12, rr: 10 },
      { date: "2026-07-09", ir: 12, rr: 8 }
    ],
    comments: [
      { id: "c4-1", author: "Risk Champion: Human Settlements", role: "official", text: "Can risk management confirm a build date? This has slipped twice already.", timestamp: "2026-08-01T11:00:00.000Z" }
    ],
    pendingChange: null
  }
]

export const BOARD_STAGES = [
  "Identified",
  "Request submitted",
  "Assessment scheduled",
  "Assessment conducted",
  "Report prepared"
]

export const BOARD_CARDS = [
  { id: "seed-1", stage: "Identified", businessUnit: "Human Settlements", risk: "Delayed reporting of emerging risks", date: "—", riskNr: 4, note: "", mgmtNotes: "" },
  { id: "seed-2", stage: "Request submitted", businessUnit: "Health", risk: "Network downtime at facility level", date: "Submitted 12 Aug", riskNr: 2, note: "", mgmtNotes: "" },
  { id: "seed-3", stage: "Assessment scheduled", businessUnit: "Social Development", risk: "Grant payment system outage", date: "Scheduled 2 Sep", riskNr: null, note: "", mgmtNotes: "Site visit confirmed with programme manager." },
  { id: "seed-4", stage: "Assessment conducted", businessUnit: "e-Government", risk: "Manual risk registers outside BarnOwl", date: "Conducted 25 Aug", riskNr: 3, note: "", mgmtNotes: "Assessment conducted with e-Government risk champion; report in drafting." },
  { id: "seed-5", stage: "Report prepared", businessUnit: "e-Government", risk: "Failure to modernise infrastructure", date: "Report issued 30 Jul", riskNr: 1, note: "", mgmtNotes: "Final report issued to Acting DDG: ICT." }
]
