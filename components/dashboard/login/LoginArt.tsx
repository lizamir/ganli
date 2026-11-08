import Link from "next/link";
import { LogoMark, Star } from "@/components/common/Shapes";

/** The colored half of the login page. */
export default function LoginArt() {
  return (
    <aside
      className="relative grid place-items-center overflow-hidden p-[60px] text-white [background:radial-gradient(circle_at_80%_15%,#2e9ea0_0,transparent_45%),radial-gradient(circle_at_10%_95%,#12595b_0,transparent_55%),var(--teal-deep)] mobile:px-6 mobile:pt-20 mobile:pb-10"
      aria-label="על גנלי"
    >
      <Link
        href="/"
        className="absolute start-8 top-7 z-[2] rounded-[999px] bg-[rgba(255,255,255,0.14)] px-4 py-2.5 font-heading text-[0.9375rem]/none font-semibold text-white"
      >
        ← חזרה לאתר
      </Link>
      <div className="relative z-[1] max-w-[420px]">
        <LogoMark className="mb-[30px] box-content w-[150px] rounded-[36px] bg-cream px-[18px] pt-[22px] pb-4 shadow-[0_18px_30px_-12px_rgba(0,0,0,0.3)] mobile:w-[100px]" />
        <h2 className="text-[4rem] text-white mobile:text-[2.75rem]">
          הגן שלי,
          <br />
          <em className="text-mustard-soft not-italic">כל היום.</em>
        </h2>
        <p className="mt-5 text-[1.1875rem] text-[#e1f4f2]">
          מה אכלו, כמה ישנו ומה עשו היום. הכל במקום אחד, להורים, לצוות ולמנהלת.
        </p>
      </div>
      <Star className="absolute end-[14%] top-[18%] w-11 [transform:rotate(14deg)]" color="var(--mustard)" />
      <Star className="absolute start-[18%] bottom-[14%] w-[30px]" color="var(--teal)" />
      <Star className="absolute end-[10%] bottom-[26%] w-9" color="var(--blush)" />
    </aside>
  );
}
