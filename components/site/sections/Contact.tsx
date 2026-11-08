import { cn } from "@/lib/ui/cn";
import { section } from "@/components/site/ui";
import { LogoMark } from "@/components/common/Shapes";
import { CONTACT } from "@/content";
import ContactForm from "./ContactForm";

const infoRow = "flex items-center gap-4 text-[1.15rem]";
const infoIcon =
  "grid h-[46px] w-[46px] flex-none place-items-center rounded-[14px] bg-[rgba(255,255,255,0.12)] not-italic";

/** The last section of the marketing site: contact details and the enrollment form. */
export default function Contact() {
  return (
    <section className={cn(section, "pb-[60px]")} id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="relative grid grid-cols-[1fr_1fr] gap-[70px] overflow-hidden rounded-[56px] bg-teal-deep p-20 text-cream mobile:grid-cols-[1fr] mobile:gap-10 mobile:rounded-[36px] mobile:px-[22px] mobile:py-10">
          <div className="reveal">
            <p className="eyebrow text-mustard-soft [&_b]:text-mustard">
              <b>(08)</b> בואו להכיר
            </p>
            <h2 id="contact-title" className="title text-cream">
              מוזמנים לסיור
              <br />
              <span className="serif text-mustard-soft">בבית השני</span> שלנו.
            </h2>
            <p className="lead mt-[22px] text-[#d3ecea]">
              השאירו פרטים ונחזור אליכם לתיאום ביקור בגן. בסיור תכירו את הצוות, את המרחבים ואת האפליקציה.
            </p>
            <ul className="mt-10 grid list-none gap-4 p-0">
              <li className={infoRow}>
                <i aria-hidden="true" className={infoIcon}>
                  ☎
                </i>
                <a href={CONTACT.phoneHref}>
                  <bdi className="[direction:ltr]">{CONTACT.phone}</bdi>
                </a>
              </li>
              <li className={infoRow}>
                <i aria-hidden="true" className={infoIcon}>
                  ⌂
                </i>
                <span>{CONTACT.address}</span>
              </li>
              <li className={infoRow}>
                <i aria-hidden="true" className={infoIcon}>
                  ◷
                </i>
                <span>{CONTACT.hours}</span>
              </li>
            </ul>
          </div>

          <ContactForm />
          <LogoMark className="absolute start-[-30px] bottom-[-30px] w-[240px] opacity-[0.14]" />
        </div>
      </div>
    </section>
  );
}
