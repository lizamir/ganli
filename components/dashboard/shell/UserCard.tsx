import { Avatar } from "@/components/dashboard/ui";
import type { Profile } from "@/lib/domain/types";

/** The signed-in person's picture, name and title. */
export default function UserCard({ profile }: { profile: Profile }) {
  return (
    <div className="side-user">
      <Avatar name={profile.name} color="#f6c86e" size={46} />
      <div>
        <b>{profile.name}</b>
        <span>{profile.title}</span>
      </div>
    </div>
  );
}
