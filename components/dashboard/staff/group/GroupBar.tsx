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
    <div className="group-bar" role="toolbar">
      <b>עדכון קבוצתי · {count} ילדים</b>
      <button type="button" className="btn btn-primary btn-sm" onClick={onUpdate}>
        עדכון לנבחרים
      </button>
      <button type="button" className="link-btn light" onClick={onClear}>
        ביטול
      </button>
    </div>
  );
}
