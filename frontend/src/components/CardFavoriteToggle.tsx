import { useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import { ApiError } from "../services/api";
import type { Restaurant } from "../types/api";

export function CardFavoriteToggle({ restaurant }: { restaurant: Restaurant }) {
    const { user, isLoading: authLoading } = useAuth();
    const { selectedIds, pendingIds, isLoading, loadError, add, remove, refetch } = useFavorites();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const selected = !!user && selectedIds.has(restaurant._id);
    const pending = pendingIds.has(restaurant._id);
    const login = () => navigate("/login", { state: { from: { pathname: "/favorites" } } });
    async function toggle() {
        setError("");
        if (!user) { login(); return; }
        if (loadError) { refetch(); setError("Reloading saved restaurants. Please try again."); return; }
        try {
            if (selected) await remove(restaurant._id); else await add(restaurant._id, restaurant);
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) { login(); return; }
            setError(err instanceof Error ? err.message : "Unable to update favorites. Try again.");
        }
    }
    return <div>
        <button type="button" className="absolute top-3.5 right-3.5 grid size-11 place-items-center rounded-full bg-background text-burgundy shadow-[0_2px_10px_#00000015] enabled:hover:bg-white disabled:opacity-65" aria-label={`${selected ? "Remove" : "Save"} ${restaurant.name} ${selected ? "from" : "to"} favorites`} aria-pressed={selected} aria-busy={pending} disabled={authLoading || (!!user && isLoading) || pending} onClick={() => void toggle()}>
            <Heart aria-hidden="true" size={21} strokeWidth={1.7} fill={selected ? "currentColor" : "none"} />
        </button>
        {error && <p role="alert" className="absolute top-16 right-3 z-20 w-[min(270px,calc(100%-24px))] rounded-[10px] bg-background px-3.25 py-2.5 text-[.75rem] text-red-700 shadow-md">{error}</p>}
    </div>;
}
