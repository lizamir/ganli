"use client";

import { createContext, useContext, type ReactNode } from "react";
import { supabaseConfigured } from "@/lib/api/client";
import type { Ganli } from "./types";
import { useDemoSource } from "./useDemoSource";
import { useSupabaseSource } from "./useSupabaseSource";

const Ctx = createContext<Ganli | null>(null);

const useGanliSource = supabaseConfigured ? useSupabaseSource : useDemoSource;

/** Makes the data source available to the whole app. */
export function GanliProvider({ children }: { children: ReactNode }) {
  const value = useGanliSource();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** The current user, their data and the actions they can take. */
export function useGanli() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useGanli must be used inside GanliProvider");
  return v;
}
