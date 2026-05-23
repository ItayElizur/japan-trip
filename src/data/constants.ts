export const FONT = "'Heebo','Segoe UI',Arial,sans-serif";
export const DOCS_URL = "https://docs.google.com/document/d/10T-KQ1i6Ypr6YOM8xlu2-XOGvkZ7Uq97xIYct-UiRGQ/edit";

export const TRAVEL: Record<string, number> = {
  "fuji:fuji":40,"alps:alps":50,"hokkaido:hokkaido":60,"tohoku:tohoku":45,
  "tokyo:tokyo":20,"kyoto:kyoto":25,"kansai:kansai":30,
  "tokyo:fuji":110,"tokyo:kyoto":140,"tokyo:kansai":150,"tokyo:alps":180,
  "tokyo:tohoku":90,"tokyo:hokkaido":90,
  "kyoto:kansai":30,"kyoto:fuji":150,"kyoto:alps":120,
  "kansai:fuji":160,"kansai:alps":130,
  "hokkaido:tohoku":120,
};

export const TAGS: Record<string,{label:string,color:string,border:string,text:string}> = {
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

export const VOTE_OPTIONS = [
  {emoji:"✅",labelHe:"חובה!",color:"#15803D",bg:"#DCFCE7",border:"#16A34A"},
  {emoji:"❓",labelHe:"אולי",color:"#B45309",bg:"#FEF3C7",border:"#D97706"},
  {emoji:"⏭",labelHe:"נדלג",color:"#6B7280",bg:"#F3F4F6",border:"#9CA3AF"},
];

export const MONTH_NAMES: Record<number,string> = {1:"ינואר",2:"פברואר",3:"מרץ",4:"אפריל",5:"מאי",6:"יוני",7:"יולי",8:"אוגוסט",9:"ספטמבר",10:"אוקטובר",11:"נובמבר",12:"דצמבר"};
