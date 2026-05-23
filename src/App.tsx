import { useState, useEffect, useRef, useMemo } from "react";
import css from "./styles";
import DATA from "./data/regions";
import FESTIVALS from "./data/festivals";
import { FONT, DOCS_URL, VOTE_OPTIONS } from "./data/constants";
import { vKey, cKey, itinKey, tripDatesKey, load, save } from "./utils/storage";
import { fmtMins, heDate, heDay, fmtDateHe } from "./utils/helpers";
import ExploreTab from "./components/ExploreTab";
import PlanTab from "./components/PlanTab";
import FestivalsTab from "./components/FestivalsTab";
import MapTab from "./components/MapTab";
import AttractionModal from "./components/AttractionModal";
import KumanoKodo from "./components/KumanoKodo";

export default function App() {
  const [dark, setDark] = useState(false);
  const [activeRegion, setActiveRegion] = useState("intro");
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [openCard, setOpenCard] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [view, setView] = useState("explore");
  const [tagFilter, setTagFilter] = useState("הכל");
  const [fMonthFilter, setFMonthFilter] = useState("הכל");
  const [startDate, setStartDate] = useState("2025-07-01");
  const [endDate, setEndDate] = useState("2025-07-27");
  const [itin, setItin] = useState<Record<string, any[]>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [dayOverrides, setDayOverrides] = useState<Record<string, number>>({});
  const dragItem = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const av: Record<string, string> = {};
      const ac: Record<string, any[]> = {};
      for (const [rid, rd] of Object.entries(DATA)) {
        for (const area of (rd as any).areas) {
          for (const att of area.attractions) {
            const v = await load(vKey(rid, area.nameEn, att.nameEn));
            if (v !== null) av[vKey(rid, area.nameEn, att.nameEn)] = v;
            const c = await load(cKey(rid, area.nameEn, att.nameEn));
            if (c) ac[cKey(rid, area.nameEn, att.nameEn)] = c;
          }
        }
      }
      const saved = await load(itinKey);
      const td = await load(tripDatesKey);
      setVotes(av);
      setComments(ac);
      if (saved) setItin(saved);
      if (td) { setStartDate(td.start); setEndDate(td.end); }
    })();
  }, []);

  const saveItin = async (updated: Record<string, any[]>) => { setItin(updated); await save(itinKey, updated); };
  const saveTripDates = async (s: string, e: string) => { await save(tripDatesKey, { start: s, end: e }); };

  const castVote = async (rid: string, aen: string, attn: string, emoji: string) => {
    const k = vKey(rid, aen, attn);
    const nv = votes[k] === emoji ? null : emoji;
    const u = { ...votes };
    if (nv === null) delete u[k]; else u[k] = nv;
    setVotes(u);
    await save(k, nv);
  };

  const addComment = async (rid: string, aen: string, attn: string) => {
    if (!newComment.trim()) return;
    const ck = cKey(rid, aen, attn);
    const u = [...(comments[ck] || []), { text: newComment.trim(), ts: Date.now() }];
    setComments({ ...comments, [ck]: u });
    await save(ck, u);
    setNewComment("");
  };

  const dateList = useMemo(() => {
    if (!startDate || !endDate) return [];
    const list: string[] = [];
    let d = new Date(startDate);
    const e = new Date(endDate);
    while (d <= e) { list.push(d.toISOString().slice(0, 10)); d = new Date(d.getTime() + 86400000); }
    return list;
  }, [startDate, endDate]);

  const favPool = useMemo(() => {
    const items: any[] = [];
    for (const [rid, rd] of Object.entries(DATA)) {
      for (const area of (rd as any).areas) {
        for (const att of area.attractions) {
          const k = vKey(rid, area.nameEn, att.nameEn);
          if (votes[k] === "✅") {
            const id = `${rid}|${area.nameEn}|${att.nameEn}`;
            const placed = Object.values(itin).some(day => day.some((x: any) => x.id === id));
            if (!placed) {
              const defaultDays = att.multiDay ? (dayOverrides[id] ?? att.defaultDays ?? 1) : 1;
              items.push({ id, nameHe: att.nameHe, nameEn: att.nameEn, region: rid, lat: att.lat, lng: att.lng, multiDay: att.multiDay, defaultDays, tags: att.tags || [] });
            }
          }
        }
      }
    }
    return items;
  }, [votes, itin, dayOverrides]);

  const festivalsInRange = useMemo(() => {
    if (!startDate || !endDate) return [];
    const s = new Date(startDate), e = new Date(endDate);
    return FESTIVALS.filter((f: any) => {
      const fs = new Date(2025, f.month - 1, f.day);
      const fe = new Date(2025, f.month - 1, f.endDay);
      return fs <= e && fe >= s;
    }).sort((a: any, b: any) => a.month - b.month || a.day - b.day);
  }, [startDate, endDate]);

  const totalMust = Object.values(votes).filter(v => v === "✅").length;
  const totalMaybe = Object.values(votes).filter(v => v === "❓").length;

  const onDragStart = (item: any, fromDate: string) => { dragItem.current = { item, fromDate }; };
  const onDragOver = (e: any, date: string) => { e.preventDefault(); setDragOver(date); };
  const onDragLeave = () => setDragOver(null);
  const onDrop = (e: any, toDate: string) => {
    e.preventDefault();
    setDragOver(null);
    if (!dragItem.current) return;
    const { item, fromDate } = dragItem.current;
    const u = { ...itin };
    if (fromDate && fromDate !== "pool") {
      if (item.multiDay) { Object.keys(u).forEach(d => { u[d] = (u[d] || []).filter((x: any) => x.id !== item.id); }); }
      else { u[fromDate] = (u[fromDate] || []).filter((x: any) => x.id !== item.id); }
    }
    const toIdx = dateList.indexOf(toDate);
    const days = item.multiDay ? item.defaultDays : 1;
    for (let i = 0; i < days && toIdx + i < dateList.length; i++) {
      const d = dateList[toIdx + i];
      if (!u[d]) u[d] = [];
      if (!u[d].some((x: any) => x.id === item.id)) u[d] = [...u[d], { ...item }];
    }
    saveItin(u);
    dragItem.current = null;
  };
  const removeFromDay = (date: string, id: string) => {
    const item = (itin[date] || []).find((x: any) => x.id === id);
    if (item?.multiDay) { const u = { ...itin }; Object.keys(u).forEach(d => { u[d] = (u[d] || []).filter((x: any) => x.id !== id); }); saveItin(u); }
    else saveItin({ ...itin, [date]: (itin[date] || []).filter((x: any) => x.id !== id) });
  };

  return (
    <div className="jp-app" style={{ padding: "1.5rem 1rem", ...(dark ? { background: "#111", color: "#eee" } : {}) }}>
      <style>{css}</style>

      <div style={{ position: "fixed", top: 8, left: 8, zIndex: 1000, display: "flex", gap: 6, alignItems: "center" }}>
        <button className="jp-dark-btn" onClick={() => setDark(d => !d)}>{dark ? "☀️" : "🌙"}</button>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)", background: dark ? "#222" : "var(--color-background-secondary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: 20, padding: "4px 10px" }}>✅{totalMust} ❓{totalMaybe}</span>
      </div>

      <h1 className="jp-title">🗾 יפן 2025</h1>
      <p className="jp-subtitle">מתכנן הטיול האינטראקטיבי</p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: "1rem", flexWrap: "wrap" }}>
        <nav className="jp-nav">
          {[
            { id: "explore", label: "🗺 חקרו" },
            { id: "organize", label: "📅 תכנן" },
            { id: "festivals", label: "🎏 פסטיבלים" },
            { id: "map", label: "📍 מפה" },
            { id: "kumano", label: "🌲 קומנו קודו" },
          ].map(({ id, label }) => (
            <button key={id} className={`jp-nav-btn${view === id ? " active" : ""}`} onClick={() => setView(id)}>{label}</button>
          ))}
        </nav>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <a href={DOCS_URL} target="_blank" rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", fontSize: 12, fontFamily: FONT, color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: 500 }}>
          📄 Google Docs ↗
        </a>
      </div>

      {view === "explore" && (
        <ExploreTab
          dark={dark}
          activeRegion={activeRegion}
          setActiveRegion={setActiveRegion}
          tagFilter={tagFilter}
          setTagFilter={setTagFilter}
          votes={votes}
          comments={comments}
          castVote={castVote}
          setOpenCard={setOpenCard}
        />
      )}

      {view === "organize" && (
        <PlanTab
          dark={dark}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          saveTripDates={saveTripDates}
          dateList={dateList}
          itin={itin}
          favPool={favPool}
          festivalsInRange={festivalsInRange}
          fmtDateHe={fmtDateHe}
          heDate={heDate}
          heDay={heDay}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragLeave={onDragLeave}
          removeFromDay={removeFromDay}
          dragOver={dragOver}
          dayOverrides={dayOverrides}
          setDayOverride={(id: string, n: number) => setDayOverrides(prev => ({ ...prev, [id]: n }))}
        />
      )}

      {view === "festivals" && (
        <FestivalsTab
          dark={dark}
          startDate={startDate}
          endDate={endDate}
          fMonthFilter={fMonthFilter}
          setFMonthFilter={setFMonthFilter}
          festivalsInRange={festivalsInRange}
          fmtDateHe={fmtDateHe}
        />
      )}

      {view === "map" && (
        <MapTab
          dark={dark}
          activeRegion={activeRegion}
          setActiveRegion={setActiveRegion}
          votes={votes}
        />
      )}

      {view === "kumano" && (
        <KumanoKodo onBack={() => setView("explore")} />
      )}

      <AttractionModal
        dark={dark}
        openCard={openCard}
        votes={votes}
        comments={comments}
        newComment={newComment}
        setNewComment={setNewComment}
        castVote={castVote}
        addComment={addComment}
        setOpenCard={setOpenCard}
        setView={setView}
      />
    </div>
  );
}
