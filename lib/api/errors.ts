/** Turns a server error into a message a parent or staff member can act on. */
export function hebrewError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "דוא״ל או סיסמה שגויים";
  if (m.includes("password") && m.includes("characters")) return "הסיסמה קצרה מדי (לפחות 6 תווים)";
  if (m.includes("confirm")) return "יש לאשר את כתובת הדוא״ל דרך המייל שנשלח";
  if (m.includes("network") || m.includes("fetch")) return "אין חיבור לשרת. בדקו את החיבור ונסו שוב";
  if (m.includes("row-level security") || m.includes("permission") || m.includes("not allowed"))
    return "אין לך הרשאה לפעולה הזו";
  return "משהו השתבש. נסו שוב";
}
