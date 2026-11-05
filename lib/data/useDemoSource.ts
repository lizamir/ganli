import { useSyncExternalStore } from "react";
import { DEMO_PROFILES } from "@/lib/mock/demoSnapshot";
import type { GanliSnapshot, Role } from "@/lib/domain/types";
import { demoActions, readDemo, subscribeDemo, updateDemo, writeDemo, SERVER_STATE } from "./demoStore";
import type { Ganli } from "./types";

/** The demo data source: no server, everything stays in this browser. */
export function useDemoSource(): Ganli {
  const state = useSyncExternalStore<{ role: Role | null; data: GanliSnapshot | null }>(
    subscribeDemo,
    readDemo,
    () => SERVER_STATE,
  );
  const hydrated = state !== SERVER_STATE;
  return {
    mode: "demo",
    status: !hydrated ? "loading" : state.role ? "ready" : "out",
    profile: state.role ? DEMO_PROFILES[state.role] : null,
    data: state.data,
    actions: demoActions,
    institutions: [],
    submitLead: (lead) =>
      updateDemo((d) => ({
        ...d,
        leads: [
          {
            ...lead,
            id: `l${Date.now()}`,
            time: new Date().toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" }),
          },
          ...(d.leads ?? []),
        ],
      })),
    switchInstitution: () => {},
    signInDemo: (role) => writeDemo({ ...readDemo(), role }),
    signIn: async () => "השרת לא מחובר. היכנסו עם אחד מחשבונות הדמו",
    signOut: async () => writeDemo({ ...readDemo(), role: null }),
  };
}
