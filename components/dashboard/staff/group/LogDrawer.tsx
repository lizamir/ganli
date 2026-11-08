import EventForm from "@/components/dashboard/care/EventForm";
import { LinkButton } from "@/components/dashboard/ui";

/** A side panel with the care-log form. */
export default function LogDrawer({
  initialKids,
  onClose,
  onDone,
}: {
  initialKids: string[];
  onClose: () => void;
  onDone: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex justify-start bg-[rgba(62,50,43,0.35)]" onClick={onClose}>
      <aside
        className="h-full w-[min(560px,100%)] animate-[slide_0.3s_cubic-bezier(0.2,0.9,0.3,1)] overflow-y-auto bg-cream p-7 shadow-[0_0_60px_rgba(0,0,0,0.25)]"
        role="dialog"
        aria-modal="true"
        aria-label="עדכון יומן"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[1.75rem]">עדכון יומן</h2>
          <LinkButton onClick={onClose} aria-label="סגירה">
            ✕
          </LinkButton>
        </div>
        <EventForm initialKids={initialKids} onDone={onDone} />
      </aside>
    </div>
  );
}
