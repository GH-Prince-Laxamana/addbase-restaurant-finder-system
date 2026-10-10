import { useId, useState } from "react";
import { Star } from "lucide-react";
function StarShape({ fill, large = false }: { fill: number; large?: boolean }) {
    const size = large ? "size-[30px]" : "size-4";
    return <span className={`relative inline-block shrink-0 text-yellow-500 ${size}`} aria-hidden="true">
        <Star className={`block max-w-none fill-[#f2f0e9] text-[#c8c3b8] ${size}`} strokeWidth={1.5} />
        <span className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%` }}><Star className={`block max-w-none fill-current ${size}`} strokeWidth={1.5} /></span>
    </span>;
}
export function StarRating({ value, showValue = false, unrated = false }: { value: number; showValue?: boolean; unrated?: boolean }) {
    const score = Number.isFinite(value) ? Math.max(0, Math.min(5, value)) : 0;
    return <span className="inline-flex items-center gap-2 align-middle whitespace-nowrap leading-none" role="img" aria-label={unrated ? "No ratings yet" : `${score.toFixed(1)} out of 5 stars`}>
        <span className="inline-flex gap-0.5">{[0, 1, 2, 3, 4].map(index => <StarShape key={index} fill={score - index} />)}</span>
        {showValue && <span className="text-[.8rem] font-semibold text-neutral-600 tabular-nums" aria-hidden="true">{unrated ? "New" : score.toFixed(1)}</span>}
    </span>;
}
const descriptions = ["Very poor", "Poor", "Average", "Good", "Excellent"];
export function StarRatingInput({ value, onChange, disabled = false, autoFocus = false }: {
    value: number; onChange: (value: number) => void; disabled?: boolean; autoFocus?: boolean;
}) {
    const name = useId();
    const [hover, setHover] = useState<number | null>(null);
    const preview = hover ?? value;
    return <fieldset className="min-w-0 border-0 p-0 disabled:opacity-60" disabled={disabled}>
        <legend className="mb-2 text-sm">Rating</legend>
        <div className="inline-flex gap-1" onMouseLeave={() => setHover(null)}>
            {[1, 2, 3, 4, 5].map(score => <label key={score} className="relative flex size-11 cursor-pointer items-center justify-center rounded-[10px] hover:bg-yellow-500/5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-burgundy has-[:focus-visible]:outline-offset-2" onMouseEnter={() => { if (!disabled) setHover(score); }}>
                <input className="absolute inset-0 m-0 size-full cursor-pointer opacity-0 disabled:cursor-wait" type="radio" required name={name} value={score} checked={value === score} autoFocus={autoFocus && (value === score || (value === 0 && score === 1))}
                    onChange={() => { setHover(null); onChange(score); }} aria-label={`${score} ${score === 1 ? "star" : "stars"} — ${descriptions[score - 1]}`} />
                <span className="pointer-events-none"><StarShape large fill={preview >= score ? 1 : 0} /></span>
            </label>)}
        </div>
        <p className="mt-1 min-h-[1.5em] text-[.8rem] text-neutral-600" aria-hidden="true">{preview === 0 ? "Select a rating" : descriptions[preview - 1]}</p>
    </fieldset>;
}
