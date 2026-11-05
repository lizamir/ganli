import EventForm from "@/components/dashboard/care/EventForm";

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
    <div className="drawer-wrap" onClick={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="עדכון יומן"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-head">
          <h2>עדכון יומן</h2>
          <button type="button" className="link-btn" onClick={onClose} aria-label="סגירה">
            ✕
          </button>
        </div>
        <EventForm initialKids={initialKids} onDone={onDone} />
      </aside>
    </div>
  );
}
