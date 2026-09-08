import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import NavTabs from './components/NavTabs.jsx'
import DashboardView from './components/DashboardView.jsx'
import RegisterView from './components/RegisterView.jsx'
import BoardView from './components/BoardView.jsx'
import ReportsView from './components/ReportsView.jsx'
import RiskPanel from './components/RiskPanel.jsx'
import RiskFormModal from './components/RiskFormModal.jsx'
import RequestUpdateModal from './components/RequestUpdateModal.jsx'
import RequestDetailModal from './components/RequestDetailModal.jsx'
import ProposalReviewModal from './components/ProposalReviewModal.jsx'
import { RISKS, BOARD_CARDS, CURRENT_USER } from './data/risks.js'
import { loadRisks, saveRisks, loadBoardCards, saveBoardCards } from './utils/storage.js'
import { nextNr, uid, nowIso, appendScoreHistory } from './utils/helpers.jsx'
import { diffRisk } from './utils/audit.js'

export default function App() {
  const [view, setView] = useState('dashboard')
  const [role, setRole] = useState('official')
  const [risks, setRisks] = useState(() => loadRisks(RISKS))
  const [boardCards, setBoardCards] = useState(() => loadBoardCards(BOARD_CARDS))
  const [selectedNr, setSelectedNr] = useState(null)
  const [formModal, setFormModal] = useState(null) // { mode: 'create' | 'edit' | 'propose', risk }
  const [requestModal, setRequestModal] = useState(null) // risk
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [proposalReviewNr, setProposalReviewNr] = useState(null)

  useEffect(() => { saveRisks(risks) }, [risks])
  useEffect(() => { saveBoardCards(boardCards) }, [boardCards])

  const selectedRisk = risks.find(r => r.nr === selectedNr) || null
  const selectedCard = boardCards.find(c => c.id === selectedCardId) || null
  const proposalReviewRisk = risks.find(r => r.nr === proposalReviewNr) || null

  // Only one overlay-style modal is ever shown at a time - stacking two of them
  // pushed the second one out of view under the old in-flow overlay layout, so
  // keep that invariant explicit here rather than relying on CSS alone.
  const anyModalOpen = Boolean(formModal || requestModal || selectedCardId || proposalReviewNr)

  function historyEntry(patch) {
    return { id: uid(), timestamp: nowIso(), actor: CURRENT_USER.name, actorRole: role, ...patch }
  }

  function addRisk(data) {
    const nr = nextNr(risks)
    const risk = {
      ...data, nr,
      history: [historyEntry({ action: 'created', summary: 'Risk added to the register.' })],
      scoreHistory: appendScoreHistory([], data),
      comments: [],
      pendingChange: null
    }
    setRisks(rs => [...rs, risk])
    setFormModal(null)
    setSelectedNr(nr)
  }

  function updateRisk(nr, data) {
    setRisks(rs => rs.map(r => {
      if (r.nr !== nr) return r
      const diff = diffRisk(r, data)
      const scoreChanged = r.ir !== data.ir || r.rr !== data.rr
      const summary = r.pendingChange
        ? 'Risk details updated directly (superseded a pending proposal).'
        : 'Risk details updated.'
      return {
        ...data, nr,
        history: [...r.history, historyEntry({ action: 'edited', summary, diff })],
        scoreHistory: scoreChanged ? appendScoreHistory(r.scoreHistory, data) : r.scoreHistory,
        comments: r.comments,
        pendingChange: null
      }
    }))
    setFormModal(null)
  }

  function deleteRisk(nr) {
    setRisks(rs => rs.filter(r => r.nr !== nr))
    setFormModal(null)
    setSelectedNr(null)
  }

  function proposeChange(nr, data) {
    setRisks(rs => rs.map(r => r.nr === nr ? {
      ...r,
      pendingChange: { data, proposedBy: CURRENT_USER.name, proposedByRole: role, proposedAt: nowIso() },
      history: [...r.history, historyEntry({ action: 'proposed', summary: 'Submitted proposed changes for approval.' })]
    } : r))
    setFormModal(null)
  }

  function approveChange(nr) {
    setRisks(rs => rs.map(r => {
      if (r.nr !== nr || !r.pendingChange) return r
      const data = r.pendingChange.data
      const diff = diffRisk(r, data)
      const scoreChanged = r.ir !== data.ir || r.rr !== data.rr
      return {
        ...data, nr,
        history: [...r.history, historyEntry({ action: 'approved', summary: `Approved changes proposed by ${r.pendingChange.proposedBy}.`, diff })],
        scoreHistory: scoreChanged ? appendScoreHistory(r.scoreHistory, data) : r.scoreHistory,
        comments: r.comments,
        pendingChange: null
      }
    }))
    setProposalReviewNr(null)
  }

  function rejectChange(nr, reason) {
    setRisks(rs => rs.map(r => {
      if (r.nr !== nr || !r.pendingChange) return r
      const summary = reason
        ? `Rejected proposed changes from ${r.pendingChange.proposedBy}: ${reason}`
        : `Rejected proposed changes from ${r.pendingChange.proposedBy}.`
      return {
        ...r,
        pendingChange: null,
        history: [...r.history, historyEntry({ action: 'rejected', summary })]
      }
    }))
    setProposalReviewNr(null)
  }

  function addComment(nr, text) {
    setRisks(rs => rs.map(r => r.nr === nr ? {
      ...r,
      comments: [...(r.comments || []), { id: uid(), author: CURRENT_USER.name, role, text: text.trim(), timestamp: nowIso() }]
    } : r))
  }

  function submitAssessmentRequest(risk, note) {
    setBoardCards(cards => [
      ...cards,
      {
        id: uid(),
        stage: 'Request submitted',
        businessUnit: risk.businessUnit,
        risk: risk.risk,
        riskNr: risk.nr,
        date: `Submitted ${new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}`,
        note,
        mgmtNotes: ''
      }
    ])
    setRequestModal(null)
  }

  function advanceCardStage(id, stage) {
    setBoardCards(cards => cards.map(c => (c.id === id ? { ...c, stage } : c)))
  }

  function saveCardNotes(id, mgmtNotes) {
    setBoardCards(cards => cards.map(c => (c.id === id ? { ...c, mgmtNotes } : c)))
  }

  function openRiskFromCard(nr) {
    setSelectedCardId(null)
    setSelectedNr(nr)
  }

  return (
    <>
      <Header role={role} setRole={setRole} />
      <NavTabs view={view} setView={setView} />

      <div className="wrap">
        {view === 'dashboard' && (
          <DashboardView
            risks={risks}
            boardCards={boardCards}
            role={role}
            onNavigate={setView}
            onOpenRisk={setSelectedNr}
            onOpenProposalReview={setProposalReviewNr}
            onOpenCard={c => setSelectedCardId(c.id)}
            onQuickAdd={() => setFormModal({ mode: 'create', risk: null })}
          />
        )}
        {view === 'register' && (
          <RegisterView
            risks={risks}
            role={role}
            onSelectRisk={r => setSelectedNr(r.nr)}
            onAddRisk={() => setFormModal({ mode: 'create', risk: null })}
          />
        )}
        {view === 'board' && (
          <BoardView boardCards={boardCards} onSelectCard={c => setSelectedCardId(c.id)} />
        )}
        {view === 'reports' && <ReportsView risks={risks} />}
      </div>

      {selectedRisk && !anyModalOpen && (
        <RiskPanel
          risk={selectedRisk}
          role={role}
          onClose={() => setSelectedNr(null)}
          onEdit={() => setFormModal({ mode: 'edit', risk: selectedRisk })}
          onPropose={() => setFormModal({ mode: 'propose', risk: selectedRisk })}
          onRequestUpdate={() => setRequestModal(selectedRisk)}
          onReviewProposal={() => setProposalReviewNr(selectedRisk.nr)}
          onAddComment={addComment}
        />
      )}

      {formModal && (
        <RiskFormModal
          mode={formModal.mode}
          risk={formModal.risk}
          defaultBusinessUnit={role === 'official' ? CURRENT_USER.businessUnit : ''}
          onCancel={() => setFormModal(null)}
          onCreate={addRisk}
          onSave={data => updateRisk(formModal.risk.nr, data)}
          onPropose={data => proposeChange(formModal.risk.nr, data)}
          onDelete={() => deleteRisk(formModal.risk.nr)}
        />
      )}

      {requestModal && (
        <RequestUpdateModal
          risk={requestModal}
          onCancel={() => setRequestModal(null)}
          onSubmit={note => submitAssessmentRequest(requestModal, note)}
        />
      )}

      {selectedCard && (
        <RequestDetailModal
          card={selectedCard}
          role={role}
          linkedRisk={risks.find(r => r.nr === selectedCard.riskNr) || null}
          onClose={() => setSelectedCardId(null)}
          onAdvanceStage={stage => advanceCardStage(selectedCard.id, stage)}
          onSaveNotes={notes => saveCardNotes(selectedCard.id, notes)}
          onViewRisk={openRiskFromCard}
        />
      )}

      {proposalReviewRisk && (
        <ProposalReviewModal
          risk={proposalReviewRisk}
          readOnly={role !== 'riskmgmt'}
          onClose={() => setProposalReviewNr(null)}
          onApprove={() => approveChange(proposalReviewRisk.nr)}
          onReject={reason => rejectChange(proposalReviewRisk.nr, reason)}
        />
      )}
    </>
  )
}
