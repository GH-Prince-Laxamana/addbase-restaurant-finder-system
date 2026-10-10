import { Component, Suspense, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { buttonStyles } from "./ui/styles";
class PageErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    override state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    override render() {
        if (this.state.failed) return <main className="mx-auto min-h-[60vh] max-w-4xl px-6 py-12"><div role="alert"><h1 className="text-3xl">This page couldn’t load.</h1><p className="mt-4 text-neutral-600">Check your connection and try again.</p><button type="button" onClick={() => window.location.reload()} className={buttonStyles("primary", "mt-6")}>Reload page</button></div></main>;
        return this.props.children;
    }
}
export function PageLoader({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
    const location = useLocation();
    return <PageErrorBoundary key={location.pathname}><Suspense fallback={fallback}>{children}</Suspense></PageErrorBoundary>;
}
