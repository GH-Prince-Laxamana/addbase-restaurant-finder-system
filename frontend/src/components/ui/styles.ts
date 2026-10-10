// Shared Tailwind classes keep repeated controls and their loading geometry in sync.
export function buttonStyles(variant: "primary" | "secondary" | "danger" | "inverse" | "light" = "primary", extra = "") {
    const base = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full in-[dialog]:rounded-xl px-6 py-3 text-[15px] font-medium leading-6 transition-colors disabled:cursor-not-allowed disabled:opacity-50";
    const variants = {
        light: "border-0 bg-background text-neutral-950 hover:bg-burgundy hover:text-white",
        inverse: "border border-white/60 bg-transparent text-background hover:bg-white/10 hover:text-background",
        primary: "bg-burgundy text-white hover:bg-burgundy-light hover:text-white",
        secondary: "border border-neutral-200 bg-transparent text-neutral-800 hover:bg-neutral-100 hover:text-neutral-950",
        danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-200",
    };
    return `${base} ${variants[variant]} ${extra}`;
}
export const fieldStyles = "min-h-12 w-full min-w-0 rounded-xl border border-neutral-300 bg-white/50 px-4 py-3 text-base text-neutral-950 placeholder:text-neutral-500 focus:border-burgundy focus:outline-2 focus:outline-burgundy focus:outline-offset-2 disabled:opacity-50 autofill:[-webkit-text-fill-color:var(--color-neutral-950)] autofill:shadow-[0_0_0_1000px_#f9f8f4_inset]";
export const iconStyles = "inline-flex size-11 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 text-neutral-700 enabled:hover:bg-neutral-100 enabled:hover:text-burgundy disabled:opacity-30";
export const restaurantGridStyles = "grid grid-cols-1 gap-x-5 gap-y-9 min-[481px]:grid-cols-2 md:grid-cols-3 md:gap-x-[30px] md:gap-y-[46px]";
export const restaurantCardStyles = "h-full rounded-[22px] bg-surface shadow-[0_3px_18px_#24242104]";
export const restaurantPhotoStyles = "group relative block overflow-hidden rounded-t-[22px]";
export const restaurantContentStyles = "px-[22px] pt-[22px] pb-[18px]";
export const restaurantMetaStyles = "flex h-[2.4em] items-start justify-between gap-3 overflow-hidden text-[.72rem] leading-[1.6] text-neutral-600";
export const restaurantTitleStyles = "mt-[11px] h-[2.4em] line-clamp-2 font-display text-[1.65rem] font-semibold leading-[1.2] [overflow-wrap:anywhere]";
export const restaurantAddressStyles = "mt-2.5 mb-4 h-[3.7em] line-clamp-2 text-[.8rem] leading-[1.85] text-neutral-600";
export const restaurantBottomStyles = "flex min-h-11 items-center justify-between text-[.75rem]";
export const panelStyles = "min-w-0 rounded-[18px] border border-neutral-200 bg-surface p-[22px] xl:p-7";
export const overviewGridStyles = "grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-neutral-200 bg-neutral-200 md:grid-cols-3";
export const overviewMetricStyles = "bg-surface px-[18px] py-[22px] sm:px-[22px] xl:px-7 xl:py-[26px]";
