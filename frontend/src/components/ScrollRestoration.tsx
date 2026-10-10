import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const positions = new Map<string, number>();
export function ScrollRestoration() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const previousPath = useRef<string | null>(null);
    useLayoutEffect(() => {
        const previous = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";
        return () => { window.history.scrollRestoration = previous; };
    }, []);
    useLayoutEffect(() => {
        const target = navigationType === "POP" ? positions.get(location.key) ?? 0 : previousPath.current === location.pathname ? window.scrollY : 0;
        previousPath.current = location.pathname;
        let savedY = target;
        let restoring = true;
        let frame = 0;
        function restore() {
            if (!restoring || document.querySelector('[data-scroll-ready="false"]')) return;
            window.scrollTo({ top: target, left: 0, behavior: "instant" });
            savedY = window.scrollY;
            restoring = false;
            observer.disconnect();
        }
        // Wait for the real grid instead of clamping the saved position to a loading screen.
        const observer = new MutationObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(restore); });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-scroll-ready"] });
        function record() { if (!restoring) savedY = window.scrollY; }
        function stopRestoring() { observer.disconnect(); restoring = false; cancelAnimationFrame(frame); savedY = window.scrollY; }
        function onKey(event: KeyboardEvent) { if (["PageDown", "PageUp", "Home", "End", "ArrowDown", "ArrowUp", " "].includes(event.key)) stopRestoring(); }
        if (target === 0) { observer.disconnect(); window.scrollTo({ top: 0, left: 0, behavior: "instant" }); restoring = false; }
        else frame = requestAnimationFrame(restore);
        window.addEventListener("scroll", record, { passive: true });
        window.addEventListener("wheel", stopRestoring, { passive: true });
        window.addEventListener("touchstart", stopRestoring, { passive: true });
        window.addEventListener("keydown", onKey);
        return () => {
            positions.set(location.key, savedY);
            if (positions.size > 100) positions.delete(positions.keys().next().value!);
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("scroll", record);
            window.removeEventListener("wheel", stopRestoring);
            window.removeEventListener("touchstart", stopRestoring);
            window.removeEventListener("keydown", onKey);
        };
    }, [location.key, location.pathname, navigationType]);
    return null;
}
