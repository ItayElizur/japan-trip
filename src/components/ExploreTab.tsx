import DATA from "../data/regions";
import { TAGS, VOTE_OPTIONS } from "../data/constants";
import JapanOverviewMap from "./maps/JapanOverviewMap";
import RegionMap from "./maps/RegionMap";

export default function ExploreTab({ dark, activeRegion, setActiveRegion, tagFilter, setTagFilter, votes, comments, castVote, setOpenCard }: any) {
  const rd = activeRegion !== "intro" ? DATA[activeRegion] : null;
  const filteredAreas = rd
    ? rd.areas
        .map((area: any) => ({
          ...area,
          attractions: tagFilter === "הכל" ? area.attractions : area.attractions.filter((a: any) => a.tags.includes(tagFilter)),
        }))
        .filter((a: any) => a.attractions.length > 0)
    : [];

  const vKey = (r: string, a: string, n: string) => `v4:${r}:${a}:${n}`.replace(/\s/g, "_");
  const cKey = (r: string, a: string, n: string) => `c4:${r}:${a}:${n}`.replace(/\s/g, "_");

  return (
    <>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1rem", justifyContent: "center" }}>
        <button
          key="intro"
          className="jp-region-btn"
          onClick={() => setActiveRegion("intro")}
          style={activeRegion === "intro" ? { borderColor: "#6366f1", background: "#EEF2FF", color: "#3730a3", fontWeight: 600 } : {}}
        >
          🗾 מבוא
        </button>
        {Object.entries(DATA).map(([rid, rdd]: [string, any]) => (
          <button key={rid} className="jp-region-btn" onClick={() => { setActiveRegion(rid); setTagFilter("הכל"); }}
            style={activeRegion === rid ? { borderColor: rdd.border, background: rdd.color, color: rdd.textColor, fontWeight: 600 } : {}}>
            {rdd.nameHe}
          </button>
        ))}
      </div>

      {activeRegion === "intro" ? (
        <JapanOverviewMap setActiveRegion={(rid) => { setActiveRegion(rid); setTagFilter("הכל"); }} />
      ) : (
        <>
          <div style={{ background: rd.color, borderRadius: 14, padding: "14px 18px", marginBottom: "1.25rem", borderRight: `4px solid ${rd.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: rd.textColor, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 5 }}>{rd.nameHe} · {rd.nameEn}</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: rd.textColor }}>{rd.intro}</p>
          </div>

          <RegionMap rid={activeRegion} region={rd} />

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {["הכל", ...Object.keys(TAGS)].map(t => {
              const tag = (TAGS as any)[t];
              const active = tagFilter === t;
              return (
                <button key={t} className="jp-tag-btn" onClick={() => setTagFilter(t)}
                  style={active ? { borderColor: tag?.border || "var(--color-border-primary)", background: tag?.color, color: tag?.text } : {}}>
                  {t === "הכל" ? "הכל" : tag?.label}
                </button>
              );
            })}
          </div>
          {filteredAreas.map((area: any) => (
            <div key={area.nameEn} style={{ marginBottom: "2rem" }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{area.nameHe}</span>
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{area.nameEn}</span>
                </div>
                {area.desc && <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 6px", lineHeight: 1.6 }}>{area.desc}</p>}
                {area.festivals?.map((f: any) => (
                  <div key={f.name} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#FEF3C7", border: "1px solid #D97706", borderRadius: 8, padding: "4px 12px", fontSize: 12, color: "#78350F", marginBottom: 4 }}>
                    🎏 <strong>{f.name}</strong> — {f.dates}
                  </div>
                ))}
                <div style={{ borderBottom: "1px solid var(--color-border-tertiary)", marginTop: 8 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 10 }}>
                {area.attractions.map((att: any) => {
                  const k = vKey(activeRegion, area.nameEn, att.nameEn);
                  const v = votes[k];
                  const vopt = VOTE_OPTIONS.find((o: any) => o.emoji === v);
                  const cmts = comments[cKey(activeRegion, area.nameEn, att.nameEn)] || [];
                  return (
                    <div key={att.nameEn} className="jp-card"
                      style={{ borderTop: `3px solid ${v ? vopt!.border : rd.border}` }}
                      onClick={() => setOpenCard({ rid: activeRegion, area, att })}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{att.nameHe}</div>
                          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 1 }}>{att.nameEn}</div>
                        </div>
                        {cmts.length > 0 && <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>💬{cmts.length}</span>}
                      </div>
                      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 8px", lineHeight: 1.6, flexGrow: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{att.desc}</p>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                        {att.tags.map((t: string) => {
                          const tag = (TAGS as any)[t];
                          return tag ? <span key={t} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: tag.color, color: tag.text }}>{tag.label}</span> : null;
                        })}
                        {att.multiDay && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "#EDE9FE", color: "#4C1D95" }}>🗓 {att.defaultDays}י</span>}
                      </div>
                      <div style={{ display: "flex", gap: 5 }} onClick={e => e.stopPropagation()}>
                        {VOTE_OPTIONS.map((opt: any) => (
                          <button key={opt.emoji} className="jp-vote-btn"
                            onClick={e => { e.stopPropagation(); castVote(activeRegion, area.nameEn, att.nameEn, opt.emoji); }}
                            style={v === opt.emoji ? { borderColor: opt.border, background: opt.bg, color: opt.color } : { opacity: v && v !== opt.emoji ? 0.4 : 1 }}
                            title={opt.labelHe}>{opt.emoji}</button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
