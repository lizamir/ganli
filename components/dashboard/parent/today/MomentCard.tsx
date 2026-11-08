import { Card } from "@/components/dashboard/ui";

/** A milestone the staff wrote down. */
export default function MomentCard({ childName }: { childName: string }) {
  return (
    <Card title="רגע גדול" tint="#efeafb">
      <div className="flex [align-items:start] gap-3.5">
        <span className="text-[2.375rem]" aria-hidden="true">
          👣
        </span>
        <div>
          <b className="font-heading text-[1.25rem]/[normal] font-semibold text-[#45389a]">שלושה צעדים לבד!</b>
          <p>{childName} הלכה מהשטיח עד הספה, וצחקה כל הדרך.</p>
          <small className="text-subtle">מירב, 11:05</small>
        </div>
      </div>
    </Card>
  );
}
