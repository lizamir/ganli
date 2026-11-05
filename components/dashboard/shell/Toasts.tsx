import Icon from "@/components/dashboard/ui/Icon";

/** The live notices in the corner of the screen. */
export default function Toasts({ toasts }: { toasts: { id: string; text: string }[] }) {
  return (
    <div className="toasts" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <Icon name="bell" size={18} /> {t.text}
        </div>
      ))}
    </div>
  );
}
