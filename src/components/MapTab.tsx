import DATA from "../data/regions";
import { TAGS, VOTE_OPTIONS, FONT } from "../data/constants";
import { vKey } from "../utils/storage";

export default function MapTab({ dark, activeRegion, setActiveRegion, votes }: any) {
  return (
    <div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 14, padding: "14px 18px", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 28 }}>🗺</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>המפה המלאה</div>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Google My Maps שלכם</div>
        </div>
        <a href="https://www.google.com/maps/d/u/0/edit?mid=1JU1LDVQgkGSPGxMhWEAd03M1eUFn5U0" target="_blank" rel="noreferrer"
          style={{ padding: "8px 16px", borderRadius: 10, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", fontSize: 13, fontFamily: FONT, color: "var(--color-text-primary)", textDecoration: "none", fontWeight: 500 }}>
          פתח ↗
        </a>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1rem", justifyContent: "center" }}>
        {Object.entries(DATA).map(([rid, rdd]: [string, any]) => (
          <button key={rid} className="jp-region-btn" onClick={() => setActiveRegion(rid)}
            style={activeRegion === rid ? { borderColor: rdd.border, background: rdd.color, color: rdd.textColor, fontWeight: 600 } : {}}>
            {rdd.nameHe}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))", gap: 8 }}>
        {DATA[activeRegion].areas.flatMap((area: any) =>
          area.attractions.filter((a: any) => a.lat).map((att: any) => {
            const k = vKey(activeRegion, area.nameEn, att.nameEn);
            const v = votes[k];
            const vopt = VOTE_OPTIONS.find((o: any) => o.emoji === v);
            return (
              <a key={att.nameEn} className="jp-map-card"
                href={`https://www.google.com/maps/search/?api=1&query=${att.lat},${att.lng}`}
                target="_blank" rel="noreferrer"
                style={{ borderTop: `3px solid ${v ? vopt!.border : DATA[activeRegion].border}` }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{att.nameHe}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 6 }}>{area.nameHe}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {att.tags.slice(0, 2).map((t: string) => {
                      const tag = (TAGS as any)[t];
                      return tag ? <span key={t} style={{ fontSize: 10, padding: "1px 7px", borderRadius: 8, background: tag.color, color: tag.text }}>{tag.label}</span> : null;
                    })}
                  </div>
                  {v && <span style={{ fontSize: 14 }}>{v}</span>}
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
