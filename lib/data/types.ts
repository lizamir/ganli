import type { GanliActions, GanliSnapshot, InstitutionChoice, LeadInput, Profile, Role } from "@/lib/domain/types";

export type Status = "loading" | "out" | "needsSetup" | "ready";

/** What every screen gets from useGanli, whether the data is the demo or the server. */
export type Ganli = {
  mode: "demo" | "supabase";
  status: Status;
  profile: Profile | null;
  data: GanliSnapshot | null;
  actions: GanliActions;
  institutions: InstitutionChoice[];
  submitLead: (lead: LeadInput) => Promise<string | null>;
  switchInstitution: (id: string) => void;
  signInDemo: (role: Role) => void;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};
