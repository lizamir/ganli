import Link from "next/link";
import Scene from "@/components/dashboard/care/Scene";
import { Card } from "@/components/dashboard/ui";
import type { Photo } from "@/lib/domain/types";

/** The first three photos of the day. */
export default function PhotosCard({ photos }: { photos: Photo[] }) {
  return (
    <Card title="תמונות מהיום" note={<Link href="/app/parent/photos/">לכל האלבום ←</Link>}>
      <div className="grid grid-cols-[repeat(3,1fr)] gap-2.5">
        {photos.slice(0, 3).map((p) => (
          <figure key={p.id} className="m-0">
            <Scene name={p.scene} label={p.caption} className="block aspect-square w-full rounded-[16px]" />
            <figcaption className="mt-1.5 text-[0.8125rem] text-subtle">{p.caption}</figcaption>
          </figure>
        ))}
      </div>
    </Card>
  );
}
