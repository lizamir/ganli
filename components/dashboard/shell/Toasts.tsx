import Icon from "@/components/dashboard/ui/Icon";

/** The live notices in the corner of the screen. */
export default function Toasts({ toasts }: { toasts: { id: string; text: string }[] }) {
  return (
    <div
      className="pointer-events-none fixed end-6 top-[22px] z-[120] grid gap-2.5 mobile:inset-x-4 mobile:top-[74px]"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex max-w-[340px] animate-[toast-in_0.5s_var(--ease-spring)] items-center gap-2.5 rounded-[16px] bg-cocoa-deep px-[18px] py-3.5 font-semibold text-white shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)] mobile:max-w-none [@media(hover:none)]:pointer-events-auto"
        >
          <Icon name="bell" size={18} /> {t.text}
        </div>
      ))}
    </div>
  );
}
