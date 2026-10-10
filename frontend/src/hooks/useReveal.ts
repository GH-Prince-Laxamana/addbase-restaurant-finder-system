import { useEffect, useRef } from "react";
export function useReveal<T extends HTMLElement>(delay = 0) {
    const ref = useRef<T>(null);
    const revealed = useRef(false);
    useEffect(() => {
        const node = ref.current;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (!node || revealed.current) return;
        if (reduced.matches || !("IntersectionObserver" in window)) { revealed.current = true; return; }
        node.style.setProperty("--reveal-delay", `${Math.min(delay, 250)}ms`);
        node.classList.add("opacity-0", "translate-y-3");
        const reveal = () => { revealed.current = true; node.classList.add("transition-[opacity,transform]", "duration-[350ms]", "ease-out", "delay-[var(--reveal-delay)]", "motion-reduce:transition-none"); node.classList.remove("opacity-0", "translate-y-3"); observer.disconnect(); };
        const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) reveal(); }, { threshold: 0.08 });
        observer.observe(node);
        const onMotionChange = () => { if (reduced.matches) reveal(); };
        reduced.addEventListener("change", onMotionChange);
        return () => { observer.disconnect(); reduced.removeEventListener("change", onMotionChange); node.classList.remove("opacity-0", "translate-y-3"); };
    }, [delay]);
    return ref;
}
