// App features shown on the marketing site.

/** The feature wall for the app section. Researched against daycare apps such as Brightwheel,
 *  Famly, Lillio/HiMama and Daily Connect: QR pickup, menus with allergy flags, enrollment, two-way messaging. */
export const FEATURES = [
  {
    id: "pickup",
    size: "wide",
    title: "איסוף בקוד אישי",
    text: "להורה קוד איסוף יומי (QR) ורשימת מורשים. הצוות סורק, רואה מי מאושר, והיציאה נרשמת בשנייה.",
  },
  {
    id: "menu",
    size: "tall",
    title: "תפריט שבועי עם אלרגיות",
    text: "כל מנה מסומנת. אם משהו לא מתאים לילד, ההורה והצוות רואים אזהרה לפני הארוחה.",
  },
  {
    id: "summary",
    size: "normal",
    title: "סיכום יום אוטומטי",
    text: "מהיומן נבנה משפט אחד חם: מה אכל, כמה ישן ומה עשה.",
  },
  { id: "live", size: "normal", title: "עדכון בזמן אמת", text: "הצוות מעדכן, ההורה רואה. בלי להמתין לערב." },
  { id: "albums", size: "normal", title: "אלבומים עם הסכמה", text: "תמונות קבוצתיות ואלבום פרטי. הורה בוחר מה נשמר." },
  {
    id: "inbox",
    size: "wide",
    title: "פניות והיעדרויות",
    text: "הורה שולח הודעה או מדווח על היעדרות בלחיצה. המנהלת רואה ועונה, והצוות מתעדכן.",
  },
  {
    id: "money",
    size: "normal",
    title: "כספים בלי כאב ראש",
    text: "חיובים, תקבולים, יתרות ומסמכים. הצוות לא רואה כלום.",
  },
  {
    id: "events",
    size: "wide",
    title: "אירועים ואישורי הגעה",
    text: "מסיבת חנוכה? ההורים מאשרים הגעה והמנהלת רואה כמה מגיעים.",
  },
] as const;
