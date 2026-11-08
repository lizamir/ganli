"use client";

import { cn } from "@/lib/ui/cn";
import { section } from "@/components/site/ui";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useMotionOff } from "@/lib/stores/a11y";

const step = "flex items-center gap-[14px]";
const stepNo = "grid h-[34px] w-[34px] flex-none place-items-center rounded-[50%] bg-cocoa-deep text-[1rem] text-cream";
const chatBubble = "w-fit rounded-[18px] px-4 py-2.5 text-[1rem] leading-[1.4] shadow-[0_3px_0_rgba(62,50,43,0.1)]";

/**
 * The pickup tag: a child's card that hangs from a cord, swings like a pendulum, can be dragged and let go,
 * and flips to show who is allowed to collect. It is the one object the whole "safe pickup" feature is about.
 */
export default function Pickup() {
  const rig = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [qr, setQr] = useState("");
  const motionOff = useMotionOff();
  const sim = useRef({ a: 12, w: 0, drag: false, raf: 0, last: 0, moved: 0, kick: () => {} });

  useEffect(() => {
    QRCode.toString("GANLI-DEMO-NOA-4821", { type: "svg", margin: 0, color: { dark: "#3e322b", light: "#0000" } }).then(
      setQr,
    );
  }, []);

  useEffect(() => {
    const el = rig.current;
    const s = sim.current;
    if (!el) return;
    if (motionOff) {
      el.style.transform = "none";
      return;
    }
    const step = (t: number) => {
      const dt = Math.min(0.032, (t - s.last) / 1000 || 0.016);
      s.last = t;
      if (!s.drag) {
        s.w += (-20 * s.a - 1.0 * s.w) * dt;
        s.a += s.w * dt;
      }
      el.style.transform = `rotate(${s.a.toFixed(3)}deg)`;
      if (!s.drag && Math.abs(s.a) < 0.03 && Math.abs(s.w) < 0.03) {
        s.a = 0;
        el.style.transform = "rotate(0deg)";
        s.raf = 0;
        return;
      }
      s.raf = requestAnimationFrame(step);
    };
    s.kick = () => {
      if (!s.raf) {
        s.last = performance.now();
        s.raf = requestAnimationFrame(step);
      }
    };
    // the swing starts when the card first scrolls into view
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          s.a = 12;
          s.w = 0;
          s.kick();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [motionOff]);

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const s = sim.current;
    s.drag = true;
    s.moved = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    s.kick();
  };
  const onMove = (e: React.PointerEvent) => {
    const s = sim.current;
    if (!s.drag || !rig.current) return;
    const pr = rig.current.getBoundingClientRect();
    const ang = (Math.atan2(e.clientX - (pr.left + pr.width / 2), Math.max(40, e.clientY - pr.top)) * 180) / Math.PI;
    const next = Math.max(-38, Math.min(38, -ang));
    s.w = (next - s.a) * 40;
    s.a = next;
    s.moved += Math.abs(e.movementX) + Math.abs(e.movementY);
  };
  const onUp = () => {
    const s = sim.current;
    s.drag = false;
    s.kick();
    if (s.moved < 6) setFlipped((f) => !f);
  };

  return (
    <section className={cn(section, "overflow-hidden bg-cream")} id="pickup" aria-labelledby="pickup-title">
      <div className="container grid grid-cols-[1.1fr_0.9fr] items-center gap-[clamp(30px,6vw,90px)] upto-860:grid-cols-[1fr]">
        <div className="reveal">
          <p className="eyebrow">איסוף בטוח</p>
          <h2 id="pickup-title" className="title">
            ילד אחד.
            <br />
            <mark className="rounded-[0.1em] px-[0.1em] text-inherit [background:linear-gradient(transparent_52%,var(--mustard)_52%_92%,transparent_92%)]">
              קוד אחד
            </mark>
            , רק מי שמורשה.
          </h2>
          <p className="lead">
            לכל ילד כרטיס איסוף אישי. ההורה מציג קוד, הצוות סורק, והמערכת מאשרת רק את מי שרשום ברשימה. בלי לשאול שוב מי
            זה.
          </p>
          <ul className="[margin:28px_0_0] grid list-none gap-3 p-0 text-[1.12rem]">
            <li className={step}>
              <b className={stepNo}>1</b> ההורה מקבל את הכרטיס באפליקציה
            </li>
            <li className={step}>
              <b className={stepNo}>2</b> הצוות סורק בכניסה לקבוצה
            </li>
            <li className={step}>
              <b className={stepNo}>3</b> רק מורשים מסומנים באישור ירוק
            </li>
          </ul>
          <div className="mt-7 grid max-w-[360px] gap-2" aria-hidden="true">
            <p className={cn(chatBubble, "rounded-es-[4px] bg-paper")}>אני בדרך לאסוף את נועה</p>
            <p className={cn(chatBubble, "ms-auto rounded-ee-[4px] bg-teal-soft")}>מחכות לך. נועה כבר שמה נעליים</p>
          </div>
        </div>

        <div className="relative grid min-h-[520px] [align-content:start] justify-items-center">
          <div className="tag-rig" ref={rig}>
            <span className="tag-cord" aria-hidden="true" />
            <span className="tag-clip" aria-hidden="true" />
            <div
              className="tag"
              data-flipped={flipped}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <div className="tag-inner">
                <div className="tag-face tag-front" inert={flipped} aria-hidden={flipped}>
                  <span className="tag-hole" aria-hidden="true" />
                  <p className="tag-top">כרטיס איסוף · גנלי</p>
                  <div
                    className="tag-qr"
                    dangerouslySetInnerHTML={{ __html: qr }}
                    role="img"
                    aria-label="קוד איסוף לדוגמה"
                  />
                  <p className="tag-name">
                    נועה <small>קבוצת הנמרים · 3 עד 4</small>
                  </p>
                  <p className="tag-code" dir="ltr">
                    NO. 4821
                  </p>
                </div>
                <div className="tag-face tag-back" inert={!flipped} aria-hidden={!flipped}>
                  <p className="tag-top">מורשים לאסוף</p>
                  <ul>
                    <li>
                      <i style={{ background: "#f6c86e" }}>ד</i> דנה · אמא <span>מורשית</span>
                    </li>
                    <li>
                      <i style={{ background: "#9fd8cf" }}>ר</i> רחל · סבתא <span>מורשית</span>
                    </li>
                    <li>
                      <i style={{ background: "#f3a59b" }}>י</i> יובל · אבא <span>מורשה</span>
                    </li>
                  </ul>
                  <p className="tag-fine">כל סריקה נשמרת ביומן הגן.</p>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-[99px] border-2 border-cocoa-deep px-[18px] py-[9px] text-cocoa-deep [background:transparent] [font:800_0.92rem/1_var(--font-body)] hover:bg-cocoa-deep hover:text-cream"
            onClick={() => setFlipped((f) => !f)}
            aria-pressed={flipped}
          >
            <span aria-hidden="true">↻</span> {flipped ? "חזרה לכרטיס" : "הפכו את הכרטיס"}
          </button>
          <p
            className="hand absolute end-[4%] top-[60px] [transform:rotate(6deg)] text-[1.5rem] text-tomato-ink upto-860:hidden"
            aria-hidden="true"
          >
            משכו אותו ושחררו
          </p>
        </div>
      </div>
    </section>
  );
}
