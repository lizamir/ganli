import Link from "next/link";
import { LogoMark } from "@/components/common/Shapes";
import { CONTACT, NAV } from "@/content";

/** The marketing site footer. */
export default function Footer() {
  return (
    <footer className="overflow-hidden bg-cocoa-deep pt-[90px] pb-[40px] text-side-text mobile:pb-[110px] [&_a]:text-side-text [&_a:hover]:text-white [&_a:hover]:underline [&_a:hover]:underline-offset-[0.2em]">
      <div className="container">
        <div className="grid grid-cols-[1.2fr_1fr_1fr] [align-items:start] gap-10 mobile:grid-cols-[1fr]">
          <div className="[&_svg]:w-[70px]">
            <LogoMark />
            <p className="mt-[14px] text-cream [font:800_1.4rem/1.2_var(--font-display)]">משחקים. לומדים. ביחד.</p>
          </div>
          <nav aria-label="קישורים בתחתית העמוד">
            <ul className="grid list-none gap-2 p-0">
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
          <address className="grid gap-2 not-italic">
            <a href={CONTACT.phoneHref}>
              <bdi>{CONTACT.phone}</bdi>
            </a>
            <span>{CONTACT.address}</span>
            <span>{CONTACT.hours}</span>
          </address>
        </div>
        <p
          className="[margin:60px_0_10px] text-center tracking-[-0.07em] text-transparent select-none [-webkit-text-stroke:2px_rgba(255,255,255,0.14)] [font:900_clamp(8rem,30vw,26rem)/0.8_var(--font-display)]"
          aria-hidden="true"
        >
          גנלי
        </p>
        <div className="flex flex-wrap justify-between gap-5 border-t border-t-[rgba(255,255,255,0.14)] pt-[26px] text-[0.92rem]">
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
