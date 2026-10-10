import { iconStyles, restaurantGridStyles } from "../../components/ui/styles";
import { FilterDropdown } from "../../components/FilterDropdown";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useRestaurants } from "../../hooks/useRestaurants";
import { RestaurantCard } from "../../components/RestaurantCard";
import { RestaurantSkeletons } from "../../components/RestaurantSkeletons";
import { RestaurantSearchForm } from "../../components/RestaurantSearchForm";
import { readRestaurantQuery, updateRestaurantParams } from "../../utils/restaurantQuery";
import { useReveal } from "../../hooks/useReveal";

export function RestaurantsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = readRestaurantQuery(searchParams);
    const { q = "", cuisine = "", borough = "", minRating, sort, page = 1 } = query;
    const headingRef = useReveal<HTMLElement>();
    const { data, isLoading, showSkeletons, error, refetch } = useRestaurants(query);
    function update(patch: Record<string, string>, replace = false) {
        setSearchParams(current => updateRestaurantParams(current, patch), { replace });
    }
    const setCuisine = (value: string) => update({ cuisine: value, page: "1" }, true);
    const setBorough = (value: string) => update({ borough: value, page: "1" }, true);
    const setMinRating = (value: string) => update({ minRating: value, page: "1" });
    const setSort = (value: string) => update({ sort: value, page: "1" });
    function resetFilters() { setSearchParams({}); }

    return (
        <main data-scroll-ready={!showSkeletons} className="mx-auto max-w-6xl px-6 py-12">
            <header ref={headingRef} className="mb-8 pb-[18px] [&_h1]:text-[clamp(2.5rem,4vw,3.6rem)] [&>p]:max-w-[680px]">
                <h1 className="text-3xl font-medium">Explore restaurants</h1>
                <p className="mt-2 text-neutral-600">
                    Find your kind of place. A world of flavor, one neighborhood at a time.
                </p>
            </header>

            <RestaurantSearchForm key={q} initialValue={q} onSearch={value => update({ q: value, page: "1" })} />

            <section
                aria-label="Restaurant filters"
                className="mt-6 grid grid-cols-1 gap-4 py-3 pb-[25px] sm:grid-cols-2 lg:grid-cols-4 [&_label>span]:mb-[9px] [&_label>span]:ml-3 mb-8"
            >
                <label className="text-sm">
                    <span className="mb-1 block">Cuisine</span>
                    <input
                        value={cuisine}
                        onChange={(event) => {
                            setCuisine(event.target.value);
                        }}
                        placeholder="e.g. Bakery"
                        className="min-h-12 w-full min-w-0 rounded-full border border-neutral-200 bg-surface px-5 py-3 text-[15px] focus:border-burgundy"
                    />
                </label>

                <label className="text-sm">
                    <span className="mb-1 block">Borough</span>
                    <input
                        value={borough}
                        onChange={(event) => {
                            setBorough(event.target.value);
                        }}
                        placeholder="e.g. Bronx"
                        className="min-h-12 w-full min-w-0 rounded-full border border-neutral-200 bg-surface px-5 py-3 text-[15px] focus:border-burgundy"
                    />
                </label>

                <FilterDropdown label="Minimum rating" value={String(minRating ?? "")} onChange={setMinRating}
                    options={[{ value: "", label: "Any rating" }, { value: "1", label: "1+ stars" }, { value: "2", label: "2+ stars" }, { value: "3", label: "3+ stars" }, { value: "4", label: "4+ stars" }, { value: "4.5", label: "4.5+ stars" }]} />

                <FilterDropdown label="Sort by" value={sort ?? "rating"} onChange={setSort}
                    options={[{ value: "rating", label: "Highest rated" }, { value: "reviews", label: "Most reviewed" }, { value: "name", label: "Name" }]} />
            </section>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-neutral-600">
                    {data
                        ? `${data.pagination.total} restaurants found`
                        : "Restaurant results"}
                </p>

                <button
                    type="button"
                    onClick={resetFilters}
                    className="text-sm underline underline-offset-4"
                >
                    Clear filters
                </button>
            </div>

            {showSkeletons && <RestaurantSkeletons />}

            {error && !isLoading && (
                <div role="alert" className="rounded-lg border border-red-200 p-5">
                    <p>Unable to load restaurants: {error.message}</p>
                    <button
                        type="button"
                        onClick={refetch}
                        className="mt-3 underline underline-offset-4"
                    >
                        Try again
                    </button>
                </div>
            )}

            {!showSkeletons && data && (
                <>
                    {data.results.length === 0 ? (
                        <p className="py-12 text-center text-neutral-600">
                            No restaurants match your search.
                        </p>
                    ) : (
                        <ul className={restaurantGridStyles}>
                            {data.results.map((restaurant, index) => (
                                <li key={restaurant._id}><RestaurantCard restaurant={restaurant} index={index} /></li>
                            ))}
                        </ul>
                    )}

                    {data.pagination.totalPages > 1 && (
                        <nav
                            aria-label="Restaurant pagination"
                            className="mt-8 flex items-center justify-center gap-4"
                        >
                            <button
                                type="button" aria-label="Previous page"
                                disabled={isLoading || !data.pagination.hasPreviousPage}
                                onClick={() => update({ page: String(page - 1) })}
                                className={iconStyles}
                            >
                                <ArrowLeft aria-hidden="true" size={20} />
                            </button>

                            <span className="text-sm">
                                Page {data.pagination.page} of{" "}
                                {data.pagination.totalPages}
                            </span>

                            <button
                                type="button" aria-label="Next page"
                                disabled={isLoading || !data.pagination.hasNextPage}
                                onClick={() => update({ page: String(page + 1) })}
                                className={iconStyles}
                            >
                                <ArrowRight aria-hidden="true" size={20} />
                            </button>
                        </nav>
                    )}
                </>
            )}
        </main>
    );
}