"use client";

import { useState } from "react";
import { FAQ } from "@/lib/content";

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="container faq-grid">
        <div className="reveal">
          <p className="eyebrow">
            <b>(06)</b> שאלות נפוצות
          </p>
          <h2 id="faq-title" className="title">
            יש לכם שאלות?
            <br />
            <span className="serif ink-tomato">יש לנו</span> תשובות.
          </h2>
          <p className="lead" style={{ marginTop: 20 }}>
            ואם לא מצאתם כאן את מה שחיפשתם, נשמח לדבר איתכם אישית.
          </p>
        </div>
        <div className="faq-list">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className="reveal" key={item.q} style={{ ["--d" as string]: i }}>
                <div className={`faq-item${isOpen ? " open" : ""}`}>
                <h3>
                  <button type="button" aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                    {item.q}
                    <i aria-hidden="true">+</i>
                  </button>
                </h3>
                <div className="faq-answer" id={`faq-${i}`} role="region" aria-label={item.q}>
                  <div>
                    <p>{item.a}</p>
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
