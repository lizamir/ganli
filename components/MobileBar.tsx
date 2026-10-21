import { CONTACT } from "@/lib/content";

/** Sticky call-to-action for phones: a parent browsing on mobile can call or book a tour in one tap. */
export default function MobileBar() {
  return (
    <nav className="mobile-bar" aria-label="יצירת קשר מהירה">
      <a className="btn btn-ghost btn-sm" href={CONTACT.phoneHref}>
        התקשרו
      </a>
      <a className="btn btn-primary btn-sm" href="#contact">
        תיאום סיור
      </a>
    </nav>
  );
}
