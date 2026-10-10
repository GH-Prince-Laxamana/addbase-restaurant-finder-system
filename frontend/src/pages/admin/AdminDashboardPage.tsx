import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CountUp } from "../../components/CountUp";
import { StarRating } from "../../components/StarRating";
import { OverviewSkeleton, AnalyticsSkeleton } from "../../components/LoadingSkeletons";
import { buttonStyles, overviewGridStyles, overviewMetricStyles, panelStyles } from "../../components/ui/styles";
import { useAdminOverview, useAdminRestaurantStats } from "../../hooks/useAdminStats";
import type { RestaurantAnalyticsItem } from "../../services/admin.service";

function StatCard({ label, value, decimals = 0, note }: { label: string; value: number; decimals?: number; note: string }) {
    return <div className={overviewMetricStyles}>
        <dt className="text-[.78rem] font-medium text-neutral-700 max-sm:min-h-[2.8em]">{label}</dt>
        <dd><span className="mt-4 block text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.35] font-semibold tracking-[-.055em] tabular-nums"><CountUp value={value} decimals={decimals} /></span>
            {decimals > 0 && <div className="my-2.5 flex h-4"><StarRating value={value} /></div>}
            <span className="mt-[11px] block text-[.67rem] text-neutral-500">{note}</span>
        </dd>
    </div>;
}
function AnalyticsPanel({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return <section className={panelStyles}><header><h3 className="font-sans text-[.96rem] font-semibold tracking-[-.02em]">{title}</h3><p className="mt-[9px] text-[.72rem] text-neutral-600">{description}</p></header>{children}</section>;
}
function RestaurantRanking({ title, description, items, metric }: { title: string; description: string; items: RestaurantAnalyticsItem[]; metric: "rating" | "reviews" }) {
    return <AnalyticsPanel title={title} description={description}>
        {items.length === 0 ? <p className="py-[30px] text-sm text-neutral-600">No reviewed restaurants yet.</p> : <ol className="mt-[23px]">{items.map((item, index) => <li key={item._id} className="flex items-center gap-[14px] border-t border-neutral-100 py-[17px]">
            <span className="w-4 shrink-0 text-[.73rem] text-neutral-500 tabular-nums">{index + 1}</span>
            <div className="min-w-0 flex-1"><Link to={`/restaurants/${item._id}`} className="text-[.8rem] font-medium [overflow-wrap:anywhere]">{item.name}</Link><p className="mt-1 text-[.66rem] text-neutral-500">{item.cuisine} · {item.borough}</p></div>
            <span className="text-[.86rem] font-semibold whitespace-nowrap tabular-nums">{metric === "rating" ? <StarRating value={Number(item.avgScore ?? 0)} showValue /> : <>{(item.scoreCount ?? 0).toLocaleString()}<small className="text-[.65rem] font-normal text-neutral-600"> reviews</small></>}</span>
        </li>)}</ol>}
    </AnalyticsPanel>;
}
function Distribution({ title, description, items, label }: { title: string; description: string; items: RestaurantAnalyticsItem[]; label: string }) {
    const maximum = Math.max(1, ...items.map(item => item.restaurantCount ?? 0));
    return <AnalyticsPanel title={title} description={description}>
        {items.length === 0 ? <p className="py-[30px] text-sm text-neutral-600">No restaurant data available.</p> : <div className="mt-6 overflow-x-auto"><table className="w-full text-[.73rem]">
            <thead><tr>{[label, "Restaurants", "Reviews"].map((column, index) => <th key={column} scope="col" className={`border-b border-neutral-200 bg-transparent py-2.5 text-[.65rem] font-semibold text-neutral-600 whitespace-nowrap ${index === 0 ? "text-left" : "text-right"}`}>{column}</th>)}</tr></thead>
            <tbody>{items.map(item => <tr key={item._id} className="border-b border-neutral-100 last:border-0">
                <th scope="row" className="py-[15px] pr-3 text-left font-medium text-neutral-800 [overflow-wrap:anywhere]">{item._id || "Unspecified"}</th>
                <td className="py-[15px] pl-3 text-right tabular-nums"><div className="flex items-center justify-end gap-3"><span>{(item.restaurantCount ?? 0).toLocaleString()}</span><span className="h-1 w-[50px] overflow-hidden rounded bg-neutral-100" aria-hidden="true"><span className="block h-full rounded-[inherit] bg-burgundy" style={{ width: `${((item.restaurantCount ?? 0) / maximum) * 100}%` }} /></span></div></td>
                <td className="py-[15px] pl-3 text-right tabular-nums">{(item.reviewCount ?? 0).toLocaleString()}</td>
            </tr>)}</tbody>
        </table></div>}
    </AnalyticsPanel>;
}
function SectionHeading({ id, title, description }: { id: string; title: string; description: string }) {
    return <div className="mb-5 flex flex-col items-start justify-between gap-[7px] md:flex-row md:items-baseline md:gap-6"><h2 id={id} className="font-sans text-[1.15rem] font-semibold tracking-[-.015em]">{title}</h2><p className="text-[.76rem] text-neutral-600">{description}</p></div>;
}
export function AdminDashboardPage() {
    const overview = useAdminOverview();
    const analytics = useAdminRestaurantStats();
    const stats = overview.data;
    const restaurantStats = analytics.data;
    function refresh() { overview.refetch(); analytics.refetch(); }
    return <main data-scroll-ready={!(overview.showSkeletons || analytics.showSkeletons)} className="mx-auto min-h-[60vh] max-w-7xl p-6 sm:p-8 lg:px-10 lg:py-12">
        <header className="mb-[38px] flex flex-wrap items-start justify-between gap-3 md:flex-nowrap md:gap-6"><div><p className="text-sm text-neutral-500">Administration</p><h1 className="mt-2.5 mb-[14px] text-[clamp(2.2rem,3.7vw,3.4rem)]">Dashboard</h1><p className="text-[.85rem] text-neutral-600">Restaurant performance and community activity.</p></div><button type="button" onClick={refresh} disabled={overview.isLoading || analytics.isLoading} className={buttonStyles("secondary")}>{overview.isLoading || analytics.isLoading ? "Refreshing…" : "Refresh dashboard"}</button></header>
        {overview.error && <div role="alert" className="mb-6 rounded-xl bg-red-50 px-6 py-5 text-sm text-red-700"><p>{overview.error.message}</p><button type="button" onClick={overview.refetch} className="pt-2.5 underline">Try again</button></div>}
        <section aria-labelledby="overview-title"><SectionHeading id="overview-title" title="Overview" description="Current totals across Hapag" />
            {!stats ? overview.showSkeletons ? <OverviewSkeleton /> : <p className="py-[30px] text-neutral-600">Overview unavailable.</p> : <dl className={overviewGridStyles} aria-busy={overview.isLoading}>
                <StatCard label="Total restaurants" value={stats.restaurants.total} note="Across the restaurant directory" />
                <StatCard label="Active restaurants" value={stats.restaurants.active} note="Available for discovery" />
                <StatCard label="Inactive restaurants" value={stats.restaurants.inactive} note="Currently unavailable" />
                <StatCard label="Registered users" value={stats.users} note="Hapag community members" />
                <StatCard label="Total reviews" value={stats.reviews} note="Submitted by the community" />
                <StatCard label="Average rating" value={stats.restaurants.averageRating} decimals={2} note="Out of 5 across rated restaurants" />
            </dl>}
        </section>
        <section className="mt-[45px]" aria-labelledby="analytics-title"><SectionHeading id="analytics-title" title="Restaurant analytics" description="Rankings and distribution across the directory" />
            {analytics.error && <div role="alert" className="mb-6 rounded-xl bg-red-50 px-6 py-5 text-sm text-red-700"><p>{analytics.error.message}</p><button type="button" onClick={analytics.refetch} className="pt-2.5 underline">Try again</button></div>}
            {analytics.showSkeletons && <AnalyticsSkeleton />}
            {restaurantStats && <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2 xl:gap-[25px]" aria-busy={analytics.isLoading}>
                <RestaurantRanking title="Highest rated" description="Restaurants ranked by average diner rating" items={restaurantStats.topRated} metric="rating" />
                <RestaurantRanking title="Most reviewed" description="Restaurants with the most community feedback" items={restaurantStats.mostReviewed} metric="reviews" />
                <Distribution title="By cuisine" description="Restaurant and review totals for each cuisine" items={restaurantStats.byCuisine} label="Cuisine" />
                <Distribution title="By borough" description="Restaurant and review totals by neighborhood" items={restaurantStats.byBorough} label="Borough" />
            </div>}
        </section>
    </main>;
}
