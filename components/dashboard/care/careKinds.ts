import type { IconName } from "@/components/dashboard/ui/Icon";

// `color` is for fills (bars, dots, icon discs); `ink` is the darker twin used for text on the tint.
export const KIND = {
  arrival: { color: "#2e9ea0", ink: "#17595b", tint: "#dcefee", icon: "foot" as IconName, label: "נוכחות" },
  meal: { color: "#e39a2d", ink: "#7a4a00", tint: "#fbecd2", icon: "meal" as IconName, label: "אוכל" },
  sleep: { color: "#6b5fb5", ink: "#473d8f", tint: "#ebe8f8", icon: "sleep" as IconName, label: "שינה" },
  care: { color: "#e07a6a", ink: "#9a3526", tint: "#fbe3de", icon: "care" as IconName, label: "טיפול" },
};
