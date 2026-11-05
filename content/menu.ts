// The weekly menu and its allergens.

export const MENU = {
  // Allergens: nuts, milk, egg, gluten, sesame
  days: [
    {
      day: "ראשון",
      morning: { name: "דייסת שיבולת שועל עם בננה", allergens: ["gluten"] },
      lunch: { name: "אורז, עדשים וירקות מאודים", allergens: [] },
      snack: { name: "פרוסות תפוח וגבינה לבנה", allergens: ["milk"] },
    },
    {
      day: "שני",
      morning: { name: "לחם מלא עם אבוקדו", allergens: ["gluten"] },
      lunch: { name: "פסטה ברוטב עגבניות ובשר טחון", allergens: ["gluten"] },
      snack: { name: "עוגיות שקדים ביתיות", allergens: ["nuts", "gluten"] },
    },
    {
      day: "שלישי",
      morning: { name: "חביתה ופרוסת מלפפון", allergens: ["egg"] },
      lunch: { name: "עוף בתנור, תפוח אדמה וגזר", allergens: [] },
      snack: { name: "יוגורט ופירות", allergens: ["milk"] },
    },
    {
      day: "רביעי",
      morning: { name: "קורנפלקס מלא עם חלב", allergens: ["gluten", "milk"] },
      lunch: { name: "מרק ירקות ופתיתים", allergens: ["gluten"] },
      snack: { name: "חומוס וטחינה עם מקלות ירקות", allergens: ["sesame"] },
    },
    {
      day: "חמישי",
      morning: { name: "פנקייק בננה", allergens: ["egg", "gluten"] },
      lunch: { name: "דג בתנור וקוסקוס", allergens: ["gluten"] },
      snack: { name: "פירות העונה", allergens: [] },
    },
  ],
  allergenNames: { nuts: "אגוזים", milk: "חלב", egg: "ביצים", gluten: "גלוטן", sesame: "שומשום" } as Record<
    string,
    string
  >,
};
