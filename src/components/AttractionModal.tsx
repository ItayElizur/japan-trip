import DATA from "../data/regions";
import { TAGS, VOTE_OPTIONS, FONT } from "../data/constants";
import { vKey, cKey } from "../utils/storage";

export default function AttractionModal({ dark, openCard, votes, comments, newComment, setNewComment, castVote, addComment, setOpenCard, setView }: any) {
  if (!openCard) return null;

  const cardVote = votes[vKey(openCard.rid, openCard.area.nameEn, openCard.att.nameEn)];
  const cardCmts = comments[cKey(openCard.rid, openCard.area.nameEn, openCard.att.nameEn)] || [];

  return (
    <div className="jp-modal-backdrop" onClick={() => { setOpenCard(null); setNewComment(""); }}>
      <div className={`jp-modal${dark ? " dark" : ""}`} onClick={(e: any) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 3 }}>{openCard.att.nameHe}</div>
            <div style={{ fontSize: 13 }} className="jp-modal-muted">{openCard.att.nameEn} · {(DATA as any)[openCard.rid].nameHe} · {openCard.area.nameHe}</div>
          </div>
          <button className="jp-close-btn" onClick={() => setOpenCard(null)}>×</button>
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
          {openCard.att.tags.map((t: string) => {
            const tag = (TAGS as any)[t];
            return tag ? <span key={t} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 12, background: tag.color, color: tag.text, fontWeight: 500 }}>{tag.label}</span> : null;
          })}
          {openCard.att.multiDay && <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 12, background: "#EDE9FE", color: "#4C1D95", fontWeight: 500 }}>🗓 {openCard.att.defaultDays} ימים</span>}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>{openCard.att.desc}</p>
        {openCard.att.nameEn === "Kumano Kodo Trek" && (
          <button
            onClick={() => { setView("kumano"); setOpenCard(null); }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#DCFCE7", border: "1px solid #16A34A", borderRadius: 10, padding: "7px 14px", fontSize: 13, fontFamily: FONT, color: "#14532D", cursor: "pointer", marginBottom: 16, fontWeight: 500 }}>
            🌲 פתח מדריך מפורט ↗
          </button>
        )}
        {openCard.att.lat && (
          <a href={`https://www.google.com/maps/search/?api=1&query=${openCard.att.lat},${openCard.att.lng}`}
            target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: dark ? "#374151" : "#f3f4f6", border: `0.5px solid ${dark ? "#4b5563" : "#d1d5db"}`, borderRadius: 10, padding: "7px 14px", fontSize: 13, fontFamily: FONT, color: dark ? "#d1d5db" : "#374151", textDecoration: "none", marginBottom: 18 }}>
            📍 פתח ב-Google Maps ↗
          </a>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 8 }}>
          {VOTE_OPTIONS.map((opt: any) => (
            <button key={opt.emoji} className={`jp-modal-vote-btn${cardVote === opt.emoji ? " active" : ""}`}
              onClick={() => castVote(openCard.rid, openCard.area.nameEn, openCard.att.nameEn, opt.emoji)}
              style={cardVote === opt.emoji ? { borderColor: opt.border, background: opt.bg } : {}}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{opt.emoji}</div>
              <div style={{ fontSize: 12, color: cardVote === opt.emoji ? opt.color : (dark ? "#9ca3af" : "#6b7280"), fontWeight: cardVote === opt.emoji ? 600 : 400 }}>{opt.labelHe}</div>
            </button>
          ))}
        </div>
        {cardVote && <p style={{ fontSize: 11, textAlign: "center", marginBottom: 16 }} className="jp-modal-muted">לחצו שוב לביטול</p>}
        <hr className="jp-modal-divider" style={{ marginBottom: 14 }} />
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>💬 הערות ({cardCmts.length})</div>
        {cardCmts.length === 0 && <p style={{ fontSize: 13, marginBottom: 12 }} className="jp-modal-muted">אין הערות — היו הראשונים!</p>}
        {cardCmts.map((c: any, i: number) => (
          <div key={i} className="jp-comment-bubble">
            <p style={{ fontSize: 13, margin: "0 0 4px", lineHeight: 1.6 }}>{c.text}</p>
            <span style={{ fontSize: 10 }} className="jp-modal-muted">{new Date(c.ts).toLocaleDateString("he-IL")}</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input className="jp-modal-input" value={newComment} onChange={(e: any) => setNewComment(e.target.value)}
            onKeyDown={(e: any) => e.key === "Enter" && addComment(openCard.rid, openCard.area.nameEn, openCard.att.nameEn)}
            placeholder="הוסיפו הערה..." dir="rtl" />
          <button className="jp-modal-send" onClick={() => addComment(openCard.rid, openCard.area.nameEn, openCard.att.nameEn)}>שלח</button>
        </div>
      </div>
    </div>
  );
}
