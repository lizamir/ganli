import Link from "next/link";
import { LogoMark } from "@/components/common/Shapes";

/** The logo, linking back to the marketing site. */
export default function BrandLink() {
  return (
    <Link href="/" className="side-logo" aria-label="גנלי — לאתר">
      <LogoMark />
      <b>גנלי</b>
    </Link>
  );
}
