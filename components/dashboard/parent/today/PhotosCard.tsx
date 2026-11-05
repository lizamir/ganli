import Link from "next/link";
import Scene from "@/components/dashboard/care/Scene";
import { Card } from "@/components/dashboard/ui";
import type { Photo } from "@/lib/domain/types";

/** The first three photos of the day. */
export default function PhotosCard({ photos }: { photos: Photo[] }) {
  return (
    <Card title="תמונות מהיום" note={<Link href="/app/parent/photos/">לכל האלבום ←</Link>}>
      <div className="photo-row">
        {photos.slice(0, 3).map((p) => (
          <figure key={p.id}>
            <Scene name={p.scene} label={p.caption} />
            <figcaption>{p.caption}</figcaption>
          </figure>
        ))}
      </div>
    </Card>
  );
}
