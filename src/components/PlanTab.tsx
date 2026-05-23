import DATA from "../data/regions";
import { FONT } from "../data/constants";
import FESTIVALS from "../data/festivals";

export default function PlanTab({
  dark, startDate, endDate, setStartDate, setEndDate, saveTripDates,
  dateList, itin, favPool, festivalsInRange, fmtDateHe, heDate, heDay,
  onDragStart, onDragOver, onDrop, onDragLeave, removeFromDay, dragOver,
  dayOverrides, setDayOverride,
}: any) {
  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>מ:</label>
          <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); saveTripDates(e.target.value, endDate); }}
            style={{ padding: "6px 10px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", fontSize: 13, fontFamily: FONT, colorScheme: dark ? "dark" : "light" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>עד:</label>
          <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); saveTripDates(startDate, e.target.value); }}
            style={{ padding: "6px 10px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", fontSize: 13, fontFamily: FONT, colorScheme: dark ? "dark" : "light" }} />
        </div>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{dateList.length} ימים</span>
      </div>

      {festivalsInRange.length > 0 && (
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>🎏 פסטיבלים בתאריכי הטיול</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {festivalsInRange.map((f: any) => (
              <div key={f.name} style={{ background: f.color, border: `1px solid ${f.border}`, borderRadius: 8, padding: "4px 12px", fontSize: 12, color: f.text, fontWeight: 500 }}>
                {f.name} · {f.day}/{f.month}–{f.endDay}/{f.month}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: 16, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--color-text-secondary)" }}>✅ מועדפים ({favPool.length})</div>
          {favPool.length === 0 && <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>סמנו מקומות כ-✅ בחקרו, ואז גררו לימים.</p>}
          <div style={{ maxHeight: 520, overflowY: "auto" }}>
            {favPool.map((item: any) => (
              <div key={item.id} className="fav-chip"
                draggable onDragStart={() => onDragStart(item, "pool")}
                style={{ borderRight: `3px solid ${(DATA as any)[item.region]?.border || "#ccc"}` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{item.nameHe}</div>
                  {item.multiDay && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#7C3AED", marginTop: 2 }}>
                      <button
                        onMouseDown={e => e.stopPropagation()}
                        onClick={e => { e.stopPropagation(); setDayOverride(item.id, Math.max(1, item.defaultDays - 1)); }}
                        style={{ background: "none", border: "1px solid #7C3AED", borderRadius: 4, cursor: "pointer", color: "#7C3AED", fontSize: 11, lineHeight: 1, padding: "0 4px", fontWeight: 700 }}>−</button>
                      🗓 {item.defaultDays} ימים
                      <button
                        onMouseDown={e => e.stopPropagation()}
                        onClick={e => { e.stopPropagation(); setDayOverride(item.id, item.defaultDays + 1); }}
                        style={{ background: "none", border: "1px solid #7C3AED", borderRadius: 4, cursor: "pointer", color: "#7C3AED", fontSize: 11, lineHeight: 1, padding: "0 4px", fontWeight: 700 }}>+</button>
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 12, opacity: 0.35 }}>⠿</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(dateList.length, 7)},1fr)`, gap: 8, minWidth: dateList.length > 7 ? 660 : undefined }}>
            {dateList.map((date: string, di: number) => {
              const items = itin[date] || [];
              const dayFests = FESTIVALS.filter((f: any) => {
                const fd = new Date(2025, f.month - 1, f.day);
                const fe = new Date(2025, f.month - 1, f.endDay);
                const dd = new Date(date);
                return dd >= fd && dd <= fe;
              });

              return (
                <div key={date}>
                  <div className={`day-col${dragOver === date ? " drag-over" : ""}`}
                    onDragOver={e => onDragOver(e, date)} onDragLeave={onDragLeave} onDrop={e => onDrop(e, date)}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 5, display: "flex", justifyContent: "space-between" }}>
                      <span>{heDay(date)} {heDate(date)}</span>
                      {dayFests.length > 0 && <span title={dayFests.map((f: any) => f.name).join(", ")}>🎏</span>}
                    </div>
                    {items.map((item: any) => (
                      <div key={item.id}>
                        <div className="itin-chip" draggable onDragStart={() => onDragStart(item, date)}
                          style={{ borderRight: `3px solid ${item.multiDay ? "#7C3AED" : (DATA as any)[item.region]?.border || "#ccc"}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3, flex: 1 }}>{item.nameHe}</span>
                            <button onClick={() => removeFromDay(date, item.id)}
                              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--color-text-secondary)", padding: 0, lineHeight: 1 }}>×</button>
                          </div>
                          <span style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{(DATA as any)[item.region]?.nameHe}</span>
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && <div style={{ fontSize: 10, color: "var(--color-text-secondary)", textAlign: "center", padding: "10px 0", opacity: 0.4 }}>גרור לכאן</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 11, color: "var(--color-text-secondary)", flexWrap: "wrap" }}>
        <span style={{ color: "#7C3AED" }}>🗓 פריט מרובה-ימים</span>
      </div>
    </div>
  );
}
