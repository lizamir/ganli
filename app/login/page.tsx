"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DemoRoleCards from "@/components/dashboard/login/DemoRoleCards";
import LoginArt from "@/components/dashboard/login/LoginArt";
import LoginForm from "@/components/dashboard/login/LoginForm";
import { useGanli } from "@/lib/data/GanliProvider";

/** The login page. A signed-in visitor goes straight to their area. */
export default function LoginPage() {
  const { mode, status, profile } = useGanli();
  const router = useRouter();

  useEffect(() => {
    if (status === "ready" && profile) router.replace(`/app/${profile.role}/`);
  }, [status, profile, router]);

  return (
    <div className="login">
      <LoginArt />

      <main className="login-panel" id="main">
        <div className="login-box">
          <p className="eyebrow">האזור האישי</p>
          <h1>כניסה לגנלי</h1>

          {mode === "supabase" ? (
            <LoginForm />
          ) : (
            <p className="login-note">
              זו גרסת הדגמה עם נתונים מומצאים. בחרו איך להיכנס. השינויים שתעשו נשמרים רק בדפדפן הזה.
            </p>
          )}

          {mode === "demo" && <DemoRoleCards />}
        </div>
      </main>
    </div>
  );
}
