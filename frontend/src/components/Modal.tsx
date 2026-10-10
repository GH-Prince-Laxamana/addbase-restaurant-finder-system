import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function Modal({ title, children, onClose, busy = false, compact = false, showClose = true }: {
    title: string; children: ReactNode; onClose: () => void; busy?: boolean; compact?: boolean; showClose?: boolean;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialog.showModal();
        return () => { dialog.close(); document.body.style.overflow = overflow; };
    }, []);
    return createPortal(<dialog ref={ref} aria-labelledby={titleId} aria-busy={busy}
        className={`fixed inset-0 m-auto max-h-[calc(100dvh-24px)] overflow-auto overscroll-contain rounded-3xl border border-neutral-200 bg-surface p-0 text-neutral-950 shadow-[0_24px_90px_#17171338] backdrop:bg-neutral-950/45 backdrop:backdrop-blur-[5px] motion-safe:open:animate-dialog sm:max-h-[calc(100dvh-48px)] ${compact ? "w-[min(460px,calc(100vw-32px))]" : "w-[min(680px,calc(100vw-32px))]"}`}
        onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
        <header className="flex items-center justify-between gap-5 border-b border-neutral-200 px-[22px] pt-[22px] pb-[18px] sm:px-[30px] sm:pt-[26px] sm:pb-5 [&_h2]:m-0 [&_h2]:text-[23px] sm:[&_h2]:text-[26px] [&_h2]:leading-[1.3]"><h2 id={titleId}>{title}</h2>
            {showClose && <button type="button" onClick={onClose} disabled={busy} className="shrink-0 py-2 pl-3 text-[15px] text-neutral-600">Close</button>}
        </header>
        <div className="px-[22px] pt-5 pb-6 sm:px-[30px] sm:pt-6 sm:pb-[30px]">{children}</div>
    </dialog>, document.body);
}
