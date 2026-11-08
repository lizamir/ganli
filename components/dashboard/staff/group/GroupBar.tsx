import { LinkButton } from "@/components/dashboard/ui";
/** Appears when children are selected, to update them all at once. */
export default function GroupBar({
  count,
  onUpdate,
  onClear,
}: {
  count: number;
  onUpdate: () => void;
  onClear: () => void;
}) {
  return (
    <div
      className="fixed bottom-6 left-1/2 z-40 flex [transform:translateX(-50%)] items-center gap-4 rounded-[999px] bg-cocoa-deep py-3 pr-3.5 pl-6 text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]"
      role="toolbar"
    >
      <b className="font-heading text-[1rem]/[normal] font-semibold">עדכון קבוצתי · {count} ילדים</b>
      <button type="button" className="btn btn-primary btn-sm" onClick={onUpdate}>
        עדכון לנבחרים
      </button>
      <LinkButton light onClick={onClear}>
        ביטול
      </LinkButton>
    </div>
  );
}
