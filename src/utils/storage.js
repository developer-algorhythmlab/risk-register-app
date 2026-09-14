// v2: risk schema gained the approval chain (approvalStatus/approvalStage) and
// business units moved to the EGOV org structure - bumped so a browser holding
// v1 (two-role) prototype data falls back to fresh seed data instead of
// crashing on the old shape.
const RISKS_KEY = "grr.risks.v2"
const BOARD_KEY = "grr.board.v2"
const PERIOD_KEY = "grr.period.v1"
const ORG_KEY = "grr.org.v1"
const PERSONAS_KEY = "grr.personas.v1"

function load(key, seed) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : seed
  } catch {
    return seed
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable (private mode, quota) - state still holds in memory
  }
}

export const loadRisks = seed => load(RISKS_KEY, seed)
export const saveRisks = risks => save(RISKS_KEY, risks)

export const loadBoardCards = seed => load(BOARD_KEY, seed)
export const saveBoardCards = cards => save(BOARD_KEY, cards)

export const loadPeriod = seed => load(PERIOD_KEY, seed)
export const savePeriod = period => save(PERIOD_KEY, period)

export const loadOrgStructure = seed => load(ORG_KEY, seed)
export const saveOrgStructure = org => save(ORG_KEY, org)

export const loadPersonas = seed => load(PERSONAS_KEY, seed)
export const savePersonas = personas => save(PERSONAS_KEY, personas)
