import { useLayoutEffect, useRef } from "react";
import { animateCount } from "../utils/animateCount";
export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const previous = useRef(0);
    const format = (number: number) => number.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    useLayoutEffect(() => {
        const node = ref.current;
        if (!node) return;
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const formatValue = (number: number) => number.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        const start = previous.current;
        const update = (number: number) => { previous.current = number; node.textContent = formatValue(number); };
        if (motion.matches) { update(value); return; }
        update(start);
        let stop = () => {};
        let observer: IntersectionObserver | undefined;
        const startCounting = () => { observer?.disconnect(); update(start); stop = animateCount(start, value, update, { now: () => performance.now(), request: callback => window.requestAnimationFrame(callback), cancel: frame => window.cancelAnimationFrame(frame) }); };
        if ("IntersectionObserver" in window) {
            observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) startCounting(); }, { threshold: .15 });
            observer.observe(node);
        } else startCounting();
        const onMotionChange = () => { if (motion.matches) { observer?.disconnect(); stop(); update(value); } };
        motion.addEventListener("change", onMotionChange);
        return () => { observer?.disconnect(); stop(); motion.removeEventListener("change", onMotionChange); };
    }, [value, decimals]);
    return <><span className="sr-only">{format(value)}</span><span ref={ref} aria-hidden="true">{format(value)}</span></>;
}
