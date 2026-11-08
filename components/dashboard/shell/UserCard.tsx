import { Avatar } from "@/components/dashboard/ui";
import type { Profile } from "@/lib/domain/types";

/** The signed-in person's picture, name and title. Hidden on phones. */
export default function UserCard({ profile }: { profile: Profile }) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] bg-[rgba(255,255,255,0.07)] p-3 mobile:hidden">
      <Avatar name={profile.name} color="#f6c86e" size={46} />
      <div>
        <b className="block font-heading text-[1.125rem]/[1.2] font-semibold">{profile.name}</b>
        <span className="text-[0.8125rem] text-side-muted">{profile.title}</span>
      </div>
    </div>
  );
}
