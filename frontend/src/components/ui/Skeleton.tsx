import type { ReactNode } from "react";
export function Skeleton({ className = "" }: { className?: string }) {
    return <span aria-hidden="true" className={`block rounded-md bg-neutral-200 motion-safe:animate-pulse ${className}`} />;
}
export function LoadingRegion({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
    return <div role="status" aria-label={label} className={className}><span className="sr-only">{label}</span><div aria-hidden="true">{children}</div></div>;
}
