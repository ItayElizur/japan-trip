import { useState } from "react";
import FESTIVALS from "../data/festivals";
import { MONTH_NAMES } from "../data/constants";

export default function FestivalsTab({ dark, startDate, endDate, fMonthFilter, setFMonthFilter, festivalsInRange, fmtDateHe }: any) {
  const [openFestival, setOpenFestival] = useState<string | null>(null);

  const allFestMonths = ["הכל", ...Array.from(new Set(FESTIVALS.map((f: any) => f.month))).sort((a: any, b: any) => a - b).map((m: any) => String(m))];
  const shownFests = fMonthFilter === "הכל" ? FESTIVALS : FESTIVALS.filter((f: any) => String(f.month) === fMonthFilter);
  const groupedFests: Record<string, any[]> = {};
  shownFests.forEach((f: any) => {
    if (!groupedFests[f.month]) groupedFests[f.month] = [];
    groupedFests[f.month].push(f);
  });
  Object.keys(groupedFests).forEach(m => {
    groupedFests[m].sort((a: any, b: any) => a.day - b.day);
  });

  return (
    <div>
      <div style={{ background: "#FFFBEB", border: "1px solid #F59E0B", borderRadius: 12, padding: "12px 16px", marginBottom: "1.25rem" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#78350F", lineHeight: 1.7 }}>
          🗓 <strong>הטיול:</strong> {fmtDateHe(startDate)}–{fmtDateHe(endDate)}. פסטיבלים ✈️ הם בתאריכי הטיול. לחצו על פסטיבל לפרטים.
        </p>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {allFestMonths.map((m: string) => (
          <button key={m} className="jp-tag-btn" onClick={() => setFMonthFilter(m)}
            style={fMonthFilter === m ? { background: "#FEF3C7", borderColor: "#D97706", color: "#78350F", fontWeight: 600 } : {}}>
            {m === "הכל" ? "כל החודשים" : (MONTH_NAMES as any)[Number(m)]}
          </button>
        ))}
      </div>
      {Object.entries(groupedFests).sort((a, b) => Number(a[0]) - Number(b[0])).map(([month, fests]: [string, any]) => (
        <div key={month} style={{ marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{(MONTH_NAMES as any)[Number(month)]}</span>
            {fests.some((f: any) => festivalsInRange.some((fr: any) => fr.name === f.name)) && (
              <span style={{ background: "#DCFCE7", color: "#14532D", fontSize: 11, padding: "2px 10px", borderRadius: 8, fontWeight: 600 }}>✈️ בטיול שלכם</span>
            )}
            <div style={{ flex: 1, borderBottom: "1px solid var(--color-border-tertiary)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 10 }}>
            {fests.map((f: any) => {
              const inTrip = festivalsInRange.some((fr: any) => fr.name === f.name);
              const isOpen = openFestival === f.name;
              return (
                <div key={f.name} className="fest-card"
                  onClick={() => setOpenFestival(isOpen ? null : f.name)}
                  style={{
                    background: inTrip ? (dark ? "#1a2e1a" : "#F0FDF4") : "var(--color-background-primary)",
                    border: `1.5px solid ${isOpen ? f.border : inTrip ? "#16A34A" : "var(--color-border-tertiary)"}`,
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, flex: 1, paddingLeft: 6 }}>{f.name}</div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
                      {inTrip && <span>✈️</span>}
                      <span style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "inline-block", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: inTrip ? "#15803D" : "var(--color-text-secondary)", fontWeight: 600, marginBottom: 2 }}>
                    📅 {f.day}–{f.endDay}/{f.month}
                    {f.peakDay && <span style={{ fontWeight: 400, color: "var(--color-text-secondary)" }}> · שיא: {f.peakDay}/{f.month}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", ...(isOpen ? { marginBottom: 10 } : {}) }}>📍 {f.region}</div>
                  {isOpen && f.desc && (
                    <div style={{ borderTop: `1.5px solid ${f.border}55`, paddingTop: 10, marginTop: 2 }}>
                      <p style={{ fontSize: 13, lineHeight: 1.75, margin: 0, color: dark ? "#e5e7eb" : "#111827" }}>{f.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
