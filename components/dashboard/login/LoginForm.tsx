"use client";

import { useState } from "react";
import { fieldLabel, formError, textInput } from "@/components/dashboard/ui";
import { useGanli } from "@/lib/data/GanliProvider";

/** Email and password sign in, for the connected version. */
export default function LoginForm() {
  const { status, signIn } = useGanli();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return setError("נא למלא דוא״ל וסיסמה");
    setBusy(true);
    setError(await signIn(email, password));
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="mb-[26px] grid gap-3.5">
      <label className={fieldLabel}>
        דוא״ל
        <input
          className={textInput}
          type="email"
          dir="ltr"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className={fieldLabel}>
        סיסמה
        <input
          className={textInput}
          type="password"
          dir="ltr"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && (
        <p className={formError} role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-primary justify-center" disabled={busy}>
        {busy ? "רגע…" : "כניסה"}
      </button>
      {status === "needsSetup" && <p className={formError}>החשבון עוד לא משויך למשפחתון. בקשו הזמנה מהמנהלת.</p>}
    </form>
  );
}
