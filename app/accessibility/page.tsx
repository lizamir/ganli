import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Shapes";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = {
  title: "הצהרת נגישות | גנלי",
  description: "הצהרת הנגישות של אתר גנלי: מה עשינו, מה הגבלות ואיך פונים אלינו.",
};

export default function AccessibilityStatement() {
  return (
    <div className="legal">
      <header className="legal-head">
        <div className="container">
          <Link href="/" className="logo" aria-label="גנלי — לדף הבית">
            <LogoMark />
            <span className="logo-word">
              <b>גנלי</b>
            </span>
          </Link>
          <Link href="/" className="btn btn-ghost btn-sm">
            חזרה לאתר
          </Link>
        </div>
      </header>

      <main id="main" className="container legal-body">
        <p className="eyebrow">הצהרת נגישות</p>
        <h1 className="title">אתר שנגיש לכולם</h1>
        <p className="lead">
          אנחנו רוצים שכל הורה, בכל גיל וביכולת, יוכל לראות את היום של הילד שלו ולהירשם לגן. לכן בנינו את האתר והאזור האישי עם נגישות
          בראש מעייניי העיצוב.
        </p>

        <section>
          <h2>מה עשינו</h2>
          <ul>
            <li>האתר נבנה בעברית, מימין לשמאל, עם מבנה כותרות ותוויות ברורים וקישור &quot;דילוג לתוכן הראשי&quot;.</li>
            <li>ניגודיות הצבעים בטקסטים נבדקה מול רמה AA של תקן WCAG 2.1 (יחס של 4.5:1 לפחות לטקסט רגיל).</li>
            <li>אפשר לנווט בכל האתר במקלדת בלבד, עם סימון מיקוד ברור. אזורי לחיצה בגודל 44 פיקסלים לפחות.</li>
            <li>תפריט הנגישות בפינת המסך מאפשר להגדיל טקסט, להפעיל ניגודיות גבוהה, להדגיש קישורים, להגדיל ריווח ולעצור אנימציות.</li>
            <li>האתר מכבד את הגדרת &quot;הפחתת תנועה&quot; של המכשיר. הגלילה החלקה והאנימציות נעצרות, והמידע זהה.</li>
            <li>תוכן שמופיע רק באנימציה, כגון הטירה התלת־ממדית, מתואר גם בטקסט לקוראי מסך.</li>
            <li>האתר מותאם לטלפון, לטאבלט ולמחשב, ומתאים להגדלת טקסט עד 200%.</li>
          </ul>
        </section>

        <section>
          <h2>מגבלות ידועות</h2>
          <ul>
            <li>הצהרה זו נכתבה לאתר ההדגמה. לפני הפעלה אמיתית יש לבצע בדיקת נגישות מקצועית (כולל קורא מסך) ולמלא את פרטי רכז/ת הנגישות.</li>
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
