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
    <div className="grid min-h-screen grid-cols-[1fr_1.05fr] bg-cream mobile:grid-cols-[1fr]">
      <LoginArt />

      <main className="grid place-items-center px-10 py-[60px] mobile:px-4 mobile:py-10" id="main">
        <div className="w-[min(520px,100%)]">
          <p className="eyebrow">האזור האישי</p>
          <h1 className="mt-3 mb-[26px] text-[3rem]">כניסה לגנלי</h1>

          {mode === "supabase" ? (
            <LoginForm />
          ) : (
            <p className="mb-[22px] text-[1rem] text-subtle">
              זו גרסת הדגמה עם נתונים מומצאים. בחרו איך להיכנס. השינויים שתעשו נשמרים רק בדפדפן הזה.
            </p>
          )}

          {mode === "demo" && <DemoRoleCards />}
        </div>
      </main>
    </div>
  );
}
