import { BOARD_STAGES } from '../data/risks.js'

export default function BoardView({ boardCards, onSelectCard }) {
  return (
    <div className="view-enter">
      <div className="lane-legend">
        <span><b>Business unit</b> — submits and confirms availability</span>
        <span><b>Risk management</b> — schedules, conducts, reports</span>
      </div>
      <div className="board">
        {BOARD_STAGES.map((stage, i) => {
          const lane = i < 2 ? 'Business unit' : 'Risk management'
          const cards = boardCards.filter(c => c.stage === stage)
          return (
            <div className="col" key={stage}>
              <h4>{stage}</h4>
              <div className="lane">{lane}</div>
              {cards.map(c => (
                <div className="card" key={c.id} onClick={() => onSelectCard(c)}>
                  <div className="bu">{c.businessUnit}</div>
                  <div className="rn">{c.risk}</div>
                  <div className="dt">{c.date}</div>
                </div>
              ))}
              {cards.length === 0 && <div className="col-empty">No requests</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
