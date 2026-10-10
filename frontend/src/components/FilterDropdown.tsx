import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

type Option = { value: string; label: string };
export function FilterDropdown({ label, value, options, onChange }: {
    label: string; value: string; options: Option[]; onChange: (value: string) => void;
}) {
    const id = useId();
    const root = useRef<HTMLDivElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const search = useRef({ text: "", time: 0 });
    const [open, setOpen] = useState(false);
    const selected = Math.max(0, options.findIndex(option => option.value === value));
    const [active, setActive] = useState(selected);
    useEffect(() => {
        if (!open) return;
        function dismiss(event: PointerEvent) { if (!root.current?.contains(event.target as Node)) setOpen(false); }
        document.addEventListener("pointerdown", dismiss);
        return () => document.removeEventListener("pointerdown", dismiss);
    }, [open]);
    useEffect(() => {
        if (open) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: "nearest" });
    }, [open, active, id]);
    function choose(index: number) {
        onChange(options[index].value);
        setOpen(false);
        trigger.current?.focus({ preventScroll: true });
    }
    function handleKey(event: KeyboardEvent<HTMLButtonElement>) {
        if (event.key === "Tab") { setOpen(false); return; }
        if (event.key === "Escape") { if (open) { event.preventDefault(); event.stopPropagation(); setOpen(false); } return; }
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            if (event.key === "Enter" || event.key === " ") {
                if (open) choose(active); else { setActive(selected); setOpen(true); }
            } else {
                setOpen(true);
                setActive(event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : !open ? selected : Math.max(0, Math.min(options.length - 1, active + (event.key === "ArrowDown" ? 1 : -1))));
            }
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            const now = Date.now();
            search.current.text = (now - search.current.time < 700 ? search.current.text : "") + event.key.toLowerCase();
            search.current.time = now;
            const index = options.findIndex(option => option.label.toLowerCase().startsWith(search.current.text));
            if (index >= 0) { event.preventDefault(); setActive(index); setOpen(true); }
        }
    }
    return <div ref={root} className="relative min-w-0" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
        <label id={`${id}-label`} htmlFor={`${id}-trigger`} className="mb-[9px] ml-3 block text-sm">{label}</label>
        <button ref={trigger} id={`${id}-trigger`} type="button" role="combobox" aria-haspopup="listbox"
            aria-expanded={open} aria-controls={`${id}-options`} aria-labelledby={`${id}-label ${id}-value`}
            aria-activedescendant={open ? `${id}-option-${active}` : undefined}
            className="flex min-h-12 w-full min-w-0 items-center justify-between gap-3 rounded-full border border-neutral-200 bg-surface px-5 py-3 text-left text-[15px] font-normal aria-expanded:border-burgundy aria-expanded:ring-2 aria-expanded:ring-burgundy/10" onKeyDown={handleKey} onClick={() => { setActive(selected); setOpen(!open); }}>
            <span id={`${id}-value`} className="min-w-0 truncate">{options[selected].label}</span>
            <ChevronDown aria-hidden="true" size={18} className="shrink-0" />
        </button>
        {open && <ul id={`${id}-options`} role="listbox" aria-labelledby={`${id}-label`} className="absolute inset-x-0 top-full z-30 mt-2 max-h-64 overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200 bg-surface p-2 shadow-lg">
            {options.map((option, index) => <li key={option.value} id={`${id}-option-${index}`} role="option" aria-selected={value === option.value}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-[15px] text-neutral-700 aria-selected:font-medium aria-selected:text-burgundy ${index === active ? "bg-neutral-100" : ""}`}
                onMouseEnter={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={() => choose(index)}>
                <span>{option.label}</span>{value === option.value && <Check aria-hidden="true" size={17} className="shrink-0" />}
            </li>)}
        </ul>}
    </div>;
}
