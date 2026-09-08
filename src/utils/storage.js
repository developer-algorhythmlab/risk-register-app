const RISKS_KEY = "grr.risks.v1"
const BOARD_KEY = "grr.board.v1"

export function loadRisks(seed) {
  try {
    const raw = localStorage.getItem(RISKS_KEY)
    return raw ? JSON.parse(raw) : seed
  } catch {
    return seed
  }
}

export function saveRisks(risks) {
  try {
    localStorage.setItem(RISKS_KEY, JSON.stringify(risks))
  } catch {
    // storage unavailable (private mode, quota) - state still holds in memory
  }
}

export function loadBoardCards(seed) {
  try {
    const raw = localStorage.getItem(BOARD_KEY)
    return raw ? JSON.parse(raw) : seed
  } catch {
    return seed
  }
}

export function saveBoardCards(cards) {
  try {
    localStorage.setItem(BOARD_KEY, JSON.stringify(cards))
  } catch {
    // storage unavailable - state still holds in memory
  }
}
