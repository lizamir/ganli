import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark, LogoWord, logoLink } from "@/components/common/Shapes";
import { CONTACT } from "@/content";

export const metadata: Metadata = {
  title: "הצהרת נגישות | גנלי",
  description: "הצהרת הנגישות של אתר גנלי: מה עשינו, מה הגבלות ואיך פונים אלינו.",
};

/** The accessibility statement page. */
export default function AccessibilityStatement() {
  return (
    <div className="min-h-[100vh] bg-cream">
      <header className="border-b border-b-sand py-[18px]">
        <div className="container flex items-center justify-between">
          <Link href="/" className={logoLink} aria-label="גנלי — לדף הבית">
            <LogoMark />
            <LogoWord tagline={false} />
          </Link>
          <Link href="/" className="btn btn-ghost btn-sm">
            חזרה לאתר
          </Link>
        </div>
      </header>

      <main
        id="main"
        className="container grid max-w-[760px] gap-[34px] [padding:70px_0_110px] [&_a]:text-teal-deep [&_a]:underline [&_a]:underline-offset-[0.2em] [&_h2]:mb-3 [&_h2]:text-[1.7rem] [&_ul]:grid [&_ul]:gap-2.5 [&_ul]:ps-[22px]"
      >
        <p className="eyebrow">הצהרת נגישות</p>
        <h1 className="title m-0">אתר שנגיש לכולם</h1>
        <p className="lead">
          אנחנו רוצים שכל הורה, בכל גיל וביכולת, יוכל לראות את היום של הילד שלו ולהירשם לגן. לכן בנינו את האתר והאזור
          האישי עם נגישות בראש מעייניי העיצוב.
        </p>

        <section>
          <h2>מה עשינו</h2>
          <ul>
            <li>האתר נבנה בעברית, מימין לשמאל, עם מבנה כותרות ותוויות ברורים וקישור &quot;דילוג לתוכן הראשי&quot;.</li>
            <li>ניגודיות הצבעים בטקסטים נבדקה מול רמה AA של תקן WCAG 2.1 (יחס של 4.5:1 לפחות לטקסט רגיל).</li>
            <li>אפשר לנווט בכל האתר במקלדת בלבד, עם סימון מיקוד ברור. אזורי לחיצה בגודל 44 פיקסלים לפחות.</li>
            <li>
              תפריט הנגישות בפינת המסך מאפשר להגדיל טקסט, להפעיל ניגודיות גבוהה, להדגיש קישורים, להגדיל ריווח ולעצור
              אנימציות.
            </li>
            <li>האתר מכבד את הגדרת &quot;הפחתת תנועה&quot; של המכשיר. הגלילה החלקה והאנימציות נעצרות, והמידע זהה.</li>
            <li>תוכן שמופיע רק באנימציה, כגון הטירה התלת־ממדית, מתואר גם בטקסט לקוראי מסך.</li>
            <li>האתר מותאם לטלפון, לטאבלט ולמחשב, ומתאים להגדלת טקסט עד 200%.</li>
          </ul>
        </section>

        <section>
          <h2>מגבלות ידועות</h2>
          <ul>
            <li>
              הצהרה זו נכתבה לאתר ההדגמה. לפני הפעלה אמיתית יש לבצע בדיקת נגישות מקצועית (כולל קורא מסך) ולמלא את פרטי
              רכז/ת הנגישות.
            </li>
            <li>סריקת קוד QR לאיסוף עדיין לא זמינה במצלמה, ולכן האימות מתבצע בהקלדת הקוד.</li>
            <li>תמונות בדמו הן איורים. באתר אמיתי יתווסף לכל תמונה טקסט חלופי.</li>
          </ul>
        </section>

        <section>
          <h2>פנייה בנושא נגישות</h2>
          <p>נתקלתם בקושי? נשמח לשמוע ולתקן. פרטי הקשר כאן הם דוגמה עד שיוזנו הפרטים האמיתיים של הגן.</p>
          <ul>
            <li>
              טלפון:{" "}
              <a href={CONTACT.phoneHref}>
                <bdi>{CONTACT.phone}</bdi>
              </a>
            </li>
            <li>כתובת: {CONTACT.address}</li>
            <li>עדכון אחרון של ההצהרה: אוקטובר 2026</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
