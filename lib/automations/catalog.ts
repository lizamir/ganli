/** The automations the director can switch on and off: what triggers each one and what it does. */
export const AUTOMATIONS = [
  {
    id: "lead",
    trigger: "פנייה חדשה מהאתר",
    action: "הודעת וואטסאפ למנהלת עם הפרטים, ומענה אוטומטי להורה שהפנייה התקבלה.",
  },
  { id: "meeting", trigger: "נקבעה פגישה עם המנהלת", action: "זימון ליומן להורה ולמנהלת, ותזכורת בוואטסאפ יום לפני." },
  { id: "signup", trigger: "רשימת הרשמה דחופה", action: "תזכורת להורים שעוד לא נרשמו, יומיים ושעה לפני הסגירה." },
  { id: "summary", trigger: "סוף יום בגן (16:00)", action: "סיכום יומי להורה: ארוחות, שינה ותמונה אחת." },
  { id: "payment", trigger: "תשלום שעבר את מועדו", action: "תזכורת עדינה להורה עם קישור לתשלום, ועדכון בדוח הכספים." },
];
