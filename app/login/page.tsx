"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark, Star } from "@/components/Shapes";
import { useGanli } from "@/lib/app/store";
import type { Role } from "@/lib/app/types";

const ROLES: { role: Role; label: string; who: string; text: string; color: string; soft: string }[] = [
  { role: "parent", label: "הורה", who: "דנה, אמא של נועה", text: "היום של הילד, תמונות, הודעות ותשלומים", color: "var(--blush)", soft: "var(--blush-soft)" },
  { role: "staff", label: "צוות", who: "מירב, מטפלת", text: "נוכחות, ארוחות, שינה ועדכון קבוצתי", color: "var(--teal)", soft: "var(--teal-soft)" },
  { role: "admin", label: "מנהלת", who: "אורית, מנהלת", text: "סקירת המשפחתון, ילדים, כספים והודעות", color: "var(--mustard)", soft: "var(--mustard-soft)" },
];

export default function LoginPage() {
  const { mode, status, profile, signIn, signInDemo } = useGanli();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "ready" && profile) router.replace(`/app/${profile.role}/`);
  }, [status, profile, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return setError("נא למלא דוא״ל וסיסמה");
    setBusy(true);
    setError(await signIn(email, password));
    setBusy(false);
  };

  return (
    <div className="login">
      <aside className="login-art" aria-label="על גנלי">
        <Link href="/" className="login-back">
          ← חזרה לאתר
        </Link>
        <div className="login-art-inner">
          <LogoMark className="login-mark" />
          <h2>
            הגן שלי,
            <br />
            <em>כל היום.</em>
          </h2>
          <p>מה אכלו, כמה ישנו ומה עשו היום. הכל במקום אחד, להורים, לצוות ולמנהלת.</p>
        </div>
        <Star className="login-star s1" color="var(--mustard)" />
        <Star className="login-star s2" color="var(--teal)" />
        <Star className="login-star s3" color="var(--blush)" />
      </aside>

      <main className="login-panel" id="main">
        <div className="login-box">
          <p className="eyebrow">האזור האישי</p>
          <h1>כניסה לגנלי</h1>

          {mode === "supabase" ? (
            <form onSubmit={submit} className="login-form">
              <label>
                דוא״ל
                <input type="email" dir="ltr" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label>
                סיסמה
                <input type="password" dir="ltr" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="btn btn-primary" disabled={busy}>
                {busy ? "רגע…" : "כניסה"}
              </button>
              {status === "needsSetup" && <p className="form-error">החשבון עוד לא משויך למשפחתון. בקשו הזמנה מהמנהלת.</p>}
            </form>
          ) : (
            <p className="login-note">
              זו גרסת הדגמה עם נתונים מומצאים. בחרו איך להיכנס. השינויים שתעשו נשמרים רק בדפדפן הזה.
            </p>
          )}

          {mode === "demo" && (
          <div className="role-cards">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.role}
                className="role-card"
                style={{ "--role": r.color, "--role-soft": r.soft } as React.CSSProperties}
                onClick={() => {
                  signInDemo(r.role);
                  router.push(`/app/${r.role}/`);
                }}
              >
                <span className="role-chip">{r.label}</span>
                <b>{r.who}</b>
                <small>{r.text}</small>
                <i aria-hidden="true">←</i>
              </button>
            ))}
          </div>
          )}
        </div>
      </main>
    </div>
  );
}
