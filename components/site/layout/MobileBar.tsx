import { CONTACT } from "@/content";

/** Sticky call-to-action for phones: a parent browsing on mobile can call or book a tour in one tap. */
export default function MobileBar() {
  return (
    <nav
      className="hidden mobile:fixed mobile:inset-x-0 mobile:bottom-0 mobile:z-70 mobile:flex mobile:gap-2.5 mobile:bg-[rgba(255,253,248,0.92)] mobile:[padding:10px_14px_calc(10px+env(safe-area-inset-bottom))] mobile:shadow-[0_-10px_30px_-16px_rgba(62,50,43,0.45)] mobile:[backdrop-filter:blur(14px)] touch:bg-paper touch:[backdrop-filter:none]"
      aria-label="יצירת קשר מהירה"
    >
      <a className="btn btn-ghost btn-sm mobile:flex-1" href={CONTACT.phoneHref}>
        התקשרו
      </a>
      <a className="btn btn-primary btn-sm mobile:flex-1" href="#contact">
        תיאום סיור
      </a>
    </nav>
  );
}
