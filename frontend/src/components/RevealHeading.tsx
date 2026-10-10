import type { ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";
export function RevealHeading({ children, className }: { children: ReactNode; className?: string }) {
    const ref = useReveal<HTMLDivElement>();
    return <div ref={ref} className={className}>{children}</div>;
}
