/** A payments bar for the app previews: paid, pending and late, side by side. */
export default function PayBar() {
  return (
    <div className="flex h-4 gap-[3px] overflow-hidden rounded-[8px]">
      <span style={{ flex: 6, background: "#5fb59a" }} />
      <span style={{ flex: 3, background: "var(--mustard)" }} />
      <span style={{ flex: 1, background: "var(--tomato)" }} />
    </div>
  );
}
