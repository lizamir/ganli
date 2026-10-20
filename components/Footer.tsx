import Link from "next/link";
import { LogoMark } from "./Shapes";
import { CONTACT, NAV } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <LogoMark />
            <p>משחקים. לומדים. ביחד.</p>
          </div>
          <nav aria-label="קישורים בתחתית העמוד">
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
              <li>
                <Link href="/login/">כניסה לאזור האישי</Link>
              </li>
              <li>
                <Link href="/accessibility/">הצהרת נגישות</Link>
              </li>
            </ul>
          </nav>
          <address>
            <a href={CONTACT.phoneHref}>
              <bdi>{CONTACT.phone}</bdi>
            </a>
            <span>{CONTACT.address}</span>
            <span>{CONTACT.hours}</span>
          </address>
        </div>
        <p className="footer-word" aria-hidden="true">
          גנלי
        </p>
        <div className="footer-bottom">
          <span>© גנלי · משחקים. לומדים. ביחד.</span>
          <span>
            עיצוב ופיתוח:{" "}
            <a href="https://github.com/lizamir" target="_blank" rel="noreferrer">
              Liz Code &amp; Color
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
