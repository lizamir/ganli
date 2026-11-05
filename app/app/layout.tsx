import type { Metadata } from "next";
import type { ReactNode } from "react";
import Shell from "@/components/dashboard/shell/Shell";

export const metadata: Metadata = {
  title: "גנלי | האזור האישי",
};

/** Wraps every page of the personal area in the shell. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>;
}
