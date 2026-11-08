"use client";

import { useState } from "react";
import { FAQ } from "@/content";
import { cn } from "@/lib/ui/cn";
import { section } from "@/components/site/ui";

/** Questions parents ask. */
export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className={section} id="faq" aria-labelledby="faq-title">
      <div className="container grid grid-cols-[0.9fr_1.1fr] [align-items:start] gap-20 mobile:grid-cols-[1fr] mobile:gap-9">
        <div className="reveal">
          <p className="eyebrow">
            <b>(06)</b> שאלות נפוצות
          </p>
          <h2 id="faq-title" className="title">
            יש לכם שאלות?
            <br />
            <span className="serif ink-tomato">יש לנו</span> תשובות.
          </h2>
          <p className="lead mt-5">ואם לא מצאתם כאן את מה שחיפשתם, נשמח לדבר איתכם אישית.</p>
        </div>
        <div className="grid gap-[14px]">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className="reveal" key={item.q} style={{ ["--d" as string]: i }}>
                <div className="faq-item overflow-hidden rounded-[26px] bg-paper shadow-block">
                  <h3 className="tracking-[0] [font:inherit]">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex min-h-[64px] w-full items-center justify-between gap-5 px-7 py-6 text-right tracking-[-0.02em] text-cocoa-deep [background:none] [border:0] [font:800_1.3rem/1.3_var(--font-display)] mobile:px-5 mobile:py-[18px] mobile:text-[1.12rem]"
                    >
                      {item.q}
                      <i
                        aria-hidden="true"
                        className={cn(
                          "grid h-[38px] w-[38px] flex-none place-items-center rounded-[12px] text-[1.4rem] not-italic [transition:transform_0.3s_var(--ease-spring),background_0.3s]",
                          isOpen ? "[transform:rotate(45deg)] bg-mustard" : "bg-sand",
                        )}
                      >
                        +
                      </i>
                    </button>
                  </h3>
                  <div
                    className={cn(
                      "grid [transition:grid-template-rows_0.4s_var(--ease-out)]",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                    id={`faq-${i}`}
                    role="region"
                    aria-label={item.q}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="px-7 pb-[26px] text-muted">{item.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
