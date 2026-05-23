import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Heebo', sans-serif; }
  .kk { font-family: 'Heebo', sans-serif; direction: rtl; color: var(--color-text-primary); max-width: 860px; margin: 0 auto; padding: 1.5rem 1rem; }
  .kk-hero { background: linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%); border-radius: 18px; padding: 2rem 2rem 1.5rem; margin-bottom: 1.5rem; color: white; position: relative; overflow: hidden; }
  .kk-hero::before { content: "🌲"; position: absolute; left: -10px; bottom: -20px; font-size: 120px; opacity: 0.12; }
  .kk-hero-tag { display: inline-block; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); border-radius: 20px; padding: 3px 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 10px; }
  .kk-hero h1 { font-size: 30px; font-weight: 300; margin-bottom: 6px; letter-spacing: -0.02em; }
  .kk-hero h2 { font-size: 14px; font-weight: 400; opacity: 0.75; margin-bottom: 14px; }
  .kk-hero p { font-size: 14px; line-height: 1.75; opacity: 0.9; max-width: 600px; }
  .kk-stats { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
  .kk-stat { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 10px; padding: 8px 14px; font-size: 12px; }
  .kk-stat strong { display: block; font-size: 18px; font-weight: 600; }
  .kk-nav { display: flex; gap: 4px; background: var(--color-background-secondary); border-radius: 28px; padding: 4px; border: 0.5px solid var(--color-border-tertiary); margin-bottom: 1.5rem; width: fit-content; }
  .kk-nav-btn { padding: 7px 18px; border-radius: 22px; border: none; background: transparent; cursor: pointer; font-size: 13px; font-family: 'Heebo', sans-serif; font-weight: 400; color: var(--color-text-secondary); transition: all 0.18s; }
  .kk-nav-btn.active { background: var(--color-background-primary); color: var(--color-text-primary); font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
  .kk-section-title { font-size: 18px; font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
  .kk-day { border: 0.5px solid var(--color-border-tertiary); border-radius: 14px; overflow: hidden; margin-bottom: 10px; }
  .kk-day-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; background: var(--color-background-secondary); user-select: none; transition: background 0.15s; }
  .kk-day-header:hover { background: var(--color-background-primary); }
  .kk-day-num { width: 32px; height: 32px; border-radius: 50%; background: #166534; color: white; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .kk-day-body { padding: 16px; border-top: 0.5px solid var(--color-border-tertiary); background: var(--color-background-primary); }
  .kk-route-line { display: flex; align-items: center; gap: 8px; font-size: 14px; margin-bottom: 12px; flex-wrap: wrap; }
  .kk-place { background: #DCFCE7; color: #14532D; border: 1px solid #16A34A44; border-radius: 8px; padding: 4px 12px; font-size: 13px; font-weight: 600; }
  .kk-arrow { color: var(--color-text-secondary); font-size: 16px; }
  .kk-dist { background: #DBEAFE; color: #1E40AF; border-radius: 20px; padding: 3px 10px; font-size: 12px; font-weight: 500; }
  .kk-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
  .kk-info-box { background: var(--color-background-secondary); border-radius: 10px; padding: 10px 14px; }
  .kk-info-label { font-size: 11px; color: var(--color-text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
  .kk-info-value { font-size: 13px; line-height: 1.6; }
  .kk-highlight { background: #FEF9C3; border: 1px solid #FDE047; border-radius: 8px; padding: 10px 14px; font-size: 13px; line-height: 1.6; margin-top: 10px; }
  .kk-alt { background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 10px; padding: 14px 16px; margin-top: 10px; }
  .kk-alt-title { font-size: 13px; font-weight: 600; color: #9A3412; margin-bottom: 6px; }
  .kk-link { color: #2563EB; text-decoration: none; font-size: 12px; }
  .kk-link:hover { text-decoration: underline; }
  .kk-sleep-card { background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; border-right: 3px solid #16A34A; }
  .kk-sleep-name { font-size: 15px; font-weight: 600; margin-bottom: 3px; }
  .kk-sleep-type { font-size: 11px; color: #16A34A; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
  .kk-sleep-desc { font-size: 13px; color: var(--color-text-secondary); line-height: 1.65; }
  .kk-badge { display: inline-block; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 600; margin-left: 6px; }
  .kk-tip { display: flex; gap: 10px; align-items: flex-start; background: var(--color-background-secondary); border-radius: 10px; padding: 12px 14px; margin-bottom: 8px; }
  .kk-tip-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .kk-tip-text { font-size: 13px; line-height: 1.65; }
  .kk-shrine-card { border: 0.5px solid var(--color-border-tertiary); border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; }
  .kk-shrine-card h3 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
  .kk-shrine-card p { font-size: 13px; color: var(--color-text-secondary); line-height: 1.65; }
  .kk-map-btn { display: inline-flex; align-items: center; gap: 5px; background: var(--color-background-secondary); border: 0.5px solid var(--color-border-secondary); border-radius: 8px; padding: 4px 10px; font-size: 12px; color: var(--color-text-secondary); text-decoration: none; margin-top: 8px; font-family: 'Heebo', sans-serif; }
  .kk-toggle { display: flex; gap: 6px; margin-bottom: 1rem; flex-wrap: wrap; }
  .kk-toggle-btn { padding: 5px 14px; border-radius: 20px; border: 1px solid var(--color-border-tertiary); background: transparent; cursor: pointer; font-size: 12px; font-family: 'Heebo', sans-serif; color: var(--color-text-secondary); transition: all 0.15s; }
  .kk-toggle-btn.active { background: #DCFCE7; border-color: #16A34A; color: #14532D; font-weight: 600; }
  .kk-overview-map { background: var(--color-background-secondary); border-radius: 14px; padding: 16px; margin-bottom: 1.5rem; }
  .kk-path-svg { width: 100%; }
`;

const DAYS = [
  {
    day: 1,
    from: "Takijiri-oji",
    to: "Tsugizakura-oji",
    km: 17,
    hours: "6–7 שעות",
    difficulty: "בינוני",
    diffColor: "#FEF3C7",
    diffText: "#92400E",
    sleep: "Tsugizakura-oji / Chikatsuyu-oji",
    desc: "התחלה רשמית של הטרק. הגעה מתנאבה (40 דקות אוטובוס) לנקודת ההתחלה Takijiri-oji. עלייה מדורגת ביער ברוש עתיק, מעבר ב-oji (קודש קטן) רבים לאורך הדרך.",
    highlights: ["כניסה לאזור המורשת ביער העתיק", "נקודות תצפית לאורך השביל", "כמה ojis (מקדשונות קטנים) לאורך הדרך"],
    notes: "אוטובוס מתנאבה לTakijiri: 40 דקות. לינה בצ'יקאטסויה היא נקודת עצירה מומלצת לפני היום הכבד הבא.",
    link: "https://www.tb-kumano.jp/en/kumano-kodo/nakahechi/takijiri-oji-to-tsugizakura-oji/",
    alt: null,
    latlng: [33.886, 135.575],
  },
  {
    day: 2,
    from: "Tsugizakura-oji",
    to: "Kumano Hongu Taisha",
    km: 21,
    hours: "7–8 שעות",
    difficulty: "קשה",
    diffColor: "#FEE2E2",
    diffText: "#991B1B",
    sleep: "Yunomine Onsen או Kawayu Onsen",
    desc: "היום הארוך והמאתגר ביותר — עלייה לגובה ואז ירידה להונגו טאישה. אפשר לפרק ליומיים עם לינה ב-Hosshinmon-oji (13 ק\"מ ביום הראשון + 8 ק\"מ ביום השני).",
    highlights: ["מקדש Kumano Hongu Taisha — המרכזי שבשלושת הגדולים", "שער הטוריי הגדול ביותר בעולם — Oyunohara", "ירידה דרמטית בצד ההר אל הנהר"],
    notes: "מומלץ ביותר לפרק ליומיים! הירידה מ-Hosshinmon-oji להונגו נמשכת ~7 ק\"מ ושעתיים. מ-Hongu אפשר לנסוע 2 ק\"מ לאונסן Yunomine — אחד הוותיקים ביפן.",
    link: "https://www.tb-kumano.jp/en/kumano-kodo/nakahechi/tsugizakura-oji-to-kumano-hongu-taisha/",
    alt: {
      title: "חלופה מהחלק הזה: שיט במורד הנהר",
      desc: "מ-Ukegawa אפשר לשוט במורד נהר הקומנו-גאווה בסירה מסורתית (שעה וחצי) עד Kumano Hayatama Taisha. בדרך — גורג' Dorokyo עמוק ויפה מוקף יערות."
    },
    latlng: [33.839, 135.788],
  },
  {
    day: 3,
    from: "Ukegawa",
    to: "Koguchi",
    km: 13,
    hours: "4–5 שעות",
    difficulty: "בינוני",
    diffColor: "#FEF3C7",
    diffText: "#92400E",
    sleep: "Koguchi (כפר קטן, הזמינו מראש!)",
    desc: "מסלול Kogumotori-goe — עלייה בהרים מיוערים עם נוף נהדר. ההתחלה ב-Ukegawa — אפשר להגיע ברגל מהונגו (~שעה) או באוטובוס.",
    highlights: ["נוף לנהר קומנו ולהרים", "יער ברוש וארז עתיק", "כפר Koguchi — שקט ומבודד"],
    notes: "שימו לב שההתחלה היא לא בדיוק בסוף היום הקודם — יש לתכנן את המעבר ל-Ukegawa מראש.",
    link: "https://www.tb-kumano.jp/en/kumano-kodo/nakahechi/kogumotori-goe/",
    alt: null,
    latlng: [33.799, 135.842],
  },
  {
    day: 4,
    from: "Koguchi",
    to: "Kumano Nachi Taisha",
    km: 14,
    hours: "5–6 שעות",
    difficulty: "בינוני-קשה",
    diffColor: "#FEE2E2",
    diffText: "#991B1B",
    sleep: "Nachi / Katsuura (עיר חוף)",
    desc: "המסלול Ogumotori-goe — עלייה לגובה ואז ירידה אל מפל נאצ'י ומקדש נאצ'י טאישה. אחד הסיומים הדרמטיים ביותר לכל טרק בעולם — מגיעים פנים אל פנים עם המפל הגבוה ביפן (133 מ') ומקדש שינטו עתיק.",
    highlights: ["מפל נאצ'י (133 מ') — המפל הגבוה ביפן", "מקדש Kumano Nachi Taisha + מקדש Seigantoji", "ירידה במדרגות עתיקות Daimon-zaka"],
    notes: "הירידה מהמסלול למקדש נאצ'י דרך Daimon-zaka היא 1 ק\"מ בלבד. ב-7 בבוקר בנאצ'י יש שוק דגים עם מכירות טונה פתוחות!",
    link: "https://www.tb-kumano.jp/en/kumano-kodo/nakahechi/ogumotori-goe/",
    alt: null,
    latlng: [33.668, 135.893],
  },
  {
    day: 5,
    from: "Nachi",
    to: "Kumano Hayatama Taisha (Shingu)",
    km: null,
    hours: "אוטובוס / רכבת",
    difficulty: "נסיעה",
    diffColor: "#DBEAFE",
    diffText: "#1E40AF",
    sleep: "Shingu או חזרה לאוסקה",
    desc: "יום האחרון — ביקור במקדש הגדול השלישי Kumano Hayatama Taisha בשינגו, ואז נסיעה לאוסקה (כ-3 שעות). אפשר לבדוק גם את מקדש Kamikura-jinja על צלע הצוק ואת פארק Jofuku.",
    highlights: ["Kumano Hayatama Taisha — המקדש השלישי", "מקדש Kamikura-jinja על צוק", "שוק הדגים של נאצ'י בבוקר מוקדם"],
    notes: "אוטובוס מנאצ'י לשינגו: כ-30 דקות. מסיים את מעגל שלושת מקדשי הקומנו סאנזאן.",
    link: "https://www.tb-kumano.jp/en/kumano-kodo/nakahechi/daimon-zaka/",
    alt: null,
    latlng: [33.726, 135.986],
  },
];

const SLEEPS = [
  { name: "Minshuku / Ryokan לאורך השביל", type: "לינה מסורתית", price: "¥8,000–25,000 (~200–620 ₪)", desc: "בתי אירוח קטנים ומשפחתיים המציעים ארוחות, מרחץ משותף ולעיתים אונסן. האווירה האוהנטית ביותר. מגיע ב-2 ארוחות.", booking: "2 חודשים מראש!", badge: "מומלץ!" },
  { name: "Yunomine Onsen", type: "כפר אונסן עתיק", price: "¥10,000–20,000 (~250–500 ₪)", desc: "אחד האונסנים הוותיקים ביפן. הנהר עצמו מחומם. יש בריכה ציבורית קטנה בנהר בחינם. קסום ומיוחד.", booking: "מאוד מבוקש", badge: "חוויה מיוחדת!" },
  { name: "Kawayu Onsen", type: "אונסן ציבורי על נהר", price: "¥6,000–15,000 (~150–380 ₪)", desc: "כפר שבו הנהר עצמו מים תרמיים. בחורף חופרים בריכת ענק בחוף הנהר. יותר קסום ופחות תיירותי מיונומינה.", booking: "פחות עמוס", badge: "" },
  { name: "Shukubo (לינה במקדש)", type: "מקדש קויאסן", price: "¥14,000–20,000 (~350–500 ₪)", desc: "לינה בבית מקדש בקויאסן — ארוחות נזירים צמחוניות (שוג'ין ריורי), תפילת בוקר, גנים. חוויה שאי אפשר למצוא בשום מקום אחר בעולם.", booking: "הזמינו מוקדם", badge: "אייקוני!" },
  { name: "Koguchi Guest House", type: "כפר מבודד", price: "¥5,000–8,000 (~125–200 ₪)", desc: "הכפר הקטן ב-Koguchi עם מקומות לינה מוגבלים מאוד. אוהנטי, שקט, ללא וויפי כנראה. הזמינו מוקדם מאוד.", booking: "חובה להזמין מראש!", badge: "" },
  { name: "Katsuura / Shingu", type: "עיר חוף / בסיס", price: "¥6,000–12,000 (~150–300 ₪)", desc: "ערים עם בתי מלון רגילים — טוב כבסיס לתחילה/סיום הטרק. פחות אטמוספרי אך נוח לוגיסטית.", booking: "גמיש", badge: "" },
];

const SHRINES = [
  { name: "Kumano Hongu Taisha", he: "קומנו הונגו טאישה", desc: "המרכזי שבשלושת המקדשים. מוקם על גבעה ביער. ב-Oyunohara הסמוכה — שער הטוריי הגדול ביותר בעולם (34 מ'). שרוף ב-1889 ובנוי מחדש.", lat: 33.8394, lng: 135.7882 },
  { name: "Kumano Nachi Taisha", he: "קומנו נאצ'י טאישה", desc: "מקדש ושלבי מדרגות אדומות לצד מפל נאצ'י — אחד הנופים הסמליים ביותר ביפן. לצידו מקדש בודהיסטי Seigantoji.", lat: 33.668, lng: 135.893 },
  { name: "Kumano Hayatama Taisha", he: "קומנו היאטאמה טאישה", desc: "המקדש השלישי, בשינגו. ידוע בסלע קדוש Gotobiki-iwa שעליו בנוי המקדש Kamikura-jinja בצמוד.", lat: 33.726, lng: 135.986 },
  { name: "Koyasan", he: "הר קויאסן", desc: "לא על המסלול הישיר — נסיעה נפרדת. מרכז הבודהיזם השינגון עם מאוזוליאום קובו דאישי. לינת שוקובו.", lat: 34.2129, lng: 135.5861 },
];

const TIPS = [
  { icon: "📅", text: "הזמינו לינה 2 חודשים מראש — מקומות מתמלאים מהר, במיוחד Yunomine Onsen ו-Koguchi." },
  { icon: "👟", text: "נעליים טובות הכרחיות — השביל כולל קטעי חימר רטוב, שורשים וסלעים. הביאו גרביים עמידות למים." },
  { icon: "💧", text: "מים: מלאו בכל כפר. בחלקים מהשביל אין מים כ-3-4 שעות." },
  { icon: "🌧️", text: "בקיץ — חם ולח מאוד. צאו מוקדם (07:00-08:00) לפני השמש. קרם הגנה חובה." },
  { icon: "🎒", text: "אפשר לשלוח את תיק הגב הגדול ישירות לבית המלון הבא בשירות takkyubin (1,000-2,000 ין). ספרו את צורכיכם לבית האירוח." },
  { icon: "📱", text: "הורידו מפות אופליין — אין קליטה בחלקים מהשביל. האפליקציה הרשמית: KumanoKodo app." },
  { icon: "🚌", text: "רכבת לתנאבה (Kii-Tanabe Station) כ-3 שעות מאוסקה (JR Pass מכסה). אוטובוס מתנאבה לTakijiri: 40 דקות." },
  { icon: "💰", text: "לינה: 2,500–25,000 ין ללילה. תקציב יומי כולל אוכל: 15,000–25,000 ין (~380–630 ₪)." },
];

export default function App() {
  const [tab, setTab] = useState("route");
  const [openDay, setOpenDay] = useState(0);
  const [days, setDays] = useState(4);

  const filtered = days === 4
    ? DAYS
    : days === 5
      ? DAYS
      : DAYS.slice(0, 3);

  const [dark, setDark] = useState(false);
  const DOCS_URL = "https://docs.google.com/document/d/10T-KQ1i6Ypr6YOM8xlu2-XOGvkZ7Uq97xIYct-UiRGQ/edit";
  const PLANNER_URL = "https://claude.site/artifacts/japan-trip-site";

  return (
    <div className="kk" style={dark ? { background: "#111", color: "#eee" } : {}}>
      <style>{css}</style>

      <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <a href={PLANNER_URL} target="_blank" rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, border: "0.5px solid #3B82F6", background: "#EFF6FF", fontSize: 12, fontFamily: "'Heebo',sans-serif", color: "#1E40AF", textDecoration: "none", fontWeight: 500 }}>
          ← מתכנן הטיול הראשי
        </a>
        <a href={DOCS_URL} target="_blank" rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", fontSize: 12, fontFamily: "'Heebo',sans-serif", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: 500 }}>
          📄 Google Docs ↗
        </a>
        <button onClick={() => setDark(d => !d)}
          style={{ marginRight: "auto", padding: "6px 14px", borderRadius: 20, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", fontSize: 12, fontFamily: "'Heebo',sans-serif", color: "var(--color-text-secondary)" }}>
          {dark ? "☀️ בהיר" : "🌙 כהה"}
        </button>
      </div>

      <div className="kk-hero">
        <div className="kk-hero-tag">🏔 מורשת עולמית UNESCO</div>
        <h1>טרק קומנו קודו</h1>
        <h2>Kumano Kodo — Nakahechi Route · ווקיאמה, יפן</h2>
        <p>
          רשת שבילי עלייה לרגל מתקופת הייאן — אחד מ-2 מסלולים בעולם שהוכרזו כמורשת עולמית (יחד עם ה-Camino de Santiago). קיסרים נסעו מקיוטו לכאן להתעלות רוחנית. הסמל: עורב עם 3 רגליים — גם הסמל של נבחרת הכדורגל היפנית.
        </p>
        <div className="kk-stats">
          <div className="kk-stat"><strong>~70 ק"מ</strong>המסלול הראשי</div>
          <div className="kk-stat"><strong>4–5 ימים</strong>משך מומלץ</div>
          <div className="kk-stat"><strong>3 מקדשים</strong>קומנו סאנזאן</div>
          <div className="kk-stat"><strong>מרץ–נובמבר</strong>עונה מומלצת</div>
          <div className="kk-stat"><strong>מאוד לח</strong>בקיץ (יולי)</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem", flexWrap: "wrap" }}>        <nav className="kk-nav">
          {[
            { id: "route", label: "🗺 מסלול יום-יום" },
            { id: "sleep", label: "🛏 לינה" },
            { id: "shrines", label: "⛩ המקדשים" },
            { id: "tips", label: "💡 טיפים" },
          ].map(({ id, label }) => (
            <button key={id} className={`kk-nav-btn${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </nav>
      </div>

      {tab === "route" && (
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 8 }}>בחרו מספר ימים:</div>
            <div className="kk-toggle">
              {[3, 4, 5].map(n => (
                <button key={n} className={`kk-toggle-btn${days === n ? " active" : ""}`} onClick={() => setDays(n)}>
                  {n} ימים {n === 4 ? "(מומלץ)" : n === 5 ? "(נינוח)" : "(מינימום)"}
                </button>
              ))}
            </div>
          </div>

          {days === 3 && (
            <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "12px 16px", marginBottom: "1rem", fontSize: 13, color: "#9A3412", lineHeight: 1.7 }}>
              ⚠️ 3 ימים אפשרי אך לא מומלץ — יום 2 הוא 21 ק"מ קשה. שקלו לפחות 4 ימים לחוויה נוחה יותר.
            </div>
          )}

          <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: "12px 16px", marginBottom: "1.25rem", fontSize: 13, lineHeight: 1.7 }}>
            <strong>מסלול Nakahechi</strong> — המסלול הראשי והשמור ביותר. מתחיל ב-Takijiri-oji (מחוץ לתנאבה) ומסתיים ב-Nachi / Shingu. 
            <span style={{ color: "var(--color-text-secondary)" }}> ניתן גם לעשות רק את הקטע המרכזי (Takijiri → Hongu, 38 ק"מ, 2-3 ימים) לחוויה קצרה יותר.</span>
          </div>

          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <svg viewBox="0 0 700 80" className="kk-path-svg" style={{ display: "block" }}>
              <defs>
                <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#16A34A" />
                </marker>
              </defs>
              <line x1="60" y1="40" x2="620" y2="40" stroke="#16A34A" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#arr)" />
              {["Takijiri\noji", "Tsugizakura\noji", "Hongu\nTaisha", "Koguchi", "Nachi\nTaisha", "Shingu"].map((label, i) => {
                const x = 60 + i * 112;
                return (
                  <g key={i}>
                    <circle cx={x} cy={40} r={10} fill={i === 0 || i === 5 ? "#15803D" : "#DCFCE7"} stroke="#16A34A" strokeWidth="1.5" />
                    <text x={x} y={38} textAnchor="middle" fontSize="7.5" fill={i === 0 || i === 5 ? "white" : "#14532D"} fontWeight="700" fontFamily="Heebo,Arial">{i + 1}</text>
                    {label.split("\n").map((l, j) => (
                      <text key={j} x={x} y={60 + j * 10} textAnchor="middle" fontSize="8.5" fill="#374151" fontFamily="Heebo,Arial">{l}</text>
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>

          {DAYS.map((d, i) => (
            <div key={i} className="kk-day">
              <div className="kk-day-header" onClick={() => setOpenDay(openDay === i ? -1 : i)}>
                <div className="kk-day-num">{d.day}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {d.from} → {d.to}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {d.km && <span>🚶 {d.km} ק"מ</span>}
                    <span>⏱ {d.hours}</span>
                    <span className="kk-badge" style={{ background: d.diffColor, color: d.diffText }}>{d.difficulty}</span>
                  </div>
                </div>
                <div style={{ fontSize: 18, color: "var(--color-text-secondary)" }}>{openDay === i ? "▲" : "▼"}</div>
              </div>

              {openDay === i && (
                <div className="kk-day-body">
                  <p style={{ fontSize: 14, lineHeight: 1.75, marginBottom: 12 }}>{d.desc}</p>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>נקודות שיא</div>
                    {d.highlights.map((h, j) => (
                      <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5 }}>
                        <span style={{ color: "#16A34A", fontWeight: 700, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 13, lineHeight: 1.6 }}>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="kk-info-grid">
                    <div className="kk-info-box">
                      <div className="kk-info-label">לינה מומלצת</div>
                      <div className="kk-info-value">{d.sleep}</div>
                    </div>
                    <div className="kk-info-box">
                      <div className="kk-info-label">הערות לוגיסטיות</div>
                      <div className="kk-info-value">{d.notes}</div>
                    </div>
                  </div>

                  {d.alt && (
                    <div className="kk-alt">
                      <div className="kk-alt-title">🚣 חלופה: {d.alt.title}</div>
                      <div style={{ fontSize: 13, lineHeight: 1.65 }}>{d.alt.desc}</div>
                    </div>
                  )}

                  <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <a href={d.link} target="_blank" rel="noreferrer" className="kk-map-btn">📖 מדריך מפורט ↗</a>
                    {d.latlng && (
                      <a href={`https://maps.google.com/maps?q=${d.latlng[0]},${d.latlng[1]}&z=13`} target="_blank" rel="noreferrer" className="kk-map-btn">📍 פתח במפה ↗</a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div style={{ background: "#DCFCE7", border: "1px solid #16A34A55", borderRadius: 12, padding: "14px 16px", marginTop: "1.25rem" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#14532D", marginBottom: 6 }}>🔗 משאבים רשמיים</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="https://www.tb-kumano.jp/en/kumano-kodo/nakahechi/" target="_blank" rel="noreferrer" className="kk-link">אתר הטרק הרשמי ↗</a>
              <a href="https://www.tb-kumano.jp/en/lodging/list/" target="_blank" rel="noreferrer" className="kk-link">רשימת מקומות לינה ↗</a>
              <a href="https://www2.tb-kumano.jp/en/transport/pdf/Tanabe-Shirahama-to-Hongu-bus.pdf" target="_blank" rel="noreferrer" className="kk-link">לוח אוטובוסים (PDF) ↗</a>
            </div>
          </div>
        </div>
      )}

      {tab === "sleep" && (
        <div>
          <div style={{ background: "#FEF3C7", border: "1px solid #FDE047", borderRadius: 10, padding: "12px 16px", marginBottom: "1.25rem", fontSize: 13, color: "#78350F", lineHeight: 1.7 }}>
            ⏰ <strong>הזמינו מוקדם!</strong> רוב מקומות הלינה מתמלאים כ-2 חודשים מראש, במיוחד בסוף שבוע ובעונת השיא (אוקטובר–נובמבר). קיץ (יולי–אוגוסט) פחות עמוס אך חם מאוד.
          </div>
          {SLEEPS.map((s, i) => (
            <div key={i} className="kk-sleep-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6 }}>
                <div>
                  <div className="kk-sleep-name">{s.name}</div>
                  <div className="kk-sleep-type">{s.type}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {s.badge && <span style={{ background: "#DCFCE7", color: "#14532D", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8 }}>{s.badge}</span>}
                  <span style={{ background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", fontSize: 12, padding: "3px 10px", borderRadius: 8, color: "var(--color-text-secondary)" }}>{s.price}</span>
                </div>
              </div>
              <p className="kk-sleep-desc" style={{ marginTop: 8 }}>{s.desc}</p>
              {s.booking && <div style={{ marginTop: 6, fontSize: 11, color: "#B45309", fontWeight: 600 }}>📅 {s.booking}</div>}
            </div>
          ))}
          <a href="https://www.tb-kumano.jp/en/lodging/list/" target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#DCFCE7", border: "1px solid #16A34A", borderRadius: 10, padding: "8px 16px", fontSize: 13, color: "#14532D", textDecoration: "none", fontWeight: 600, marginTop: 8 }}>
            📋 רשימת לינה מלאה באתר הרשמי ↗
          </a>
        </div>
      )}

      {tab === "shrines" && (
        <div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--color-text-secondary)", marginBottom: "1.25rem" }}>
            מטרת הטרק היא ביקור בשלושת מקדשי <strong>קומנו סאנזאן</strong> — שמספקים ביחד "עלייה לרגל מושלמת". לכל מקדש אופי שונה.
          </p>
          {SHRINES.map((s, i) => (
            <div key={i} className="kk-shrine-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <h3>{s.he}</h3>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 1 }}>{s.name}</div>
                </div>
                {i < 3 && <span style={{ background: "#DCFCE7", color: "#14532D", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8 }}>מקדש {i + 1}/3</span>}
              </div>
              <p>{s.desc}</p>
              <a href={`https://maps.google.com/maps?q=${s.lat},${s.lng}&z=14`} target="_blank" rel="noreferrer" className="kk-map-btn">📍 פתח במפה ↗</a>
            </div>
          ))}
          <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: "14px 16px", marginTop: "0.5rem" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>אתרים קדושים נוספים בדרך</div>
            {[
              { name: "Yunomine Onsen", desc: "אחד האונסנים הוותיקים ביפן. הנהר עצמו מחומם. בריכת אבן קדושה Tsuboyu." },
              { name: "Oyunohara", desc: "אתר המקדש המקורי של Hongu Taisha — שטפון 1889 הרס אותו. שער הטוריי שנשאר הוא הגדול בעולם (34 מ')." },
              { name: "Koyasan (הר קויאסן)", desc: "לא על המסלול ישירות — דורש נסיעה נפרדת. מרכז הבודהיזם השינגון. לינה בשוקובו (בית מקדש) מומלצת ביותר." },
              { name: "Doro-kyo Gorge", desc: "גורג' עמוק ביותר שאפשר לשוט בו בסירה מסורתית — חלופה נהדרת ביום 3." },
            ].map((a, i) => (
              <div key={i} style={{ borderBottom: i < 3 ? "0.5px solid var(--color-border-tertiary)" : "none", paddingBottom: i < 3 ? 8 : 0, marginBottom: i < 3 ? 8 : 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2, lineHeight: 1.6 }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "tips" && (
        <div>
          <div style={{ background: "#DCFCE7", border: "1px solid #16A34A55", borderRadius: 12, padding: "14px 16px", marginBottom: "1.25rem" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#14532D", marginBottom: 6 }}>בקיץ (יולי): מה לדעת</div>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: "#14532D" }}>
              הקיץ ביפן — חם ולח מאוד. לאורך הטרק זה מוגבר בגלל יערות סגורים. צאו <strong>07:00-08:00</strong> לפני חום השיא. כמות מים: לפחות <strong>2-3 ליטר</strong> ביום. קרם הגנה + כובע. שומרי שביל רבים ביולי-אוגוסט. לא עונת השיא = פחות עמוס.
            </p>
          </div>
          {TIPS.map((t, i) => (
            <div key={i} className="kk-tip">
              <div className="kk-tip-icon">{t.icon}</div>
              <div className="kk-tip-text">{t.text}</div>
            </div>
          ))}
          <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: "14px 16px", marginTop: "0.5rem" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📦 מה לארוז</div>
            {["נעלי טיול עמידות למים", "גרביים מרינו + עוד זוג גרביים", "מקל הליכה (מומלץ לירידות)", "מעיל גשם קל (אפילו בקיץ)", "אוכל קל לאורך הדרך — אין חנויות בחלקים", "מזומן ¥20,000+ — חלק מהמקומות לא מקבלים כרטיס"].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5, fontSize: 13 }}>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
