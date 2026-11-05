import { LogoMark } from "@/components/common/Shapes";
import { CONTACT } from "@/content";
import ContactForm from "./ContactForm";

/** The last section of the marketing site: contact details and the enrollment form. */
export default function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact-card">
          <div className="contact-copy reveal">
            <p className="eyebrow">
              <b>(08)</b> בואו להכיר
            </p>
            <h2 id="contact-title" className="title">
              מוזמנים לסיור
              <br />
              <span className="serif">בבית השני</span> שלנו.
            </h2>
            <p className="lead">
              השאירו פרטים ונחזור אליכם לתיאום ביקור בגן. בסיור תכירו את הצוות, את המרחבים ואת האפליקציה.
            </p>
            <ul className="contact-info">
              <li>
                <i aria-hidden="true">☎</i>
                <a href={CONTACT.phoneHref}>
                  <bdi>{CONTACT.phone}</bdi>
                </a>
              </li>
              <li>
                <i aria-hidden="true">⌂</i>
                <span>{CONTACT.address}</span>
              </li>
              <li>
                <i aria-hidden="true">◷</i>
                <span>{CONTACT.hours}</span>
              </li>
            </ul>
          </div>

          <ContactForm />
          <LogoMark className="contact-deco" />
        </div>
      </div>
    </section>
  );
}
