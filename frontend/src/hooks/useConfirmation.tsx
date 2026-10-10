import { buttonStyles } from "../components/ui/styles";
import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "../components/Modal";

export function useConfirmation() {
    const [message, setMessage] = useState<{ text: string; action: string } | null>(null);
    const resolver = useRef<((confirmed: boolean) => void) | null>(null);
    useEffect(() => () => { resolver.current?.(false); resolver.current = null; }, []);
    const confirm = useCallback((text: string, action = "Confirm") => new Promise<boolean>(resolve => {
        resolver.current?.(false);
        resolver.current = resolve;
        setMessage({ text, action });
    }), []);
    function finish(value: boolean) {
        resolver.current?.(value);
        resolver.current = null;
        setMessage(null);
    }
    const confirmation = message !== null ? <Modal title={`${message.action}?`} compact showClose={false} onClose={() => finish(false)}>
        <p className="whitespace-pre-line leading-[1.75] text-neutral-600">{message.text}</p>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
            <button type="button" autoFocus onClick={() => finish(false)} className={buttonStyles("secondary")}>Cancel</button>
            <button type="button" onClick={() => finish(true)} className={buttonStyles("primary")}>{message.action}</button>
        </div>
    </Modal> : null;
    return { confirm, confirmation };
}
