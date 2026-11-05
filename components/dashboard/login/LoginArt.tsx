import Link from "next/link";
import { LogoMark, Star } from "@/components/common/Shapes";

/** The colored half of the login page. */
export default function LoginArt() {
  return (
    <aside className="login-art" aria-label="על גנלי">
      <Link href="/" className="login-back">
        ← חזרה לאתר
      </Link>
      <div className="login-art-inner">
        <LogoMark className="login-mark" />
        <h2>
          הגן שלי,
          <br />
          <em>כל היום.</em>
        </h2>
        <p>מה אכלו, כמה ישנו ומה עשו היום. הכל במקום אחד, להורים, לצוות ולמנהלת.</p>
      </div>
      <Star className="login-star s1" color="var(--mustard)" />
      <Star className="login-star s2" color="var(--teal)" />
      <Star className="login-star s3" color="var(--blush)" />
    </aside>
  );
}
