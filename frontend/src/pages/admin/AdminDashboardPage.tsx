import { useAdminOverview, useAdminRestaurantStats } from "../../hooks/useAdminStats";

function StatCard({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-xl border border-neutral-200 p-5">
            <p className="text-sm text-neutral-500">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
    );
}

export function AdminDashboardPage() {
    const overview = useAdminOverview();
    const analytics = useAdminRestaurantStats();

    if (overview.isLoading) {
        return (
            <main className="p-6">
                <p role="status">Loading dashboard...</p>
            </main>
        );
    }

    if (overview.error || !overview.data) {
        return (
            <main className="p-6">
                <h1 className="text-2xl font-bold">Admin dashboard</h1>
                <p role="alert" className="mt-4 text-red-700">
                    {overview.error?.message ?? "Unable to load dashboard statistics."}
                </p>
                <button
                    type="button"
                    onClick={overview.refetch}
                    className="mt-3 underline underline-offset-4"
                >
                    Try again
                </button>
            </main>
        );
    }

    const stats = overview.data;
    const restaurantStats = analytics.data;

    return (
        <main className="mx-auto max-w-7xl p-6 sm:p-8">
            <header className="mb-8">
                <p className="text-sm font-medium text-neutral-500">
                    Restaurant Explorer
                </p>
                <h1 className="mt-2 text-3xl font-bold">Admin dashboard</h1>
                <p className="mt-2 text-neutral-600">
                    Overview of restaurants, users, and reviews.
                </p>
            </header>

            <section aria-label="Overview statistics">
                <h2 className="mb-4 text-lg font-semibold">Overview</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        label="Total restaurants"
                        value={stats.restaurants.total}
                    />
                    <StatCard
                        label="Active restaurants"
                        value={stats.restaurants.active}
                    />
                    <StatCard
                        label="Inactive restaurants"
                        value={stats.restaurants.inactive}
                    />
                    <StatCard label="Users" value={stats.users} />
                    <StatCard label="Reviews" value={stats.reviews} />
                    <StatCard
                        label="Average restaurant rating"
                        value={stats.restaurants.averageRating.toFixed(2)}
                    />
                </div>
            </section>

            <section className="mt-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold">
                        Restaurant analytics
                    </h2>
                    <button
                        type="button"
                        onClick={() => {
                            overview.refetch();
                            analytics.refetch();
                        }}
                        className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
                    >
                        Refresh dashboard
                    </button>
                </div>

                {analytics.isLoading && (
                    <p role="status" className="mt-4">
                        Loading restaurant analytics...
                    </p>
                )}

                {analytics.error && (
                    <div role="alert" className="mt-4 rounded-lg border border-red-200 p-4">
                        <p className="text-red-700">
                            Unable to load analytics: {analytics.error.message}
                        </p>
                        <button
                            type="button"
                            onClick={analytics.refetch}
                            className="mt-2 text-sm underline underline-offset-4"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {restaurantStats && !analytics.isLoading && !analytics.error && (
                    <div className="mt-5 grid gap-6 lg:grid-cols-2">
                        <div className="rounded-xl border border-neutral-200 p-5">
                            <h3 className="font-semibold">Top-rated restaurants</h3>
                            {restaurantStats.topRated.length === 0 ? (
                                <p className="mt-3 text-sm text-neutral-500">
                                    No reviewed restaurants yet.
                                </p>
                            ) : (
                                <ol className="mt-4 space-y-3">
                                    {restaurantStats.topRated.map((restaurant) => (
                                        <li
                                            key={restaurant._id}
                                            className="flex items-start justify-between gap-4"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {restaurant.name}
                                                </p>
                                                <p className="text-sm text-neutral-500">
                                                    {restaurant.cuisine} · {restaurant.borough}
                                                </p>
                                            </div>
                                            <p className="shrink-0 text-sm font-semibold">
                                                {Number(restaurant.avgScore).toFixed(1)} / 5
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>

                        <div className="rounded-xl border border-neutral-200 p-5">
                            <h3 className="font-semibold">Most-reviewed restaurants</h3>
                            {restaurantStats.mostReviewed.length === 0 ? (
                                <p className="mt-3 text-sm text-neutral-500">
                                    No reviews yet.
                                </p>
                            ) : (
                                <ol className="mt-4 space-y-3">
                                    {restaurantStats.mostReviewed.map((restaurant) => (
                                        <li
                                            key={restaurant._id}
                                            className="flex items-start justify-between gap-4"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {restaurant.name}
                                                </p>
                                                <p className="text-sm text-neutral-500">
                                                    {restaurant.cuisine} · {restaurant.borough}
                                                </p>
                                            </div>
                                            <p className="shrink-0 text-sm font-semibold">
                                                {restaurant.scoreCount} reviews
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>

                        <div className="rounded-xl border border-neutral-200 p-5">
                            <h3 className="font-semibold">Restaurants by cuisine</h3>
                            <ul className="mt-4 space-y-3">
                                {restaurantStats.byCuisine.map((item) => (
                                    <li
                                        key={item._id}
                                        className="flex justify-between gap-4 text-sm"
                                    >
                                        <span>{item._id}</span>
                                        <span className="text-neutral-500">
                                            {item.restaurantCount} restaurants · {item.reviewCount} reviews
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-xl border border-neutral-200 p-5">
                            <h3 className="font-semibold">Restaurants by borough</h3>
                            <ul className="mt-4 space-y-3">
                                {restaurantStats.byBorough.map((item) => (
                                    <li
                                        key={item._id}
                                        className="flex justify-between gap-4 text-sm"
                                    >
                                        <span>{item._id}</span>
                                        <span className="text-neutral-500">
                                            {item.restaurantCount} restaurants · {item.reviewCount} reviews
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}