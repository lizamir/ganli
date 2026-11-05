import type { IconName } from "@/components/dashboard/ui/Icon";
import type { Role } from "@/lib/domain/types";

export type NavItem = { href: string; label: string; icon: IconName };

/** The menu of each role. */
export const NAV: Record<Role, NavItem[]> = {
  parent: [
    { href: "/app/parent", label: "היום", icon: "home" },
    { href: "/app/parent/pickup", label: "איסוף", icon: "qr" },
    { href: "/app/parent/menu", label: "תפריט", icon: "meal" },
    { href: "/app/parent/messages", label: "הודעות", icon: "chat" },
    { href: "/app/parent/photos", label: "אלבומים", icon: "camera" },
    { href: "/app/parent/payments", label: "תשלומים", icon: "wallet" },
    { href: "/app/parent/child", label: "כרטיס ילד", icon: "child" },
  ],
  staff: [
    { href: "/app/staff", label: "הקבוצה", icon: "users" },
    { href: "/app/staff/log", label: "יומן", icon: "clipboard" },
    { href: "/app/staff/pickup", label: "איסוף", icon: "qr" },
    { href: "/app/staff/menu", label: "תפריט", icon: "meal" },
    { href: "/app/staff/info", label: "חשוב", icon: "warn" },
  ],
  admin: [
    { href: "/app/admin", label: "סקירה", icon: "home" },
    { href: "/app/admin/children", label: "ילדים", icon: "users" },
    { href: "/app/admin/finance", label: "כספים", icon: "wallet" },
    { href: "/app/admin/messages", label: "הודעות", icon: "chat" },
    { href: "/app/admin/leads", label: "הרשמות", icon: "clipboard" },
    { href: "/app/admin/automations", label: "אוטומציות", icon: "bolt" },
  ],
};

export const ROLE_LABEL: Record<Role, string> = { parent: "הורה", staff: "צוות", admin: "מנהלת" };
export const MOBILE_PRIMARY = 4; // when there are more than 5 items, the 5th slot becomes "more"
