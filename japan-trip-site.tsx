import { useState, useEffect, useRef, useMemo } from "react";

const FONT = "'Heebo','Segoe UI',Arial,sans-serif";
const DOCS_URL = "https://docs.google.com/document/d/10T-KQ1i6Ypr6YOM8xlu2-XOGvkZ7Uq97xIYct-UiRGQ/edit";
const KUMANO_URL = "https://claude.site/artifacts/ff2e9fe3-a9fe-4c28-8a2c-b58cdcee3ac0";

const TRAVEL = {
  "fuji:fuji":40,"alps:alps":50,"hokkaido:hokkaido":60,"tohoku:tohoku":45,
  "tokyo:tokyo":20,"kyoto:kyoto":25,"kansai:kansai":30,
  "tokyo:fuji":110,"tokyo:kyoto":140,"tokyo:kansai":150,"tokyo:alps":180,
  "tokyo:tohoku":90,"tokyo:hokkaido":90,
  "kyoto:kansai":30,"kyoto:fuji":150,"kyoto:alps":120,
  "kansai:fuji":160,"kansai:alps":130,
  "hokkaido:tohoku":120,
};
function travelTime(r1,r2){
  if(!r1||!r2)return null;
  const k=[r1,r2].sort().join(":");
  return TRAVEL[k]??null;
}
function fmtMins(m){
  if(!m)return null;
  if(m<60)return `${m} דק'`;
  const h=Math.floor(m/60),mn=m%60;
  return mn?`${h}ש' ${mn}דק'`:`${h} שעות`;
}

const TAGS={
  temple:{label:"מקדש",color:"#EDE9FE",border:"#7C3AED",text:"#4C1D95"},
  shrine:{label:"מקדש שינטו",color:"#D1FAE5",border:"#059669",text:"#064E3B"},
  nature:{label:"טבע",color:"#DCFCE7",border:"#16A34A",text:"#14532D"},
  history:{label:"היסטוריה",color:"#FEF3C7",border:"#D97706",text:"#78350F"},
  museum:{label:"מוזיאון",color:"#DBEAFE",border:"#2563EB",text:"#1E3A8A"},
  food:{label:"אוכל ושוק",color:"#FFE4E6",border:"#E11D48",text:"#881337"},
  park:{label:"פארק",color:"#DCFCE7",border:"#15803D",text:"#14532D"},
  entertainment:{label:"בידור",color:"#FCE7F3",border:"#DB2777",text:"#831843"},
  onsen:{label:"אונסן",color:"#E0F2FE",border:"#0284C7",text:"#0C4A6E"},
  castle:{label:"טירה",color:"#FEF9C3",border:"#CA8A04",text:"#713F12"},
  viewpoint:{label:"תצפית",color:"#FEE2E2",border:"#DC2626",text:"#7F1D1D"},
  hike:{label:"טיול רגלי",color:"#ECFDF5",border:"#047857",text:"#022C22"},
  art:{label:"אמנות",color:"#EDE9FE",border:"#6D28D9",text:"#2E1065"},
  nightlife:{label:"חיי לילה",color:"#FDF4FF",border:"#A21CAF",text:"#581C87"},
  garden:{label:"גן",color:"#F0FDF4",border:"#16A34A",text:"#14532D"},
};

const DATA={
  tokyo:{nameHe:"טוקיו",nameEn:"Tokyo",intro:"שילוב מדהים של מסורת ומודרניות — כל שכונה עולם בפני עצמה.",color:"#EFF6FF",border:"#3B82F6",textColor:"#1E40AF",areas:[
    {nameHe:"אסקוסה",nameEn:"Asakusa",desc:"רוח טוקיו הישנה מתקופת אדו.",attractions:[
      {nameHe:"מקדש סנסוג'י",nameEn:"Sensoji Temple",tags:["temple"],desc:"המקדש הבודהיסטי הוותיק ביותר בטוקיו.",lat:35.7148,lng:139.7967},
      {nameHe:"נאקאמיסא",nameEn:"Nakamise Street",tags:["food","history"],desc:"טיילת שוק עתיקה עם שער קמינאריימון.",lat:35.7134,lng:139.7966},
      {nameHe:"מגדל סקייטרי",nameEn:"Tokyo Skytree",tags:["viewpoint","entertainment"],desc:"המגדל הגבוה ביפן (634מ').",lat:35.7101,lng:139.8107},
      {nameHe:"נהר סומידה",nameEn:"Sumida River",tags:["nature"],desc:"הפלגה לפארק האמארייקו.",lat:35.7075,lng:139.8008},
    ]},
    {nameHe:"אואנו",nameEn:"Ueno",desc:"פארק גדול ומוזיאונים לאומיים.",attractions:[
      {nameHe:"פארק אואנו",nameEn:"Ueno Park",tags:["park","history"],desc:"שופע מוזיאונים ויפה בפריחה.",lat:35.7156,lng:139.7733},
      {nameHe:"המוזיאון הלאומי",nameEn:"Tokyo National Museum",tags:["museum","history"],desc:"הוותיק ביותר ביפן.",lat:35.7188,lng:139.7760},
      {nameHe:"אגם שינובאזו",nameEn:"Shinobazu Pond",tags:["nature","garden"],desc:"פרחי לוטוס באוגוסט.",lat:35.7124,lng:139.7713},
      {nameHe:"שוק אמיוקו",nameEn:"Ameyoko Market",tags:["food"],desc:"שוק הלילה הידוע.",lat:35.7082,lng:139.7740},
    ]},
    {nameHe:"האראג'וקו ושיבויה",nameEn:"Harajuku & Shibuya",desc:"אופנת רחוב ומקדש שקט ביער.",festivals:[{name:"Tanabata",dates:"4–6 ביולי"}],attractions:[
      {nameHe:"מקדש מייג'י",nameEn:"Meiji Jingu Shrine",tags:["shrine","park"],desc:"מקדש שינטו בפארק מיוער.",lat:35.6763,lng:139.6993},
      {nameHe:"מעבר החצייה שיבויה",nameEn:"Shibuya Crossing",tags:["entertainment","viewpoint"],desc:"המעבר העמוס בעולם.",lat:35.6595,lng:139.7004},
      {nameHe:"רחוב טאקשיטה",nameEn:"Takeshita Dori",tags:["entertainment","food"],desc:"אופנת הרג'וקו וקרפ צבעוני.",lat:35.6702,lng:139.7037},
      {nameHe:"שדרת אומוטסנדו",nameEn:"Omotesando",tags:["art","entertainment"],desc:"חנויות מעצבים ואדריכלות.",lat:35.6650,lng:139.7108},
    ]},
    {nameHe:"שינג'וקו",nameEn:"Shinjuku",desc:"מיקרוקוסמוס של טוקיו.",attractions:[
      {nameHe:"תצפית ממשלת טוקיו",nameEn:"Tokyo Gov. Building",tags:["viewpoint"],desc:"תצפית חינמית מקומה 45.",lat:35.6896,lng:139.6921},
      {nameHe:"פארק שינג'וקו גיואן",nameEn:"Shinjuku Gyoen",tags:["garden","park"],desc:"שלושה גנים בסגנונות שונים.",lat:35.6852,lng:139.7100},
      {nameHe:"גולדן גאי",nameEn:"Golden Gai",tags:["nightlife","history"],desc:"200+ ברים זעירים בסמטאות.",lat:35.6931,lng:139.7042},
      {nameHe:"אומויידה יוקוצ'ו",nameEn:"Omoide Yokocho",tags:["food","history"],desc:"סמטאות עם יקיטורי.",lat:35.6934,lng:139.7002},
    ]},
    {nameHe:"צוקיג'י ואודאיבה",nameEn:"Tsukiji & Odaiba",desc:"שוק דגים ואי מלאכותי.",attractions:[
      {nameHe:"שוק הדגים צוקיג'י",nameEn:"Tsukiji Market",tags:["food"],desc:"שוק הדגים הגדול — פעיל בבוקר.",lat:35.6655,lng:139.7707},
      {nameHe:"גן האמארייקו",nameEn:"Hamarikyu Gardens",tags:["garden","nature"],desc:"גן יפני עם בריכות.",lat:35.6598,lng:139.7624},
      {nameHe:"TeamLab Borderless",nameEn:"teamLab Borderless",tags:["art","entertainment"],desc:"מוזיאון דיגיטלי אינטראקטיבי.",lat:35.6251,lng:139.7750},
      {nameHe:"אונסן אואדו",nameEn:"Oedo Onsen",tags:["onsen","entertainment"],desc:"פארק ספא בסגנון אדו.",lat:35.6227,lng:139.7805},
    ]},
  ]},
  kyoto:{nameHe:"קיוטו",nameEn:"Kyoto",intro:"הבירה התרבותית של יפן — אלפי מבנים היסטוריים.",color:"#ECFDF5",border:"#10B981",textColor:"#064E3B",areas:[
    {nameHe:"מרכז קיוטו",nameEn:"Central Kyoto",desc:"טירות, ארמונות ושווקים.",festivals:[{name:"Gion Matsuri",dates:"כל יולי, שיא 17/7"}],attractions:[
      {nameHe:"טירת ניג'ו",nameEn:"Nijo Castle",tags:["castle","history"],desc:"מעון השוגון מ-1603.",lat:35.0142,lng:135.7481},
      {nameHe:"הארמון הקיסרי",nameEn:"Kyoto Imperial Palace",tags:["history","garden"],desc:"מגורי הקיסר עד 1868.",lat:35.0252,lng:135.7622},
      {nameHe:"שוק ניישיקי",nameEn:"Nishiki Market",tags:["food"],desc:"המטבח של קיוטו.",lat:35.0050,lng:135.7647},
      {nameHe:"פונטוצ'ו",nameEn:"Pontocho",tags:["food","nightlife"],desc:"סמטה אטמוספרית בערב.",lat:35.0082,lng:135.7701},
    ]},
    {nameHe:"מזרח קיוטו",nameEn:"Eastern Kyoto",desc:"רבע ההיגאשיאמה ההיסטורי.",attractions:[
      {nameHe:"מקדש קיומיזו-דרה",nameEn:"Kiyomizudera",tags:["temple","viewpoint"],desc:"במה ענקית ללא מסמר.",lat:34.9949,lng:135.7851},
      {nameHe:"רובע היגאשיאמה",nameEn:"Higashiyama",tags:["history","art"],desc:"שבילים מרוצפי אבן.",lat:35.0015,lng:135.7800},
      {nameHe:"מקדש גינקאקוג'י",nameEn:"Ginkakuji",tags:["temple","garden"],desc:"ביתן הכסף מ-1482.",lat:35.0271,lng:135.7982},
      {nameHe:"מקדש ננזנג'י",nameEn:"Nanzenji",tags:["temple","history"],desc:"מקדש זן עם אקוודוקט.",lat:35.0114,lng:135.7929},
    ]},
    {nameHe:"דרום קיוטו",nameEn:"Southern Kyoto",desc:"שערי טוריי ורובע סאקה.",attractions:[
      {nameHe:"מקדש פושימי אינארי",nameEn:"Fushimi Inari",tags:["shrine","hike","viewpoint"],desc:"אלפי שערים ביער.",lat:34.9671,lng:135.7727},
      {nameHe:"רובע סאקה פושימי",nameEn:"Fushimi Sake",tags:["food","history"],desc:"40 מבשלות סאקה.",lat:34.9380,lng:135.7594},
      {nameHe:"מקדש טופוקוג'י",nameEn:"Tofukuji",tags:["temple","garden"],desc:"גן קארה-אנסאן מ-1236.",lat:34.9797,lng:135.7713},
    ]},
    {nameHe:"צפון קיוטו",nameEn:"Northern Kyoto",desc:"ביתן הזהב וכפרי הרים.",festivals:[{name:"Kurama Fire Festival",dates:"22 באוקטובר"}],attractions:[
      {nameHe:"מקדש קינקאקוג'י",nameEn:"Kinkakuji",tags:["temple","garden"],desc:"ביתן הזהב המצופה.",lat:35.0394,lng:135.7293},
      {nameHe:"קיבונה",nameEn:"Kibune",tags:["nature","shrine"],desc:"עיירה עם מסעדות על הנהר.",lat:35.1184,lng:135.7635},
      {nameHe:"קוראמה",nameEn:"Kurama",tags:["hike","temple","onsen"],desc:"מקדש והר עם אונסן.",lat:35.1271,lng:135.7699},
    ]},
    {nameHe:"מערב קיוטו",nameEn:"Western Kyoto",desc:"יער הבמבוק של ארשיאמה.",attractions:[
      {nameHe:"ארשיאמה",nameEn:"Arashiyama",tags:["nature","viewpoint"],desc:"יער במבוק וגשר טוגצוקיו.",lat:35.0094,lng:135.6761},
      {nameHe:"מקדש טנריוג'י",nameEn:"Tenryuji",tags:["temple","garden"],desc:"ראשון מקדשי הזן של קיוטו.",lat:35.0165,lng:135.6754},
      {nameHe:"מקדש קוקה-דרה",nameEn:"Kokedera",tags:["temple","garden"],desc:"מקדש האזוב — הזמנה מראש.",lat:34.9984,lng:135.6754},
    ]},
  ]},
  hokkaido:{nameHe:"הוקאידו",nameEn:"Hokkaido",intro:"אי האש והקרח — 6 פארקים לאומיים.",color:"#FFFBEB",border:"#F59E0B",textColor:"#78350F",areas:[
    {nameHe:"שיקוצו-טויה",nameEn:"Shikotsu-Toya",desc:"שלושה אגמי לוע-געש.",attractions:[
      {nameHe:"אגם טויה",nameEn:"Lake Toya",tags:["nature","viewpoint"],desc:"אגם לוע עם זיקוקים.",lat:42.5997,lng:140.8446},
      {nameHe:"עמק הגיהנום",nameEn:"Jigokudani",tags:["nature","viewpoint"],desc:"בריכות גופרית ובוץ.",lat:42.4964,lng:141.0186},
      {nameHe:"הר אוסו",nameEn:"Mt. Usu",tags:["nature","hike"],desc:"רכבל ולוע מעשן.",lat:42.5344,lng:140.8412},
    ]},
    {nameHe:"דייסצוזן",nameEn:"Daisetsuzan",desc:"הפארק הגדול ביפן.",attractions:[
      {nameHe:"הר אסאהי-דאקה",nameEn:"Mt. Asahi-dake",tags:["hike","nature","viewpoint"],desc:"ההר הגבוה. רכבל+מסלולים.",lat:43.6644,lng:142.8558},
      {nameHe:"בריכות הכחולות",nameEn:"Shirogane Blue Pond",tags:["nature","viewpoint"],desc:"בריכה כחולת-חלב.",lat:43.5741,lng:142.6573},
      {nameHe:"חוות טומיטה לוונדר",nameEn:"Farm Tomita",tags:["nature"],desc:"שדות לוונדר ביולי.",lat:43.5631,lng:142.4519},
      {nameHe:"מצוק סוונקיו",nameEn:"Sounkyo Gorge",tags:["nature","hike"],desc:"קניון עם מפלים.",lat:43.7400,lng:142.9550},
    ]},
    {nameHe:"אקאן-מאשו",nameEn:"Akan-Mashu",desc:"5 אגמים בצבעים ייחודיים.",attractions:[
      {nameHe:"אגם מאשו",nameEn:"Lake Mashu",tags:["nature","viewpoint"],desc:"אחד הצלולים בעולם.",lat:43.5757,lng:144.5393},
      {nameHe:"אגם קושארו",nameEn:"Lake Kussharo & Kotan Onsen",tags:["nature","onsen"],desc:"אגם ואונסן חינמי.",lat:43.6050,lng:144.3633},
      {nameHe:"תצפית ביהורו",nameEn:"Bihoro Pass",tags:["viewpoint"],desc:"פנורמה על האגמים.",lat:43.8310,lng:144.2900},
    ]},
    {nameHe:"שירטוקו",nameEn:"Shiretoko",desc:"חצי אי פראי — מורשת עולמית.",attractions:[
      {nameHe:"שיט סביב הפנינסולה",nameEn:"Shiretoko Cruise",tags:["nature","viewpoint"],desc:"3 שעות שיט — מפלים ודובים.",lat:44.1500,lng:145.0900},
      {nameHe:"5 האגמים",nameEn:"Shiretoko Five Lakes",tags:["nature","hike"],desc:"מסלול 3 שעות.",lat:44.0671,lng:144.9888},
      {nameHe:"מפלי קמויווקה",nameEn:"Kamuiwakka Falls",tags:["nature","onsen"],desc:"מפל מים חמים לטיפוס.",lat:44.1200,lng:145.0500},
    ]},
  ]},
  alps:{nameHe:"האלפים",nameEn:"Japanese Alps",intro:"גג יפן — כפרים מסורתיים ומסלול אלפיני.",color:"#FFF7ED",border:"#EA580C",textColor:"#7C2D12",areas:[
    {nameHe:"טקיאמה",nameEn:"Takayama",desc:"קיוטו הקטנה.",festivals:[{name:"Takayama Autumn Festival",dates:"9–10 אוקטובר"}],attractions:[
      {nameHe:"שוק הבוקר",nameEn:"Morning Market",tags:["food"],desc:"סאקה, ירקות ומלאכת יד.",lat:36.1456,lng:137.2541},
      {nameHe:"כפר הידה פולק",nameEn:"Hida Folk Village",tags:["history"],desc:"כפר עתיק עם גגות קש.",lat:36.1611,lng:137.2274},
      {nameHe:"בשר היידה",nameEn:"Hida Beef",tags:["food"],desc:"ואגיו מקומי מצוין.",lat:36.1457,lng:137.2522},
    ]},
    {nameHe:"האלפים הצפוניים",nameEn:"Northern Alps",desc:"קמיקוצ'י ומסלול אלפיני.",attractions:[
      {nameHe:"מסלול אלפיני טאטיאמה",nameEn:"Tateyama-Kurobe Alpine Route",tags:["hike","nature","viewpoint"],desc:"9 מקטעים, 2,450מ' גובה.",lat:36.5775,lng:137.6153},
      {nameHe:"קמיקוצ'י",nameEn:"Kamikochi",tags:["nature","hike","viewpoint"],desc:"עמק אלפיני — לישון לילה.",lat:36.2430,lng:137.6476},
      {nameHe:"הר יארי-גאטאקה",nameEn:"Mt. Yarigatake",tags:["hike"],desc:"3180מ'. טרק 2-3 ימים.",lat:36.3419,lng:137.6469,multiDay:true,defaultDays:3},
    ]},
    {nameHe:"הכפרים",nameEn:"Historic Villages",desc:"אתרי מורשת עולמית.",attractions:[
      {nameHe:"שירקוואה-גו",nameEn:"Shirakawa-Go",tags:["history","nature"],desc:"בתי גשו-זוקורי.",lat:36.2567,lng:136.9047},
      {nameHe:"מסלול צומאגו-מגומה",nameEn:"Tsumago-Magome",tags:["hike","history"],desc:"7ק\"מ בין כפרים עתיקים.",lat:35.5371,lng:137.5859},
    ]},
    {nameHe:"מאצומוטו",nameEn:"Matsumoto",desc:"טירת העורב.",attractions:[
      {nameHe:"טירת מאצומוטו",nameEn:"Matsumoto Castle",tags:["castle","history"],desc:"אחת מ-12 הטירות השמורות.",lat:36.2381,lng:137.9684},
    ]},
  ]},
  tohoku:{nameHe:"טוהוקו",nameEn:"Tohoku",intro:"פחות תיירותי — נוף, מקדשים ואוכל מקומי.",color:"#F5F3FF",border:"#7C3AED",textColor:"#4C1D95",areas:[
    {nameHe:"מיאגי",nameEn:"Miyagi",desc:"מפרץ מאצושימה.",attractions:[
      {nameHe:"מפרץ מאצושימה",nameEn:"Matsushima Bay",tags:["nature","viewpoint"],desc:"אחד מ-3 הנופים היפים ביפן.",lat:38.3680,lng:141.0668},
      {nameHe:"מקדש יאמאדרה",nameEn:"Yamadera",tags:["temple","hike"],desc:"1,000 מדרגות לתצפית.",lat:38.3164,lng:140.4421},
    ]},
    {nameHe:"אאומורי",nameEn:"Aomori",desc:"הקצה הצפוני.",festivals:[{name:"Nebuta Matsuri",dates:"2–7 אוגוסט"}],attractions:[
      {nameHe:"נחל אויראסה",nameEn:"Oirase Stream",tags:["nature","hike"],desc:"14ק\"מ ביער עם מפלונים.",lat:40.5573,lng:140.9167},
      {nameHe:"טירת הירוסאקי",nameEn:"Hirosaki Castle",tags:["castle","garden"],desc:"פריחת שרברבים מפורסמת.",lat:40.6073,lng:140.4628},
    ]},
    {nameHe:"אקיטה",nameEn:"Akita",desc:"אגמים ועמקים.",attractions:[
      {nameHe:"אגם טאזאווה",nameEn:"Lake Tazawa",tags:["nature","viewpoint"],desc:"האגם העמוק ביפן.",lat:39.7295,lng:140.6603},
    ]},
  ]},
  kansai:{nameHe:"קנסאי",nameEn:"Kansai",intro:"הבירה הרוחנית — אוסקה, נארה, קומנו.",color:"#FDF2F8",border:"#DB2777",textColor:"#831843",areas:[
    {nameHe:"אוסקה",nameEn:"Osaka",desc:"עיר הבילויים.",festivals:[{name:"Tenjin Matsuri",dates:"24–25 ביולי"}],attractions:[
      {nameHe:"דוטונבורי",nameEn:"Dotonbori",tags:["food","nightlife","entertainment"],desc:"ניאון, טקויאקי, Glico Man.",lat:34.6687,lng:135.5014},
      {nameHe:"טירת אוסקה",nameEn:"Osaka Castle",tags:["castle","history"],desc:"הטירה הסמלית מ-1583.",lat:34.6873,lng:135.5262},
      {nameHe:"שינסקאי",nameEn:"Shinsekai",tags:["history","food"],desc:"שכונה ישנה עם נאון.",lat:34.6524,lng:135.5057},
      {nameHe:"יוניברסל סטודיוס",nameEn:"Universal Studios Japan",tags:["entertainment"],desc:"כולל פארק נינטנדו.",lat:34.6654,lng:135.4323},
    ]},
    {nameHe:"נארה",nameEn:"Nara",desc:"איילים חופשיים ומקדשים.",attractions:[
      {nameHe:"פארק נארה",nameEn:"Nara Park & Deer",tags:["nature","park"],desc:"מאות איילים חופשיים.",lat:34.6851,lng:135.8411},
      {nameHe:"מקדש טודאיג'י",nameEn:"Todaiji Temple",tags:["temple","history"],desc:"הבניין הגדול מעץ בעולם.",lat:34.6887,lng:135.8396},
      {nameHe:"מקדש הורייוג'י",nameEn:"Horyuji Temple",tags:["temple","history"],desc:"מבני עץ עתיקים ביותר בעולם.",lat:34.6146,lng:135.7340},
    ]},
    {nameHe:"קומנו קודו",nameEn:"Kumano Kodo",desc:"טרק עלייה לרגל — מורשת עולמית.",attractions:[
      {nameHe:"טרק קומנו קודו",nameEn:"Kumano Kodo Trek",tags:["hike","history","shrine"],desc:"4-5 ימים, 70ק\"מ. ראו מדריך מפורט.",lat:33.8462,lng:135.7711,multiDay:true,defaultDays:4},
      {nameHe:"מקדש הונגו טאישה",nameEn:"Kumano Hongu Taisha",tags:["shrine","history"],desc:"המרכזי שבשלושת מקדשי קומנו.",lat:33.8394,lng:135.7882},
      {nameHe:"מפל נאצ'י",nameEn:"Nachi Falls & Shrine",tags:["shrine","nature","viewpoint"],desc:"המפל הגבוה ביפן (133מ').",lat:33.6680,lng:135.8930},
      {nameHe:"הר קויאסן",nameEn:"Koyasan",tags:["temple","history"],desc:"מרכז הבודהיזם השינגון.",lat:34.2129,lng:135.5861},
    ]},
  ]},
  fuji:{nameHe:"הר פוג'י",nameEn:"Mt. Fuji Area",intro:"סמל יפן — 5 אגמים וטיפוס.",color:"#F0FDF4",border:"#22C55E",textColor:"#14532D",areas:[
    {nameHe:"5 האגמים",nameEn:"Fuji Five Lakes",desc:"אגמי לוע עם נוף פוג'י.",attractions:[
      {nameHe:"אגם קאוואגוצ'י",nameEn:"Lake Kawaguchi",tags:["nature","viewpoint"],desc:"הנגיש מ-5 האגמים.",lat:35.5073,lng:138.7610},
      {nameHe:"מערות לבה",nameEn:"Lava Caves",tags:["nature"],desc:"מערות קרח ורוח.",lat:35.4714,lng:138.6500},
      {nameHe:"אושינו הקאי",nameEn:"Oshino Hakkai",tags:["nature","history"],desc:"8 בריכות מעיינות צלולים.",lat:35.4765,lng:138.8432},
    ]},
    {nameHe:"האקונה",nameEn:"Hakone",desc:"ספא ונוף פוג'י.",attractions:[
      {nameHe:"אוואקודאני",nameEn:"Owakudani",tags:["nature","viewpoint"],desc:"אזור גיאותרמי + ביצי ביש.",lat:35.2329,lng:139.0205},
      {nameHe:"מקדש האקונה",nameEn:"Hakone Shrine",tags:["shrine","nature"],desc:"טוריי על אגם אשינוקו.",lat:35.1976,lng:139.0272},
    ]},
    {nameHe:"הר פוג'י",nameEn:"Mt. Fuji Climb",desc:"",attractions:[
      {nameHe:"טיפוס הר פוג'י",nameEn:"Mt. Fuji Yoshida Trail",tags:["hike","viewpoint"],desc:"יומיים. עונה: יולי–ספטמבר.",lat:35.3606,lng:138.7274,multiDay:true,defaultDays:2},
    ]},
  ]},
};

const FESTIVALS=[
  {name:"Tanabata (הירטסוקה)",region:"טוקיו",month:7,day:4,endDay:6,color:"#EDE9FE",border:"#7C3AED",text:"#4C1D95",
    desc:"פסטיבל הכוכבים — חוגג את אגדת שני כוכבים אוהבים המופרדים על ידי הנהר הכסוף ונפגשים פעם בשנה. רחובות מעוטרים בקישוטי נייר צבעוניים ענקיים. הגרסה הגדולה ביותר בהירטסוקה הסמוכה לטוקיו."},
  {name:"Mitama Matsuri (יאסוקוני)",region:"טוקיו",month:7,day:13,endDay:16,color:"#FEF3C7",border:"#D97706",text:"#78350F",
    desc:"פסטיבל קיץ במקדש יאסוקוני לכבוד נשמות הנופלים. שביל הכניסה מקושט ב-29,000+ פנסים ענקיים — אחד הנופים המרשימים ביותר בטוקיו. מוסיקה ומחולות מסורתיים."},
  {name:"Gion Matsuri",region:"קיוטו",month:7,day:1,endDay:31,peakDay:17,color:"#DCFCE7",border:"#16A34A",text:"#14532D",
    desc:"אחד הפסטיבלים הגדולים ביותר ביפן — נמשך כל יולי. שיאו בתהלוכת הצפים הענקית (Yamaboko Junko) ב-17/7. ערבי יויאמה (14-16/7) — רחובות סגורים, דוכני מזון ואלפי מבקרים."},
  {name:"Tenjin Matsuri",region:"אוסקה",month:7,day:24,endDay:25,color:"#FCE7F3",border:"#DB2777",text:"#831843",
    desc:"אחד שלושת הפסטיבלים הגדולים ביפן לכבוד האל Tenjin. שיט טקסי עם אבוקות על הנהר, תהלוכה ביבשה וזיקוקים בלילה. מקורו במאה ה-10."},
  {name:"Sumidagawa Fireworks",region:"טוקיו",month:7,day:26,endDay:26,color:"#DBEAFE",border:"#2563EB",text:"#1E3A8A",
    desc:"פסטיבל הזיקוקים הגדול ביותר בטוקיו — כ-20,000 זיקוקים מעל נהר הסומידה. מתקיים מאז 1733. מיליון מבקרים מגיעים לשפת הנהר."},
  {name:"Nebuta Matsuri",region:"אאומורי (טוהוקו)",month:8,day:2,endDay:7,color:"#FEF3C7",border:"#D97706",text:"#78350F",
    desc:"פסטיבל ייחודי — ענקיות של דמויות לוחמים ואלים מוארות מבפנים נסחבות ברחובות. אחד הפסטיבלים הוויזואליים ביותר ביפן. מקורו בטקסים לגירוש שינה ועצלות."},
  {name:"Sendai Tanabata Matsuri",region:"סנדאי (טוהוקו)",month:8,day:6,endDay:8,color:"#EDE9FE",border:"#7C3AED",text:"#4C1D95",
    desc:"הגרסה הגדולה ביותר של פסטיבל טנאבאטה — עשרות אלפי קישוטי נייר צבעוניים ענקיים תלויים לאורך רחובות סנדאי. מסורת מקומית מתקופת אדו."},
  {name:"Awa Odori",region:"טוקושימה (שיקוקו)",month:8,day:12,endDay:15,color:"#FCE7F3",border:"#DB2777",text:"#831843",
    desc:"פסטיבל הריקוד המפורסם ביותר ביפן — מיליוני מבקרים. רקדנים בתלבושות מסורתיות צועדים ברחובות. הסיסמה: 'הגוייאים רוקדים, הטיפשים מסתכלים — שניהם טיפשים, אז למה לא לרקוד?'"},
  {name:"Kishiwada Danjiri",region:"קישיווודה (אוסקה)",month:9,day:14,endDay:15,color:"#FEF3C7",border:"#D97706",text:"#78350F",
    desc:"עגלות עץ ענקיות נסחבות בריצה ברחובות צרים בתחרויות בין שכונות. מסוכן ומרגש — עגלות מועפות בפניות חדות. אחד הפסטיבלים האגרסיביים ביותר ביפן."},
  {name:"Takayama Autumn Festival",region:"טקיאמה (האלפים)",month:10,day:9,endDay:10,color:"#FEF3C7",border:"#D97706",text:"#78350F",
    desc:"אחד מ-3 הפסטיבלים היפים ביותר ביפן — תהלוכת קיסוסטות עתיקות עם בובות מכניות (Karakuri) מרהיבות. מתקיים גם באביב (14-15 אפריל)."},
  {name:"Jidai Matsuri",region:"קיוטו",month:10,day:22,endDay:22,color:"#DCFCE7",border:"#16A34A",text:"#14532D",
    desc:"'פסטיבל הדורות' — תהלוכה של 2,000 איש בתלבושות מכל תקופות ההיסטוריה היפנית מאז 794 ועד 1868. חגיגת 1,100 שנה לייסוד קיוטו."},
  {name:"Kurama Fire Festival",region:"קיוטו — קוראמה",month:10,day:22,endDay:22,color:"#FEE2E2",border:"#DC2626",text:"#7F1D1D",
    desc:"פסטיבל האש של קוראמה — לאחר חשיכה, תושבי הכפר צועדים עם אבוקות ענק בסמטאות ההרריות. אחד הפסטיבלים האקסוטיים ביותר ביפן."},
  {name:"Nada Kenka Matsuri",region:"היוגו (הימג'י)",month:10,day:14,endDay:15,color:"#FEE2E2",border:"#DC2626",text:"#7F1D1D",
    desc:"'פסטיבל הלחימה' — שלוש עגלות ענקיות מתנגשות זו בזו בתצוגת עוצמה. המשתתפים מוגנים, אך העגלות ניזוקות. אחד הפסטיבלים הייחודיים ביותר ביפן."},
  {name:"Otsu Hikiyama Festival",region:"אוצו (שיגה)",month:10,day:10,endDay:11,color:"#EDE9FE",border:"#7C3AED",text:"#4C1D95",
    desc:"פסטיבל עם 13 עגלות ענקיות עמוסות בובות מכניות (Karakuri) המופעלות ידנית בדיוק מדהים. שונה בסגנון מטקיאמה — יותר עירוני ומגוון."},
  {name:"Zuiki Matsuri",region:"קיוטו",month:10,day:1,endDay:4,color:"#DCFCE7",border:"#16A34A",text:"#14532D",
    desc:"פסטיבל תודה לקציר במקדש קיטאנו טנמאנגו — העגלות מקושטות בשורשי טארו וירקות. פסטיבל צנוע ואוהנטי, רחוק מהמונים."},
  {name:"Kiyomizu Dragon Festival",region:"קיוטו",month:10,day:15,endDay:15,color:"#DCFCE7",border:"#16A34A",text:"#14532D",
    desc:"פסטיבל הדרקון הכחול (Seiryu-e) במקדש קיומיזו-דרה — דרקון כחול ענק מוצג בתהלוכה דרמטית. מסמל את הדרקון השומר על מי המקדש."},
  {name:"Mozu Hachiman Festival",region:"סאקאי (אוסקה)",month:10,day:4,endDay:5,color:"#FCE7F3",border:"#DB2777",text:"#831843",
    desc:"פסטיבל סתיו מסורתי במקדש מוזו הצ'ימאן — תהלוכה ומוזיקה יפנית מסורתית. משקף את הגאווה הקהילתית של עיר סאקאי הידועה בסכינים."},
  {name:"Hannan City Yagura",region:"האנן (אוסקה)",month:10,day:5,endDay:5,color:"#FCE7F3",border:"#DB2777",text:"#831843",
    desc:"אירוע מסורתי עם מגדלי יאגורה — במות עץ מסורתיות שעליהן מנגנים ורוקדים. סגנון הבידור הכפרי הוותיק ביותר ביפן."},
  {name:"Shichi-Go-San",region:"כלל יפן",month:11,day:15,endDay:15,color:"#EDE9FE",border:"#7C3AED",text:"#4C1D95",
    desc:"חגיגת ילדים בגיל 3, 5 ו-7 — גיל קריטי המסמל מעברי חיים. משפחות לובשות קימונו ומבקרות מקדשים. ילדים מקבלים ממתקים מיוחדים (Chitose-ame). פוטוגני מאוד."},
  {name:"Hanami (פריחת השרברבים)",region:"כלל יפן",month:4,day:1,endDay:30,color:"#FCE7F3",border:"#DB2777",text:"#831843",
    desc:"עונת פריחת הדובדבן (Sakura) — כל יפן מתמלאת בוורוד. פיקניקים מתחת לעצים (Hanami) הם מסורת לאומית. עיתוי הפריחה משתנה לפי שנה ואזור."},
];

const VOTE_OPTIONS=[
  {emoji:"✅",labelHe:"חובה!",color:"#15803D",bg:"#DCFCE7",border:"#16A34A"},
  {emoji:"❓",labelHe:"אולי",color:"#B45309",bg:"#FEF3C7",border:"#D97706"},
  {emoji:"⏭",labelHe:"נדלג",color:"#6B7280",bg:"#F3F4F6",border:"#9CA3AF"},
];
const MONTH_NAMES={1:"ינואר",2:"פברואר",3:"מרץ",4:"אפריל",5:"מאי",6:"יוני",7:"יולי",8:"אוגוסט",9:"ספטמבר",10:"אוקטובר",11:"נובמבר",12:"דצמבר"};
const TRIP_MONTHS=[7,8];

const vKey=(r,a,n)=>`v4:${r}:${a}:${n}`.replace(/\s/g,"_");
const cKey=(r,a,n)=>`c4:${r}:${a}:${n}`.replace(/\s/g,"_");
const itinKey="itin_v2";
const tripDatesKey="trip_dates_v1";
const load=async k=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}};
const save=async(k,v)=>{try{await window.storage.set(k,JSON.stringify(v));}catch{}};

const css=`
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;}
.jp-app{font-family:'Heebo','Segoe UI',Arial,sans-serif;direction:rtl;}
.jp-title{font-family:'Heebo',serif;font-weight:300;font-size:34px;letter-spacing:-0.02em;text-align:center;margin:0 0 4px;}
.jp-subtitle{text-align:center;font-size:14px;color:var(--color-text-secondary);margin:0 0 20px;}
.jp-nav{display:flex;gap:4px;background:var(--color-background-secondary);border-radius:28px;padding:4px;border:0.5px solid var(--color-border-tertiary);width:fit-content;}
.jp-nav-btn{padding:8px 16px;border-radius:22px;border:none;background:transparent;cursor:pointer;font-size:13px;font-family:'Heebo',sans-serif;font-weight:400;color:var(--color-text-secondary);transition:all 0.18s;}
.jp-nav-btn.active{background:var(--color-background-primary);color:var(--color-text-primary);font-weight:600;box-shadow:0 1px 4px rgba(0,0,0,0.1);}
.jp-region-btn{padding:7px 16px;border-radius:22px;border:1.5px solid var(--color-border-tertiary);background:transparent;cursor:pointer;font-size:13px;font-family:'Heebo',sans-serif;color:var(--color-text-secondary);transition:all 0.18s;}
.jp-tag-btn{padding:4px 12px;border-radius:14px;border:1px solid var(--color-border-tertiary);background:transparent;cursor:pointer;font-size:12px;font-family:'Heebo',sans-serif;color:var(--color-text-secondary);transition:all 0.15s;}
.jp-vote-btn{flex:1;border:1.5px solid var(--color-border-tertiary);background:transparent;border-radius:10px;padding:6px 4px;cursor:pointer;font-size:15px;transition:all 0.15s;}
.jp-card{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:14px;padding:14px 16px;cursor:pointer;transition:all 0.15s;display:flex;flex-direction:column;}
.jp-card:hover{border-color:var(--color-border-secondary);transform:translateY(-1px);}
.jp-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px;}
.jp-modal{background:#ffffff;border-radius:18px;padding:24px;max-width:520px;width:100%;max-height:88vh;overflow-y:auto;border:1px solid #e5e7eb;direction:rtl;color:#111827;}
.jp-modal.dark{background:#1f2937;border-color:#374151;color:#f9fafb;}
.jp-modal-muted{color:#6b7280!important;}.jp-modal.dark .jp-modal-muted{color:#9ca3af!important;}
.jp-close-btn{background:#f3f4f6;border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;color:#6b7280;flex-shrink:0;}
.jp-modal.dark .jp-close-btn{background:#374151;color:#d1d5db;}
.jp-modal-vote-btn{flex:1;border:1.5px solid #e5e7eb;border-radius:12px;padding:12px 8px;cursor:pointer;text-align:center;transition:all 0.15s;background:#f9fafb;font-family:'Heebo',sans-serif;}
.jp-modal.dark .jp-modal-vote-btn{background:#374151;border-color:#4b5563;}
.jp-modal-vote-btn.active{background:#fff;}.jp-modal.dark .jp-modal-vote-btn.active{background:#1f2937;}
.jp-comment-bubble{background:#f9fafb;border-radius:10px;border:0.5px solid #e5e7eb;padding:10px 14px;margin-bottom:8px;}
.jp-modal.dark .jp-comment-bubble{background:#374151;border-color:#4b5563;}
.jp-modal-input{width:100%;padding:10px 14px;border-radius:10px;border:1px solid #d1d5db;background:#fff;color:#111827;font-size:14px;font-family:'Heebo',sans-serif;outline:none;}
.jp-modal.dark .jp-modal-input{background:#374151;border-color:#4b5563;color:#f9fafb;}
.jp-modal-send{padding:10px 18px;border:1px solid #d1d5db;border-radius:10px;background:#f3f4f6;cursor:pointer;font-size:14px;font-family:'Heebo',sans-serif;color:#111827;font-weight:500;white-space:nowrap;}
.jp-modal.dark .jp-modal-send{background:#374151;border-color:#4b5563;color:#f9fafb;}
.jp-modal-divider{border:none;border-top:0.5px solid #e5e7eb;margin:0;}
.jp-modal.dark .jp-modal-divider{border-color:#374151;}
.jp-dark-btn,.jp-refresh-btn{padding:7px 14px;border-radius:20px;border:0.5px solid var(--color-border-secondary);background:transparent;cursor:pointer;font-size:13px;font-family:'Heebo',sans-serif;color:var(--color-text-secondary);display:flex;align-items:center;gap:5px;}
.jp-map-card{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:12px;padding:10px 14px;text-decoration:none;color:var(--color-text-primary);display:block;}
.jp-map-card:hover{border-color:var(--color-border-secondary);}
@keyframes spin{to{transform:rotate(360deg);}}
.day-col{background:var(--color-background-secondary);border-radius:12px;min-height:100px;padding:8px;border:2px solid transparent;transition:border-color 0.15s;}
.day-col.drag-over{border-color:#3B82F6;background:#EFF6FF;}
.itin-chip{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:9px;padding:7px 9px;margin-bottom:5px;cursor:grab;user-select:none;}
.itin-chip:active{opacity:0.7;}
.fav-chip{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:9px;padding:7px 10px;cursor:grab;user-select:none;display:flex;align-items:center;gap:7px;margin-bottom:5px;}
.fav-chip:active{opacity:0.6;}
.travel-badge{display:flex;align-items:center;gap:3px;font-size:10px;color:var(--color-text-secondary);padding:2px 0 4px;border-top:0.5px dashed var(--color-border-tertiary);margin-top:3px;}
.fest-card{border-radius:12px;padding:14px 16px;cursor:pointer;transition:border-color 0.15s;}
.fest-card:hover{filter:brightness(0.97);}
`;

export default function App(){
  const [dark,setDark]=useState(false);
  const [activeRegion,setActiveRegion]=useState("tokyo");
  const [votes,setVotes]=useState({});
  const [comments,setComments]=useState({});
  const [openCard,setOpenCard]=useState(null);
  const [newComment,setNewComment]=useState("");
  const [view,setView]=useState("explore");
  const [tagFilter,setTagFilter]=useState("הכל");
  const [refreshing,setRefreshing]=useState(false);
  const [fMonthFilter,setFMonthFilter]=useState("הכל");
  const [openFestival,setOpenFestival]=useState(null);
  const [startDate,setStartDate]=useState("2025-07-01");
  const [endDate,setEndDate]=useState("2025-07-27");
  const [itin,setItin]=useState({});
  const [dragOver,setDragOver]=useState(null);
  const dragItem=useRef(null);

  useEffect(()=>{
    (async()=>{
      const av={},ac={};
      for(const[rid,rd]of Object.entries(DATA))
        for(const area of rd.areas)
          for(const att of area.attractions){
            const v=await load(vKey(rid,area.nameEn,att.nameEn));if(v!==null)av[vKey(rid,area.nameEn,att.nameEn)]=v;
            const c=await load(cKey(rid,area.nameEn,att.nameEn));if(c)ac[cKey(rid,area.nameEn,att.nameEn)]=c;
          }
      const saved=await load(itinKey);
      const td=await load(tripDatesKey);
      setVotes(av);setComments(ac);if(saved)setItin(saved);
      if(td){setStartDate(td.start);setEndDate(td.end);}
    })();
  },[]);

  const saveItin=async updated=>{setItin(updated);await save(itinKey,updated);};
  const saveTripDates=async(s,e)=>{await save(tripDatesKey,{start:s,end:e});};

  const castVote=async(rid,aen,attn,emoji)=>{
    const k=vKey(rid,aen,attn);
    const nv=votes[k]===emoji?null:emoji;
    const u={...votes};nv===null?delete u[k]:(u[k]=nv);
    setVotes(u);await save(k,nv);
  };
  const addComment=async(rid,aen,attn)=>{
    if(!newComment.trim())return;
    const ck=cKey(rid,aen,attn);
    const u=[...(comments[ck]||[]),{text:newComment.trim(),ts:Date.now()}];
    setComments({...comments,[ck]:u});await save(ck,u);setNewComment("");
  };

  const dateList=useMemo(()=>{
    if(!startDate||!endDate)return[];
    const list=[];let d=new Date(startDate);const e=new Date(endDate);
    while(d<=e){list.push(d.toISOString().slice(0,10));d=new Date(d.getTime()+86400000);}
    return list;
  },[startDate,endDate]);

  const favPool=useMemo(()=>{
    const items=[];
    for(const[rid,rd]of Object.entries(DATA))
      for(const area of rd.areas)
        for(const att of area.attractions){
          const k=vKey(rid,area.nameEn,att.nameEn);
          if(votes[k]==="✅"){
            const id=`${rid}|${area.nameEn}|${att.nameEn}`;
            const placed=Object.values(itin).some(day=>day.some(x=>x.id===id));
            if(!placed)items.push({id,nameHe:att.nameHe,nameEn:att.nameEn,region:rid,lat:att.lat,lng:att.lng,multiDay:att.multiDay,defaultDays:att.defaultDays||1,tags:att.tags||[]});
          }
        }
    return items;
  },[votes,itin]);

  const festivalsInRange=useMemo(()=>{
    if(!startDate||!endDate)return[];
    const s=new Date(startDate),e=new Date(endDate);
    return FESTIVALS.filter(f=>{
      const fs=new Date(2025,f.month-1,f.day),fe=new Date(2025,f.month-1,f.endDay);
      return fs<=e&&fe>=s;
    }).sort((a,b)=>a.month-b.month||a.day-b.day);
  },[startDate,endDate]);

  const rd=DATA[activeRegion];
  const totalMust=Object.values(votes).filter(v=>v==="✅").length;
  const totalMaybe=Object.values(votes).filter(v=>v==="❓").length;
  const cardVote=openCard?votes[vKey(openCard.rid,openCard.area.nameEn,openCard.att.nameEn)]:null;
  const cardCmts=openCard?(comments[cKey(openCard.rid,openCard.area.nameEn,openCard.att.nameEn)]||[]):[];
  const filteredAreas=rd.areas.map(area=>({...area,attractions:tagFilter==="הכל"?area.attractions:area.attractions.filter(a=>a.tags.includes(tagFilter))})).filter(a=>a.attractions.length>0);

  const heDate=d=>{const dt=new Date(d);return`${dt.getDate()}/${dt.getMonth()+1}`;};
  const heDay=d=>["א׳","ב׳","ג׳","ד׳","ה׳","ו׳","ש׳"][new Date(d).getDay()];
  const fmtDateHe=d=>{const[y,m,day]=d.split('-').map(Number);return`${day} ב${MONTH_NAMES[m]} ${y}`;};

  const withinDayTravels=items=>items.map((item,i)=>{
    if(i===0)return null;
    const prev=items[i-1];
    if(prev.region!==item.region){const t=travelTime(prev.region,item.region);return t?{mins:t,cross:true}:null;}
    return{mins:20,cross:false};
  });

  const interDayTravel=date=>{
    const idx=dateList.indexOf(date);if(idx<=0)return null;
    const prev=itin[dateList[idx-1]]||[],cur=itin[date]||[];
    if(!prev.length||!cur.length)return null;
    const last=prev[prev.length-1],first=cur[0];
    if(last.region===first.region)return null;
    const t=travelTime(last.region,first.region);
    return t?{from:last.nameHe,to:first.nameHe,mins:t}:null;
  };

  const onDragStart=(item,fromDate)=>{dragItem.current={item,fromDate};};
  const onDragOver=(e,date)=>{e.preventDefault();setDragOver(date);};
  const onDrop=(e,toDate)=>{
    e.preventDefault();setDragOver(null);
    if(!dragItem.current)return;
    const{item,fromDate}=dragItem.current;
    const u={...itin};
    if(fromDate&&fromDate!=="pool"){
      if(item.multiDay){Object.keys(u).forEach(d=>{u[d]=(u[d]||[]).filter(x=>x.id!==item.id);});}
      else{u[fromDate]=(u[fromDate]||[]).filter(x=>x.id!==item.id);}
    }
    const toIdx=dateList.indexOf(toDate);
    const days=item.multiDay?item.defaultDays:1;
    for(let i=0;i<days&&toIdx+i<dateList.length;i++){
      const d=dateList[toIdx+i];
      if(!u[d])u[d]=[];
      if(!u[d].some(x=>x.id===item.id))u[d]=[...u[d],{...item}];
    }
    saveItin(u);dragItem.current=null;
  };
  const removeFromDay=(date,id)=>{
    const item=(itin[date]||[]).find(x=>x.id===id);
    if(item?.multiDay){const u={...itin};Object.keys(u).forEach(d=>{u[d]=(u[d]||[]).filter(x=>x.id!==id);});saveItin(u);}
    else saveItin({...itin,[date]:(itin[date]||[]).filter(x=>x.id!==id)});
  };

  const allFestMonths=["הכל",...Array.from(new Set(FESTIVALS.map(f=>f.month))).sort((a,b)=>a-b).map(m=>String(m))];
  const shownFests=fMonthFilter==="הכל"?FESTIVALS:FESTIVALS.filter(f=>String(f.month)===fMonthFilter);
  const groupedFests={};shownFests.forEach(f=>{if(!groupedFests[f.month])groupedFests[f.month]=[];groupedFests[f.month].push(f);});
  Object.keys(groupedFests).forEach(m=>{groupedFests[m].sort((a,b)=>a.day-b.day);});

  return(
    <div className="jp-app" style={{maxWidth:900,margin:"0 auto",padding:"1.5rem 1rem",...(dark?{background:"#111",color:"#eee"}:{})}}>
      <style>{css}</style>
      <h1 className="jp-title">🗾 יפן 2025</h1>
      <p className="jp-subtitle">מתכנן הטיול האינטראקטיבי</p>

      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:"1rem",flexWrap:"wrap"}}>
        <nav className="jp-nav">
          {[{id:"explore",label:"🗺 חקרו"},{id:"organize",label:"📅 תכנן"},{id:"festivals",label:"🎏 פסטיבלים"},{id:"map",label:"📍 מפה"}].map(({id,label})=>(
            <button key={id} className={`jp-nav-btn${view===id?" active":""}`} onClick={()=>setView(id)}>{label}</button>
          ))}
        </nav>
        <button className="jp-refresh-btn" onClick={()=>{setRefreshing(true);setTimeout(()=>setRefreshing(false),1200);}}>
          <span style={{display:"inline-block",animation:refreshing?"spin 0.8s linear infinite":"none"}}>↻</span>
          {refreshing?"מרענן...":"רענן"}
        </button>
        <button className="jp-dark-btn" onClick={()=>setDark(d=>!d)}>{dark?"☀️":"🌙"}</button>
        <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>✅{totalMust} ❓{totalMaybe}</span>
      </div>

      <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:"1.25rem",flexWrap:"wrap"}}>
        <a href={DOCS_URL} target="_blank" rel="noreferrer"
          style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",fontSize:12,fontFamily:FONT,color:"var(--color-text-secondary)",textDecoration:"none",fontWeight:500}}>
          📄 Google Docs ↗
        </a>
        <a href={KUMANO_URL} target="_blank" rel="noreferrer"
          style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,border:"0.5px solid #16A34A",background:"#DCFCE7",fontSize:12,fontFamily:FONT,color:"#14532D",textDecoration:"none",fontWeight:500}}>
          🌲 מדריך קומנו קודו ↗
        </a>
      </div>

      {/* EXPLORE */}
      {view==="explore"&&<>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:"1rem",justifyContent:"center"}}>
          {Object.entries(DATA).map(([rid,rdd])=>(
            <button key={rid} className="jp-region-btn" onClick={()=>{setActiveRegion(rid);setTagFilter("הכל");}}
              style={activeRegion===rid?{borderColor:rdd.border,background:rdd.color,color:rdd.textColor,fontWeight:600}:{}}>
              {rdd.nameHe}
            </button>
          ))}
        </div>
        <div style={{background:rd.color,borderRadius:14,padding:"14px 18px",marginBottom:"1.25rem",borderRight:`4px solid ${rd.border}`}}>
          <div style={{fontSize:11,fontWeight:600,color:rd.textColor,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:5}}>{rd.nameHe} · {rd.nameEn}</div>
          <p style={{fontSize:14,lineHeight:1.7,margin:0,color:rd.textColor}}>{rd.intro}</p>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:"1.25rem"}}>
          {["הכל",...Object.keys(TAGS)].map(t=>{const tag=TAGS[t];const active=tagFilter===t;return(
            <button key={t} className="jp-tag-btn" onClick={()=>setTagFilter(t)}
              style={active?{borderColor:tag?.border||"var(--color-border-primary)",background:tag?.color,color:tag?.text}:{}}>
              {t==="הכל"?"הכל":tag?.label}
            </button>
          );})}
        </div>
        {filteredAreas.map(area=>(
          <div key={area.nameEn} style={{marginBottom:"2rem"}}>
            <div style={{marginBottom:12}}>
              <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:3}}>
                <span style={{fontSize:16,fontWeight:600}}>{area.nameHe}</span>
                <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{area.nameEn}</span>
              </div>
              {area.desc&&<p style={{fontSize:13,color:"var(--color-text-secondary)",margin:"0 0 6px",lineHeight:1.6}}>{area.desc}</p>}
              {area.festivals?.map(f=>(
                <div key={f.name} style={{display:"inline-flex",alignItems:"center",gap:6,background:"#FEF3C7",border:"1px solid #D97706",borderRadius:8,padding:"4px 12px",fontSize:12,color:"#78350F",marginBottom:4}}>
                  🎏 <strong>{f.name}</strong> — {f.dates}
                </div>
              ))}
              <div style={{borderBottom:"1px solid var(--color-border-tertiary)",marginTop:8}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:10}}>
              {area.attractions.map(att=>{
                const k=vKey(activeRegion,area.nameEn,att.nameEn);
                const v=votes[k];const vopt=VOTE_OPTIONS.find(o=>o.emoji===v);
                const cmts=comments[cKey(activeRegion,area.nameEn,att.nameEn)]||[];
                return(
                  <div key={att.nameEn} className="jp-card"
                    style={{borderTop:`3px solid ${v?vopt.border:rd.border}`}}
                    onClick={()=>setOpenCard({rid:activeRegion,area,att})}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                      <div>
                        <div style={{fontSize:14,fontWeight:600,lineHeight:1.3}}>{att.nameHe}</div>
                        <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:1}}>{att.nameEn}</div>
                      </div>
                      {cmts.length>0&&<span style={{fontSize:11,color:"var(--color-text-secondary)"}}>💬{cmts.length}</span>}
                    </div>
                    <p style={{fontSize:12,color:"var(--color-text-secondary)",margin:"0 0 8px",lineHeight:1.6,flexGrow:1,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{att.desc}</p>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
                      {att.tags.map(t=>{const tag=TAGS[t];return tag?<span key={t} style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:tag.color,color:tag.text}}>{tag.label}</span>:null;})}
                      {att.multiDay&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:"#EDE9FE",color:"#4C1D95"}}>🗓 {att.defaultDays}י</span>}
                    </div>
                    <div style={{display:"flex",gap:5}} onClick={e=>e.stopPropagation()}>
                      {VOTE_OPTIONS.map(opt=>(
                        <button key={opt.emoji} className="jp-vote-btn"
                          onClick={e=>{e.stopPropagation();castVote(activeRegion,area.nameEn,att.nameEn,opt.emoji);}}
                          style={v===opt.emoji?{borderColor:opt.border,background:opt.bg,color:opt.color}:{opacity:v&&v!==opt.emoji?0.4:1}}
                          title={opt.labelHe}>{opt.emoji}</button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </>}

      {/* ORGANIZE */}
      {view==="organize"&&<div>
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:"1.25rem",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <label style={{fontSize:13,color:"var(--color-text-secondary)"}}>מ:</label>
            <input type="date" value={startDate} onChange={e=>{setStartDate(e.target.value);saveTripDates(e.target.value,endDate);}}
              style={{padding:"6px 10px",borderRadius:8,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",color:"var(--color-text-primary)",fontSize:13,fontFamily:FONT,colorScheme:dark?"dark":"light"}}/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <label style={{fontSize:13,color:"var(--color-text-secondary)"}}>עד:</label>
            <input type="date" value={endDate} onChange={e=>{setEndDate(e.target.value);saveTripDates(startDate,e.target.value);}}
              style={{padding:"6px 10px",borderRadius:8,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",color:"var(--color-text-primary)",fontSize:13,fontFamily:FONT,colorScheme:dark?"dark":"light"}}/>
          </div>
          <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{dateList.length} ימים</span>
        </div>

        {festivalsInRange.length>0&&(
          <div style={{marginBottom:"1.25rem"}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>🎏 פסטיבלים בתאריכי הטיול</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {festivalsInRange.map(f=>(
                <div key={f.name} style={{background:f.color,border:`1px solid ${f.border}`,borderRadius:8,padding:"4px 12px",fontSize:12,color:f.text,fontWeight:500}}>
                  {f.name} · {f.day}/{f.month}–{f.endDay}/{f.month}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:"170px 1fr",gap:16,alignItems:"start"}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:8,color:"var(--color-text-secondary)"}}>✅ מועדפים ({favPool.length})</div>
            {favPool.length===0&&<p style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.6}}>סמנו מקומות כ-✅ בחקרו, ואז גררו לימים.</p>}
            <div style={{maxHeight:520,overflowY:"auto"}}>
              {favPool.map(item=>(
                <div key={item.id} className="fav-chip"
                  draggable onDragStart={()=>onDragStart(item,"pool")}
                  style={{borderRight:`3px solid ${DATA[item.region]?.border||"#ccc"}`}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,lineHeight:1.3,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{item.nameHe}</div>
                    {item.multiDay&&<div style={{fontSize:10,color:"#7C3AED"}}>🗓 {item.defaultDays} ימים</div>}
                  </div>
                  <span style={{fontSize:12,opacity:0.35}}>⠿</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{overflowX:"auto"}}>
            <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(dateList.length,7)},1fr)`,gap:8,minWidth:dateList.length>7?660:undefined}}>
              {dateList.map((date,di)=>{
                const items=itin[date]||[];
                const travels=withinDayTravels(items);
                const inter=interDayTravel(date);
                const dayFests=FESTIVALS.filter(f=>{const fd=new Date(2025,f.month-1,f.day),fe=new Date(2025,f.month-1,f.endDay),dd=new Date(date);return dd>=fd&&dd<=fe;});
                return(
                  <div key={date}>
                    {inter&&di%7!==0&&(
                      <div style={{fontSize:10,color:"#2563EB",textAlign:"center",marginBottom:4,background:"#DBEAFE",borderRadius:6,padding:"2px 4px"}}>
                        🚄 {fmtMins(inter.mins)}
                      </div>
                    )}
                    <div className={`day-col${dragOver===date?" drag-over":""}`}
                      onDragOver={e=>onDragOver(e,date)} onDragLeave={()=>setDragOver(null)} onDrop={e=>onDrop(e,date)}>
                      <div style={{fontSize:11,fontWeight:600,marginBottom:5,display:"flex",justifyContent:"space-between"}}>
                        <span>{heDay(date)} {heDate(date)}</span>
                        {dayFests.length>0&&<span title={dayFests.map(f=>f.name).join(", ")}>🎏</span>}
                      </div>
                      {items.map((item,ii)=>(
                        <div key={item.id}>
                          {travels[ii]&&(
                            <div className="travel-badge">
                              {travels[ii].cross?"🚄":"🚶"} {fmtMins(travels[ii].mins)}
                            </div>
                          )}
                          <div className="itin-chip" draggable onDragStart={()=>onDragStart(item,date)}
                            style={{borderRight:`3px solid ${item.multiDay?"#7C3AED":DATA[item.region]?.border||"#ccc"}`}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                              <span style={{fontSize:11,fontWeight:600,lineHeight:1.3,flex:1}}>{item.nameHe}</span>
                              <button onClick={()=>removeFromDay(date,item.id)}
                                style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"var(--color-text-secondary)",padding:0,lineHeight:1}}>×</button>
                            </div>
                            <span style={{fontSize:10,color:"var(--color-text-secondary)"}}>{DATA[item.region]?.nameHe}</span>
                          </div>
                        </div>
                      ))}
                      {items.length===0&&<div style={{fontSize:10,color:"var(--color-text-secondary)",textAlign:"center",padding:"10px 0",opacity:0.4}}>גרור לכאן</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:16,marginTop:14,fontSize:11,color:"var(--color-text-secondary)",flexWrap:"wrap"}}>
          <span>🚄 נסיעה בין אזורים</span><span>🚶 תחבורה מקומית (~20 דק')</span><span style={{color:"#7C3AED"}}>🗓 פריט מרובה-ימים</span>
        </div>
      </div>}

      {/* FESTIVALS */}
      {view==="festivals"&&<div>
        <div style={{background:"#FFFBEB",border:"1px solid #F59E0B",borderRadius:12,padding:"12px 16px",marginBottom:"1.25rem"}}>
          <p style={{margin:0,fontSize:13,color:"#78350F",lineHeight:1.7}}>
            🗓 <strong>הטיול:</strong> {fmtDateHe(startDate)}–{fmtDateHe(endDate)}. פסטיבלים ✈️ הם בתאריכי הטיול. לחצו על פסטיבל לפרטים.
          </p>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:"1.25rem"}}>
          {allFestMonths.map(m=>(
            <button key={m} className="jp-tag-btn" onClick={()=>setFMonthFilter(m)}
              style={fMonthFilter===m?{background:"#FEF3C7",borderColor:"#D97706",color:"#78350F",fontWeight:600}:{}}>
              {m==="הכל"?"כל החודשים":MONTH_NAMES[Number(m)]}
            </button>
          ))}
        </div>
        {Object.entries(groupedFests).sort((a,b)=>Number(a[0])-Number(b[0])).map(([month,fests])=>(
          <div key={month} style={{marginBottom:"1.75rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <span style={{fontSize:15,fontWeight:700}}>{MONTH_NAMES[Number(month)]}</span>
              {fests.some(f=>festivalsInRange.some(fr=>fr.name===f.name))&&<span style={{background:"#DCFCE7",color:"#14532D",fontSize:11,padding:"2px 10px",borderRadius:8,fontWeight:600}}>✈️ בטיול שלכם</span>}
              <div style={{flex:1,borderBottom:"1px solid var(--color-border-tertiary)"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
              {fests.map(f=>{
                const inTrip=festivalsInRange.some(fr=>fr.name===f.name);
                const isOpen=openFestival===f.name;
                return(
                  <div key={f.name} className="fest-card"
                    onClick={()=>setOpenFestival(isOpen?null:f.name)}
                    style={{background:inTrip?(dark?"#1a2e1a":"#F0FDF4"):"var(--color-background-primary)",
                      border:`1.5px solid ${isOpen?f.border:inTrip?"#16A34A":"var(--color-border-tertiary)"}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                      <div style={{fontSize:14,fontWeight:700,flex:1,paddingLeft:6}}>{f.name}</div>
                      <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0}}>
                        {inTrip&&<span>✈️</span>}
                        <span style={{fontSize:13,color:"var(--color-text-secondary)",display:"inline-block",transition:"transform 0.2s",transform:isOpen?"rotate(180deg)":"none"}}>▾</span>
                      </div>
                    </div>
                    <div style={{fontSize:12,color:inTrip?"#15803D":"var(--color-text-secondary)",fontWeight:600,marginBottom:2}}>
                      📅 {f.day}–{f.endDay}/{f.month}
                      {f.peakDay&&<span style={{fontWeight:400,color:"var(--color-text-secondary)"}}> · שיא: {f.peakDay}/{f.month}</span>}
                    </div>
                    <div style={{fontSize:12,color:"var(--color-text-secondary)",...(isOpen?{marginBottom:10}:{})}}>📍 {f.region}</div>
                    {isOpen&&f.desc&&(
                      <div style={{borderTop:`1.5px solid ${f.border}55`,paddingTop:10,marginTop:2}}>
                        <p style={{fontSize:13,lineHeight:1.75,margin:0,color:dark?"#e5e7eb":"#111827"}}>{f.desc}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>}

      {/* MAP */}
      {view==="map"&&<div>
        <div style={{background:"var(--color-background-secondary)",borderRadius:14,padding:"14px 18px",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:14}}>
          <span style={{fontSize:28}}>🗺</span>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:2}}>המפה המלאה</div>
            <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>Google My Maps שלכם</div>
          </div>
          <a href="https://www.google.com/maps/d/u/0/edit?mid=1JU1LDVQgkGSPGxMhWEAd03M1eUFn5U0" target="_blank" rel="noreferrer"
            style={{padding:"8px 16px",borderRadius:10,background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",fontSize:13,fontFamily:FONT,color:"var(--color-text-primary)",textDecoration:"none",fontWeight:500}}>
            פתח ↗
          </a>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:"1rem",justifyContent:"center"}}>
          {Object.entries(DATA).map(([rid,rdd])=>(
            <button key={rid} className="jp-region-btn" onClick={()=>setActiveRegion(rid)}
              style={activeRegion===rid?{borderColor:rdd.border,background:rdd.color,color:rdd.textColor,fontWeight:600}:{}}>
              {rdd.nameHe}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:8}}>
          {DATA[activeRegion].areas.flatMap(area=>
            area.attractions.filter(a=>a.lat).map(att=>{
              const k=vKey(activeRegion,area.nameEn,att.nameEn);
              const v=votes[k];const vopt=VOTE_OPTIONS.find(o=>o.emoji===v);
              return(
                <a key={att.nameEn} className="jp-map-card"
                  href={`https://www.google.com/maps/search/?api=1&query=${att.lat},${att.lng}`}
                  target="_blank" rel="noreferrer"
                  style={{borderTop:`3px solid ${v?vopt.border:DATA[activeRegion].border}`}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{att.nameHe}</div>
                  <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:6}}>{area.nameHe}</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {att.tags.slice(0,2).map(t=>{const tag=TAGS[t];return tag?<span key={t} style={{fontSize:10,padding:"1px 7px",borderRadius:8,background:tag.color,color:tag.text}}>{tag.label}</span>:null;})}
                    </div>
                    {v&&<span style={{fontSize:14}}>{v}</span>}
                  </div>
                </a>
              );
            })
          )}
        </div>
      </div>}

      {/* MODAL */}
      {openCard&&(
        <div className="jp-modal-backdrop" onClick={()=>{setOpenCard(null);setNewComment("");}}>
          <div className={`jp-modal${dark?" dark":""}`} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,gap:12}}>
              <div style={{flex:1}}>
                <div style={{fontSize:20,fontWeight:700,lineHeight:1.3,marginBottom:3}}>{openCard.att.nameHe}</div>
                <div style={{fontSize:13}} className="jp-modal-muted">{openCard.att.nameEn} · {DATA[openCard.rid].nameHe} · {openCard.area.nameHe}</div>
              </div>
              <button className="jp-close-btn" onClick={()=>setOpenCard(null)}>×</button>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
              {openCard.att.tags.map(t=>{const tag=TAGS[t];return tag?<span key={t} style={{fontSize:12,padding:"3px 10px",borderRadius:12,background:tag.color,color:tag.text,fontWeight:500}}>{tag.label}</span>:null;})}
              {openCard.att.multiDay&&<span style={{fontSize:12,padding:"3px 10px",borderRadius:12,background:"#EDE9FE",color:"#4C1D95",fontWeight:500}}>🗓 {openCard.att.defaultDays} ימים</span>}
            </div>
            <p style={{fontSize:14,lineHeight:1.8,marginBottom:16}}>{openCard.att.desc}</p>
            {openCard.att.nameEn==="Kumano Kodo Trek"&&(
              <a href={KUMANO_URL} target="_blank" rel="noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:6,background:"#DCFCE7",border:"1px solid #16A34A",borderRadius:10,padding:"7px 14px",fontSize:13,fontFamily:FONT,color:"#14532D",textDecoration:"none",marginBottom:16,fontWeight:500}}>
                🌲 פתח מדריך מפורט ↗
              </a>
            )}
            {openCard.att.lat&&(
              <a href={`https://www.google.com/maps/search/?api=1&query=${openCard.att.lat},${openCard.att.lng}`}
                target="_blank" rel="noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:6,background:dark?"#374151":"#f3f4f6",border:`0.5px solid ${dark?"#4b5563":"#d1d5db"}`,borderRadius:10,padding:"7px 14px",fontSize:13,fontFamily:FONT,color:dark?"#d1d5db":"#374151",textDecoration:"none",marginBottom:18}}>
                📍 פתח ב-Google Maps ↗
              </a>
            )}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:8}}>
              {VOTE_OPTIONS.map(opt=>(
                <button key={opt.emoji} className={`jp-modal-vote-btn${cardVote===opt.emoji?" active":""}`}
                  onClick={()=>castVote(openCard.rid,openCard.area.nameEn,openCard.att.nameEn,opt.emoji)}
                  style={cardVote===opt.emoji?{borderColor:opt.border,background:opt.bg}:{}}>
                  <div style={{fontSize:24,marginBottom:4}}>{opt.emoji}</div>
                  <div style={{fontSize:12,color:cardVote===opt.emoji?opt.color:(dark?"#9ca3af":"#6b7280"),fontWeight:cardVote===opt.emoji?600:400}}>{opt.labelHe}</div>
                </button>
              ))}
            </div>
            {cardVote&&<p style={{fontSize:11,textAlign:"center",marginBottom:16}} className="jp-modal-muted">לחצו שוב לביטול</p>}
            <hr className="jp-modal-divider" style={{marginBottom:14}}/>
            <div style={{fontSize:14,fontWeight:600,marginBottom:10}}>💬 הערות ({cardCmts.length})</div>
            {cardCmts.length===0&&<p style={{fontSize:13,marginBottom:12}} className="jp-modal-muted">אין הערות — היו הראשונים!</p>}
            {cardCmts.map((c,i)=>(
              <div key={i} className="jp-comment-bubble">
                <p style={{fontSize:13,margin:"0 0 4px",lineHeight:1.6}}>{c.text}</p>
                <span style={{fontSize:10}} className="jp-modal-muted">{new Date(c.ts).toLocaleDateString("he-IL")}</span>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <input className="jp-modal-input" value={newComment} onChange={e=>setNewComment(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addComment(openCard.rid,openCard.area.nameEn,openCard.att.nameEn)}
                placeholder="הוסיפו הערה..." dir="rtl"/>
              <button className="jp-modal-send" onClick={()=>addComment(openCard.rid,openCard.area.nameEn,openCard.att.nameEn)}>שלח</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
