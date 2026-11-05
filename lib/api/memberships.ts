import type { InstitutionChoice, Role } from "@/lib/domain/types";
import { supabase } from "./client";

export type Membership = { role: Role; institution_id: string; display_name: string; userId: string };

const PICK_KEY = "ganli-institution";

/** Remembers which institution the user chose, for the next visit. */
export function rememberInstitution(id: string) {
  try {
    localStorage.setItem(PICK_KEY, id);
  } catch {
    // Not critical.
  }
}

/** All of the user's memberships, plus the one to open: the remembered one, else a demo, else the newest. */
export async function loadMemberships(): Promise<{ current: Membership; all: InstitutionChoice[] } | null> {
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data } = await supabase
    .from("memberships")
    .select("role, institution_id, display_name, institutions(name)")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });
  if (!data?.length) return null;

  const all: InstitutionChoice[] = data.map((m) => ({
    id: m.institution_id,
    role: m.role as Role,
    name: (m.institutions as unknown as { name: string } | null)?.name ?? "",
  }));
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(PICK_KEY);
  } catch {
    // Fall through to the default.
  }
  const pick =
    data.find((m) => m.institution_id === saved) ?? data.find((m, i) => all[i].name.endsWith("(דמו)")) ?? data[0];
  return {
    current: {
      role: pick.role as Role,
      institution_id: pick.institution_id,
      display_name: pick.display_name,
      userId: auth.user.id,
    },
    all,
  };
}
