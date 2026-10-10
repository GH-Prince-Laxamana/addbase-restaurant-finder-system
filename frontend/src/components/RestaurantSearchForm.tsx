import { buttonStyles, iconStyles } from "./ui/styles";
import { useId, useState, type FormEvent } from "react";
import { X } from "lucide-react";
export function RestaurantSearchForm({ initialValue, onSearch, clearSearchOnReset = true, className = "" }: { initialValue: string; onSearch: (value: string) => void; clearSearchOnReset?: boolean; className?: string }) {
    const [input, setInput] = useState(initialValue);
    const id = useId();
    function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onSearch(input.trim()); }
    return <form onSubmit={submit} className={`flex w-full items-center gap-1 rounded-full border border-neutral-200 bg-surface p-2 shadow-sm focus-within:ring-2 focus-within:ring-burgundy focus-within:ring-offset-2 focus-within:ring-offset-background sm:gap-2 ${className}`} role="search">
        <label htmlFor={id} className="sr-only">Restaurant, cuisine, or borough</label>
        <div className="relative min-w-0 flex-1">
            <input className="min-h-12 w-full min-w-0 rounded-full border-0 bg-transparent py-2 pl-3 pr-12 text-[14px] outline-none focus-visible:outline-none sm:pl-4 sm:text-[16px] [&::-webkit-search-cancel-button]:appearance-none" id={id} type="search" value={input} onChange={event => setInput(event.target.value)} placeholder="Restaurant, cuisine, or borough" />
            {input && <button type="button" className={`${iconStyles} absolute top-1/2 right-0 -translate-y-1/2`} aria-label="Clear search" onClick={() => { setInput(""); if (clearSearchOnReset) onSearch(""); }}><X aria-hidden="true" size={18} /></button>}
        </div>
        <button type="submit" className={buttonStyles("primary", "px-4 sm:px-6")}>Search</button>
    </form>;
}
