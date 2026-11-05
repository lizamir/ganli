const KEYWORDS: [string, string][] = [
  ["אגוז", "nuts"],
  ["בוטנ", "nuts"],
  ["שקד", "nuts"],
  ["חלב", "milk"],
  ["לקטוז", "milk"],
  ["ביצ", "egg"],
  ["גלוטן", "gluten"],
  ["קמח", "gluten"],
  ["חיטה", "gluten"],
  ["שומשום", "sesame"],
  ["טחינה", "sesame"],
];

/** Maps free-text allergy notes ("אלרגיה לאגוזים") to the allergen ids used in the menu. */
export function allergensOf(text: string): string[] {
  const found = new Set<string>();
  for (const [kw, id] of KEYWORDS) if (text.includes(kw)) found.add(id);
  return [...found];
}
