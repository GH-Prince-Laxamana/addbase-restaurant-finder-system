import { LoadingRegion, Skeleton } from "./ui/Skeleton";
import { overviewGridStyles, overviewMetricStyles, panelStyles } from "./ui/styles";

export function DetailSkeleton() {
    return <main data-scroll-ready="false" className="mx-auto max-w-4xl px-6 py-12"><LoadingRegion label="Loading restaurant">
        <Skeleton className="h-5 w-36" /><Skeleton className="mt-[30px] h-[280px] w-full rounded-[20px] md:h-[400px] md:rounded-3xl" />
        <Skeleton className="mx-auto mt-[26px] h-3 w-3/4" />
        <div className="mt-8 border-b border-neutral-200 pb-8"><Skeleton className="h-4 w-48" /><Skeleton className="mt-3 h-12 w-4/5" /><Skeleton className="mt-4 h-6 w-2/3" /><Skeleton className="mt-5 h-12 w-48 rounded-full" /><div className="mt-6 flex gap-6"><Skeleton className="h-14 w-32" /><Skeleton className="h-14 w-32" /></div></div>
        <Skeleton className="mt-10 h-7 w-28" /><ReviewSkeletons />
    </LoadingRegion></main>;
}
export function ReviewSkeletons({ moderation = false }: { moderation?: boolean }) {
    return <LoadingRegion label="Loading reviews" className="mt-[30px]"><ul className={moderation ? "space-y-4" : ""}>
        {Array.from({ length: 3 }, (_, index) => <li key={index} className={moderation ? `${panelStyles} py-7` : "border-t border-neutral-200 py-7"}>
            <div className="flex items-center gap-[14px]">{!moderation && <Skeleton className="size-11 shrink-0 rounded-full" />}<div className="flex-1"><Skeleton className="h-5 w-40" /><Skeleton className="mt-1.5 h-3 w-28" /></div><Skeleton className="h-4 w-[88px]" /></div>
            <div className={moderation ? "mt-5 space-y-2" : "mt-5 space-y-2 md:ml-[58px]"}><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-4/5" />{moderation && <><Skeleton className="mt-4 h-3 w-48" /><Skeleton className="h-3 w-56" /></>}</div>
        </li>)}
    </ul></LoadingRegion>;
}
const columns = ["Restaurant", "Cuisine", "Borough", "Rating", "Status", "Actions"];
export function AdminTableSkeleton() {
    return <LoadingRegion label="Loading restaurants" className="overflow-x-auto"><table className="w-full min-w-190 text-left text-sm">
        <thead className="bg-neutral-50 text-neutral-600"><tr>{columns.map(label => <th key={label} scope="col" className="px-5 py-4 font-medium">{label}</th>)}</tr></thead>
        <tbody className="divide-y divide-neutral-200">{Array.from({ length: 6 }, (_, index) => <tr key={index}>{columns.map((label, column) => <td key={label} className="px-5 py-4"><Skeleton className={column === 0 ? "h-5 w-40" : "h-5 w-24"} />{column === 0 && <Skeleton className="mt-1 h-3 w-24" />}</td>)}</tr>)}</tbody>
    </table></LoadingRegion>;
}
export function OverviewSkeleton() {
    return <LoadingRegion label="Loading overview"><div className={overviewGridStyles}>{Array.from({ length: 6 }, (_, index) => <div key={index} className={overviewMetricStyles}>
        <div className="max-sm:min-h-[2.8em]"><Skeleton className="h-4 w-3/4" /></div><Skeleton className="mt-4 h-[clamp(2.4rem,4.3vw,3.5rem)] w-1/2" />{index === 5 && <Skeleton className="my-2.5 h-4 w-[88px]" />}<Skeleton className="mt-[11px] h-3 w-4/5" />
    </div>)}</div></LoadingRegion>;
}
export function AnalyticsSkeleton() {
    return <LoadingRegion label="Loading analytics"><div className="grid grid-cols-1 gap-[18px] md:grid-cols-2 xl:gap-[25px]">{Array.from({ length: 4 }, (_, index) => <section key={index} className={panelStyles}>
        <Skeleton className="h-5 w-40" /><Skeleton className="mt-[9px] h-3 w-4/5" />
        <div className="mt-[23px]">{Array.from({ length: 5 }, (_, row) => <div key={row} className="flex items-center justify-between gap-[14px] border-t border-neutral-100 py-[17px]"><div className="flex-1"><Skeleton className="h-4 w-4/5" /><Skeleton className="mt-1 h-3 w-1/2" /></div><Skeleton className="h-4 w-16" /></div>)}</div>
    </section>)}</div></LoadingRegion>;
}
export function AuthSkeleton({ registration = false, admin = false }: { registration?: boolean; admin?: boolean }) {
    const content = <LoadingRegion label="Loading account" className="mx-auto w-full max-w-[480px]">
        {registration && <Skeleton className="mb-8 h-4 w-32" />}
        <div className="mb-8 text-center"><p className="mb-2 font-display text-[1.25rem] text-neutral-500">Hapag</p><h1 className="text-[2.7rem]">{registration ? "Create your account" : admin ? "Administrator sign in" : "Welcome back"}</h1><p className="mt-3 text-neutral-600">{registration ? "Discover and save your favorite restaurants." : admin ? "Sign in to manage restaurants and reviews." : "Sign in to manage your reviews and favorite restaurants."}</p></div>
        <div className="space-y-5">{Array.from({ length: registration ? 4 : 2 }, (_, index) => <div key={index}><Skeleton className="mb-2 h-4 w-20" /><Skeleton className="h-12 w-full rounded-xl" /></div>)}<Skeleton className="h-12 w-full rounded-full" /></div>
    </LoadingRegion>;
    return <main data-scroll-ready="false" className={registration ? "min-h-[70vh] px-4 py-12" : "flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12"}>{content}</main>;
}
export function PageSkeleton() {
    return <main data-scroll-ready="false" className="flex min-h-screen items-center justify-center px-4 py-12"><LoadingRegion label="Loading page" className="w-full max-w-lg"><Skeleton className="mx-auto h-24 w-36" /><Skeleton className="mx-auto mt-5 h-8 w-3/4" /><Skeleton className="mx-auto mt-3 h-5 w-4/5" /><div className="mt-8 flex justify-center gap-3"><Skeleton className="h-12 w-36 rounded-full" /><Skeleton className="h-12 w-36 rounded-full" /></div></LoadingRegion></main>;
}
export function AdminContentSkeleton({ page }: { page: string }) {
    return <main data-scroll-ready="false" className="min-w-0 p-6 lg:px-10 lg:py-12"><LoadingRegion label="Loading administration"><Skeleton className="h-12 w-64" /><Skeleton className="mt-4 mb-10 h-4 w-80 max-w-full" /></LoadingRegion>{page.includes("restaurants") ? <AdminTableSkeleton /> : page.includes("reviews") ? <ReviewSkeletons moderation /> : <><OverviewSkeleton /><div className="mt-12"><AnalyticsSkeleton /></div></>}</main>;
}
export function AdminRouteSkeleton({ page }: { page: string }) {
    return <div className="min-h-screen bg-background lg:grid lg:grid-cols-[245px_minmax(0,1fr)]"><div className="bg-neutral-50 p-6 lg:p-[30px]"><Skeleton className="h-10 w-28" /><div className="mt-12 hidden space-y-4 lg:block"><Skeleton className="h-12 w-full rounded-full" /><Skeleton className="h-12 w-full rounded-full" /><Skeleton className="h-12 w-full rounded-full" /></div></div><AdminContentSkeleton page={page} /></div>;
}
