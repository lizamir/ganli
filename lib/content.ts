// All copy for the site lives here, so it can be swapped for the real
// daycare details (from the beyachad-daycare repo) without touching layout.
// TODO: replace placeholder contact details, hours and FAQ with the real ones.

export const BRAND = {
  name: "גנלי",
  tagline: "משחקים. לומדים. ביחד.",
  latin: "PLAY & LEARN",
};

export const NAV = [
  { href: "#story", label: "הגישה שלנו" },
  { href: "#day", label: "יום בגן" },
  { href: "#groups", label: "הקבוצות" },
  { href: "#app", label: "האפליקציה" },
  { href: "#faq", label: "שאלות" },
];

export const HERO = {
  eyebrow: "גן ומעון לגיל הרך · ירושלים",
  stats: [
    { value: "6 ח׳–3", label: "גילאי הגן" },
    { value: "3", label: "קבוצות גיל" },
    { value: "1:4", label: "צוות לילדים בתינוקייה" },
  ],
};

/** Scrollytelling chapters. `from` is where each chapter starts on the 0..1 scroll axis of the story section. */
export const STORY = [
  {
    from: 0,
    no: "01",
    title: ["קודם כל,", "יסודות."],
    accent: "יסודות",
    text: "קבוצות קטנות, צוות קבוע ושגרה ברורה. ילד שמרגיש בטוח מרשה לעצמו לגלות, לנסות ולטעות.",
    points: ["עד 4 תינוקות למטפלת", "שגרה קבועה ורגועה", "פרידה רכה בבוקר"],
    color: "var(--teal-soft)",
  },
  {
    from: 0.27,
    no: "02",
    title: ["קיר אחרי קיר,", "לומדים דרך משחק."],
    accent: "משחק",
    text: "קוביות, חול, מים וצבע. כל משחק הוא הזדמנות לגלות, לספור, לדבר ולהצליח בקצב של הילד.",
    points: ["חצר מוצלת עם ארגז חול", "פינות משחק מתחלפות", "יצירה כל יום"],
    color: "var(--mustard-soft)",
  },
  {
    from: 0.5,
    no: "03",
    title: ["קשת פתוחה", "להורים."],
    accent: "להורים",
    text: "עדכון יומי עם תמונות, יומן ארוחות ושינה, שיחות אישיות ודלת פתוחה. אתם חלק מהבנייה.",
    points: ["אפליקציה להורים", "עדכון בזמן אמת", "שיחות הורים פעמיים בשנה"],
    color: "var(--blush-soft)",
  },
  {
    from: 0.72,
    no: "04",
    title: ["גג של", "סקרנות."],
    accent: "סקרנות",
    text: "מוזיקה, טבע, ספרים ושאלות בלי סוף. פינות למידה שמתחלפות ומזמינות לחקור.",
    points: ["מפגשי בוקר עם שירים", "ספרייה וסיפורים", "יציאות לטבע"],
    color: "var(--lilac-soft)",
  },
  {
    from: 0.88,
    no: "05",
    title: ["ובסוף,", "כוכבים."],
    accent: "כוכבים",
    text: "חוגגים כל רגע גדול: צעדים ראשונים, מילה חדשה, ציור ראשון. וכל רגע כזה מגיע אליכם עם תמונה.",
    points: ["״רגעים גדולים״ באפליקציה", "ימי הולדת בגן", "מדבקת סוף יום"],
    color: "var(--mustard-soft)",
  },
] as const;

export const DAY = [
  { time: "07:30", title: "קבלת בוקר", text: "משחק חופשי ופרידה רכה מההורים" },
  { time: "08:30", title: "ארוחת בוקר", text: "ארוחה מזינה שמוכנה במטבח הגן" },
  { time: "09:15", title: "מפגש בוקר", text: "שירים, סיפור ושיחה על היום" },
  { time: "10:00", title: "חצר ותנועה", text: "טיפוס, ארגז חול ומשחקי מים" },
  { time: "11:30", title: "ארוחת צהריים", text: "אוכל ביתי חם ומבושל במקום" },
  { time: "12:30", title: "מנוחה", text: "שינת צהריים בחדר שקט וחשוך" },
  { time: "15:00", title: "פעילות אחה״צ", text: "יצירה, מוזיקה וחוגים מתחלפים" },
  { time: "16:30", title: "להתראות!", text: "איסוף וסיכום קצר של היום" },
];

export const GROUPS = [
  {
    name: "קוביות",
    ages: "6–15 חודשים",
    from: "6",
    color: "blush",
    text: "תינוקייה רגועה עם מגע אישי, שגרת שינה ואכילה מותאמת לכל תינוק וחקירה חושית ראשונה.",
    points: ["עד 4 תינוקות למטפלת", "חדר שינה נפרד", "יומן יומי להורים"],
  },
  {
    name: "מגדלים",
    ages: "15–24 חודשים",
    from: "15",
    color: "teal",
    text: "צעדים ראשונים לעצמאות: אכילה לבד, מילים חדשות, משחק משותף וגבולות בחום.",
    points: ["פינות משחק מתחלפות", "תחילת גמילה בליווי", "חוג מוזיקה ותנועה"],
  },
  {
    name: "טירות",
    ages: "2–3 שנים",
    from: "24",
    color: "mustard",
    text: "מוכנים לגן: מפגשי קבוצה, יצירה, שפה עשירה והרבה דמיון שמתחיל להתעורר.",
    points: ["מפגשים בנושאים שבועיים", "פרויקטים של יצירה", "הכנה רכה לגן חובה"],
  },
] as const;

export const SPACES = [
  { title: "חצר משחקים מוצלת", text: "מתקני טיפוס, ארגז חול ופינת מים בטוחה", color: "teal" },
  { title: "מטבח ביתי", text: "ארוחות טריות שמבושלות כל בוקר במקום", color: "tomato" },
  { title: "חדר יצירה", text: "צבעים, חומרים ממוחזרים ודמיון בלי גבולות", color: "mustard" },
  { title: "פינת ספרייה", text: "ספרים, בובות וסיפורים לפני המנוחה", color: "blush" },
] as const;

/** The feature wall for the app section. Researched against daycare apps such as Brightwheel,
 *  Famly, Lillio/HiMama and Daily Connect: QR pickup, menus with allergy flags, enrollment, two-way messaging. */
export const FEATURES = [
  { id: "pickup", size: "wide", title: "איסוף בקוד אישי", text: "להורה קוד איסוף יומי (QR) ורשימת מורשים. הצוות סורק, רואה מי מאושר, והיציאה נרשמת בשנייה." },
  { id: "menu", size: "tall", title: "תפריט שבועי עם אלרגיות", text: "כל מנה מסומנת. אם משהו לא מתאים לילד, ההורה והצוות רואים אזהרה לפני הארוחה." },
  { id: "summary", size: "normal", title: "סיכום יום אוטומטי", text: "מהיומן נבנה משפט אחד חם: מה אכל, כמה ישן ומה עשה." },
  { id: "live", size: "normal", title: "עדכון בזמן אמת", text: "הצוות מעדכן, ההורה רואה. בלי להמתין לערב." },
  { id: "albums", size: "normal", title: "אלבומים עם הסכמה", text: "תמונות קבוצתיות ואלבום פרטי. הורה בוחר מה נשמר." },
  { id: "inbox", size: "wide", title: "פניות והיעדרויות", text: "הורה שולח הודעה או מדווח על היעדרות בלחיצה. המנהלת רואה ועונה, והצוות מתעדכן." },
  { id: "money", size: "normal", title: "כספים בלי כאב ראש", text: "חיובים, תקבולים, יתרות ומסמכים. הצוות לא רואה כלום." },
  { id: "events", size: "wide", title: "אירועים ואישורי הגעה", text: "מסיבת חנוכה? ההורים מאשרים הגעה והמנהלת רואה כמה מגיעים." },
] as const;

export const MENU = {
  // Allergens: nuts, milk, egg, gluten, sesame
  days: [
    { day: "ראשון", morning: { name: "דייסת שיבולת שועל עם בננה", allergens: ["gluten"] }, lunch: { name: "אורז, עדשים וירקות מאודים", allergens: [] }, snack: { name: "פרוסות תפוח וגבינה לבנה", allergens: ["milk"] } },
    { day: "שני", morning: { name: "לחם מלא עם אבוקדו", allergens: ["gluten"] }, lunch: { name: "פסטה ברוטב עגבניות ובשר טחון", allergens: ["gluten"] }, snack: { name: "עוגיות שקדים ביתיות", allergens: ["nuts", "gluten"] } },
    { day: "שלישי", morning: { name: "חביתה ופרוסת מלפפון", allergens: ["egg"] }, lunch: { name: "עוף בתנור, תפוח אדמה וגזר", allergens: [] }, snack: { name: "יוגורט ופירות", allergens: ["milk"] } },
    { day: "רביעי", morning: { name: "קורנפלקס מלא עם חלב", allergens: ["gluten", "milk"] }, lunch: { name: "מרק ירקות ופתיתים", allergens: ["gluten"] }, snack: { name: "חומוס וטחינה עם מקלות ירקות", allergens: ["sesame"] } },
    { day: "חמישי", morning: { name: "פנקייק בננה", allergens: ["egg", "gluten"] }, lunch: { name: "דג בתנור וקוסקוס", allergens: ["gluten"] }, snack: { name: "פירות העונה", allergens: [] } },
  ],
  allergenNames: { nuts: "אגוזים", milk: "חלב", egg: "ביצים", gluten: "גלוטן", sesame: "שומשום" } as Record<string, string>,
};

export const FAQ = [
  {
    q: "מתי אפשר להירשם לשנה הבאה?",
    a: "ההרשמה נפתחת בכל שנה בחודש פברואר. מומלץ לתאם סיור מוקדם, כי מספר המקומות בכל קבוצה מוגבל.",
  },
  {
    q: "איך נראית תקופת ההסתגלות?",
    a: "בשבוע הראשון ההורים מלווים את הילד בגן, וזמן השהייה מתארך בהדרגה בהתאם לקצב שלו.",
  },
  {
    q: "מה הילדים אוכלים?",
    a: "כל הארוחות מבושלות במטבח הגן, ומתאימות לרגישויות ולהעדפות תזונתיות לפי בקשת ההורים. התפריט השבועי מופיע באפליקציה, עם סימון אלרגנים.",
  },
  {
    q: "איך מתעדכנים במה שקרה בגן?",
    a: "בכל יום נשלח עדכון עם תמונות, ובאפליקציה רואים בזמן אמת ארוחות, שינה והחלפות. בנוסף מתקיימות שיחות הורים אישיות פעמיים בשנה.",
  },
  {
    q: "מי רשאי לאסוף את הילד?",
    a: "רק מי שהוגדר מראש כמורשה איסוף. בכל יום ההורה מקבל קוד איסוף אישי, והצוות מאמת אותו לפני שהילד יוצא.",
  },
];

export const CONTACT = {
  // Placeholders until the real details are added.
  phone: "050-000-0000",
  phoneHref: "tel:+972500000000",
  address: "רחוב הדוגמה 1, ירושלים",
  hours: "א׳–ה׳, 07:30 עד 16:30",
};
