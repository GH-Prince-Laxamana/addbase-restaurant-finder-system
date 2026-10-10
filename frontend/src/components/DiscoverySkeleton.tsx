import { RestaurantSkeletons } from "./RestaurantSkeletons";
import { LoadingRegion, Skeleton } from "./ui/Skeleton";
export function DiscoverySkeleton({ home = false, favorites = false }: { home?: boolean; favorites?: boolean }) {
    const heading = favorites ? "Your favorites" : "Explore restaurants";
    if (home) return <main data-scroll-ready="false" className="mx-auto max-w-[1280px] px-[22px] pt-2.5 pb-[55px] md:px-10 md:pt-4 md:pb-[90px]"><section id="home-restaurants" tabIndex={-1} className="mt-12 scroll-mt-8 md:mt-[75px]"><header className="mb-[34px]"><h2 className="text-[clamp(2.2rem,3.6vw,3.1rem)]">Find your next favorite.</h2><p className="mt-4 text-[.88rem] text-neutral-600">Explore highly rated spots for your next delicious adventure.</p></header><RestaurantSkeletons /></section></main>;
    return <main data-scroll-ready="false" className={`mx-auto px-6 py-12 ${favorites ? "max-w-5xl" : "max-w-6xl"}`}><header className="mb-8 pb-[18px]"><h1 className="text-[clamp(2.5rem,4vw,3.6rem)]">{heading}</h1><p className="mt-2 text-neutral-600">{favorites ? "The restaurants you've saved for later." : "Find your kind of place. A world of flavor, one neighborhood at a time."}</p></header>
        {!favorites && <LoadingRegion label="Loading discovery controls"><Skeleton className="h-16 w-full rounded-full" /><div className="mt-6 mb-8 grid grid-cols-1 gap-4 py-3 pb-[25px] sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index}><Skeleton className="mb-[9px] ml-3 h-5 w-24" /><Skeleton className="h-12 w-full rounded-full" /></div>)}</div><Skeleton className="mb-5 h-5 w-48" /></LoadingRegion>}
        <RestaurantSkeletons />
    </main>;
}
