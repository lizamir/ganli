"use client";

import { cn } from "@/lib/ui/cn";
import { section } from "@/components/site/ui";
import { useState } from "react";
import type { Booking as BookingType } from "@/lib/automations/types";
import BookingDone from "./BookingDone";
import BookingForm from "./BookingForm";
import { formPanel } from "@/components/site/form";

const step = "flex items-center gap-[14px]";
const stepNo = "grid h-[34px] w-[34px] flex-none place-items-center rounded-[50%] bg-teal-deep text-cream";

/** Book a 30-minute meeting with the director: pick a free slot, then add it to your calendar and confirm on WhatsApp. */
export default function Booking() {
  const [done, setDone] = useState<BookingType | null>(null);

  return (
    <section className={cn(section, "pb-[40px] mobile:pb-[40px]")} id="meet" aria-labelledby="meet-title">
      <div className="container grid grid-cols-[1fr_1.1fr] [align-items:start] gap-[clamp(28px,5vw,70px)] mobile:grid-cols-[1fr]">
        <div className="reveal">
          <p className="eyebrow">
            <b>(07)</b> פגישה עם המנהלת
          </p>
          <h2 id="meet-title" className="title">
            קובעים פגישה
            <br />
            <span className="serif ink-tomato">בלי טלפונים</span>.
          </h2>
          <p className="lead mt-5">
            בוחרים זמן פנוי, ומקבלים זימון ליומן ותזכורת יום לפני. המנהלת רואה את הפגישה מיד באזור האישי.
          </p>
          <ul className="[margin:28px_0_0] grid list-none gap-3 p-0 text-[1.08rem]">
            <li className={step}>
              <b className={stepNo}>1</b> בוחרים יום ושעה פנויים
            </li>
            <li className={step}>
              <b className={stepNo}>2</b> מוסיפים ליומן בלחיצה
            </li>
            <li className={step}>
              <b className={stepNo}>3</b> שולחים אישור בוואטסאפ
            </li>
          </ul>
        </div>

        <div className={cn(formPanel, "reveal shadow-block [border:2px_solid_var(--sand)]")} aria-live="polite">
          {done ? <BookingDone done={done} onAnother={() => setDone(null)} /> : <BookingForm onBooked={setDone} />}
        </div>
      </div>
    </section>
  );
}
