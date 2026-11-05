"use client";

import { useState } from "react";
import CodeCheckCard from "@/components/dashboard/staff/pickup/CodeCheckCard";
import VerifyPanel from "@/components/dashboard/staff/pickup/VerifyPanel";
import WaitingList from "@/components/dashboard/staff/pickup/WaitingList";
import { Badge, Card, PageHead } from "@/components/dashboard/ui";
import { authorizedLabel, pickupCode } from "@/lib/domain/pickup";
import { useGanli } from "@/lib/data/GanliProvider";
import type { Child } from "@/lib/domain/types";

/** Staff check a parent's code and record the child leaving. */
export default function StaffPickup() {
  const { data, actions, mode } = useGanli();
  const [code, setCode] = useState("");
  const [found, setFound] = useState<Child | null>(null);
  const [who, setWho] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  if (!data) return null;

  const present = data.children.filter((c) => c.status === "present");
  const left = data.children.filter((c) => c.status === "left");
  const demoChild = present[0];

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.replace(/\D/g, "");
    const child = present.find((c) => pickupCode(c.id) === clean);
    setMsg(null);
    setWho("");
    if (!child) {
      setFound(null);
      setMsg({
        ok: false,
        text: "הקוד לא תקין או לא בתוקף להיום. בקשו מההורה להציג את הקוד העדכני, ואמתו מול רשימת המורשים.",
      });
      return;
    }
    setFound(child);
  };

  const planned = found ? data.pickups.find((p) => p.childId === found.id) : undefined;
  const chosen = who || (found?.authorized[0] ? authorizedLabel(found.authorized[0]) : "");

  const checkOut = async (child: Child, by: string) => {
    const err = await actions.checkOut(child.id, by);
    setMsg(
      err
        ? { ok: false, text: err }
        : { ok: true, text: `${child.name} נאסף/ה על ידי ${by}. היציאה נרשמה ב־${data.now}.` },
    );
    if (!err) {
      setFound(null);
      setCode("");
    }
  };

  return (
    <>
      <PageHead kicker="איסוף" title="אימות איסוף" actions={<Badge tone="cool">{left.length} נאספו היום</Badge>} />
      <div className="grid-2">
        <CodeCheckCard
          code={code}
          onCode={setCode}
          onVerify={verify}
          demoChild={demoChild}
          showDemoHelp={mode === "demo"}
          msg={msg}
        />

        <Card title={found ? "הקוד אומת" : "מי מחכה לאיסוף"} note={found ? undefined : "לפי תכנון ההורים"}>
          {found ? (
            <VerifyPanel
              child={found}
              planned={planned}
              chosen={chosen}
              onChoose={setWho}
              onCheckOut={() => checkOut(found, chosen)}
            />
          ) : (
            <WaitingList present={present} pickups={data.pickups} />
          )}
        </Card>
      </div>

      {left.length > 0 && (
        <Card title="נאספו היום">
          <ul className="people">
            {left.map((c) => (
              <li key={c.id}>
                <b>{c.name}</b>
                <span>יצא/ה ב־{c.pickup}</span>
                <Badge tone="ok">נאסף/ה</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
