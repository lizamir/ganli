"use client";

import { useState } from "react";
import type { Booking as BookingType } from "@/lib/automations/types";
import BookingDone from "./BookingDone";
import BookingForm from "./BookingForm";

/** Book a 30-minute meeting with the director: pick a free slot, then add it to your calendar and confirm on WhatsApp. */
export default function Booking() {
  const [done, setDone] = useState<BookingType | null>(null);

  return (
    <section className="section meet" id="meet" aria-labelledby="meet-title">
      <div className="container meet-grid">
        <div className="reveal">
          <p className="eyebrow">
            <b>(07)</b> פגישה עם המנהלת
          </p>
          <h2 id="meet-title" className="title">
            קובעים פגישה
            <br />
            <span className="serif ink-tomato">בלי טלפונים</span>.
          </h2>
          <p className="lead" style={{ marginTop: 20 }}>
            בוחרים זמן פנוי, ומקבלים זימון ליומן ותזכורת יום לפני. המנהלת רואה את הפגישה מיד באזור האישי.
          </p>
          <ul className="meet-how">
            <li>
              <b>1</b> בוחרים יום ושעה פנויים
            </li>
            <li>
              <b>2</b> מוסיפים ליומן בלחיצה
            </li>
            <li>
              <b>3</b> שולחים אישור בוואטסאפ
            </li>
          </ul>
        </div>

        <div className="meet-card form reveal" aria-live="polite">
          {done ? <BookingDone done={done} onAnother={() => setDone(null)} /> : <BookingForm onBooked={setDone} />}
        </div>
      </div>
    </section>
  );
}
