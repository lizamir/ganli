import { Card } from "@/components/dashboard/ui";

/** A milestone the staff wrote down. */
export default function MomentCard({ childName }: { childName: string }) {
  return (
    <Card title="רגע גדול" tint="#efeafb">
      <div className="milestone">
        <span aria-hidden="true">👣</span>
        <div>
          <b>שלושה צעדים לבד!</b>
          <p>{childName} הלכה מהשטיח עד הספה, וצחקה כל הדרך.</p>
          <small>מירב, 11:05</small>
        </div>
      </div>
    </Card>
  );
}
