import type { Metadata } from "next";
import type { ReactNode } from "react";
import Shell from "@/components/app/Shell";

export const metadata: Metadata = {
  title: "גנלי | האזור האישי",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>;
}
