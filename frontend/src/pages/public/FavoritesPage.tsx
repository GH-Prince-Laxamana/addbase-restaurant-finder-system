import { buttonStyles, restaurantGridStyles } from "../../components/ui/styles";
import { Link } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import { RestaurantCard } from "../../components/RestaurantCard";
import { RestaurantSkeletons } from "../../components/RestaurantSkeletons";
import { useReveal } from "../../hooks/useReveal";

export function FavoritesPage() {
    const { favorites, isLoading, loadError, mutationError, refetch } = useFavorites();
    const headingRef = useReveal<HTMLElement>();
    return <main data-scroll-ready={!isLoading} className="mx-auto max-w-5xl px-6 py-12">
        <header ref={headingRef} className="mb-8"><h1 className="text-3xl font-medium">Your favorites</h1><p className="mt-2 text-neutral-600">The restaurants you've saved for later.</p></header>
        {(loadError || mutationError) && <div role="alert" className="mb-6 rounded-lg border border-red-200 p-4"><p>{(loadError ?? mutationError)?.message}</p>{loadError && <button type="button" onClick={refetch} className="mt-2 text-sm underline underline-offset-4">Try again</button>}</div>}
        {isLoading ? <RestaurantSkeletons /> : !loadError && favorites.length === 0 ? <section className="px-6 py-12 text-center"><h2 className="text-xl font-semibold">No favorites yet</h2><p className="mt-3 text-neutral-600">Browse restaurants and save the ones you'd like to visit.</p><Link to="/restaurants" className={buttonStyles("primary", "mt-6 inline-block")}>Explore restaurants</Link></section> : <ul className={restaurantGridStyles}>{favorites.map((favorite, index) => <li key={favorite.restaurant._id}><RestaurantCard restaurant={favorite.restaurant} index={index} /></li>)}</ul>}
    </main>;
}
