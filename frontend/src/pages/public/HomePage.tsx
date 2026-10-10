import { buttonStyles, restaurantGridStyles } from "../../components/ui/styles";
import { Link } from "react-router-dom";
import { useRestaurants } from "../../hooks/useRestaurants";
import { RevealHeading } from "../../components/RevealHeading";
import { RestaurantSkeletons } from "../../components/RestaurantSkeletons";
import { RestaurantCard } from "../../components/RestaurantCard";

export function HomePage() {
    const { data, showSkeletons, error, refetch } = useRestaurants({ sort: "rating", page: 1, limit: 6 });
    return <main data-scroll-ready={!showSkeletons} className="mx-auto max-w-7xl px-5.5 pt-2.5 pb-13.75 md:px-10 md:pt-4 md:pb-22.5">
        <section id="home-restaurants" className="scroll-mt-8 mt-12 md:mt-18.75" tabIndex={-1} aria-labelledby="home-restaurants-title">
            <RevealHeading className="mb-8.5 flex flex-wrap items-end justify-between gap-4 md:gap-7"><div><h2 id="home-restaurants-title" className="text-[clamp(2.2rem,3.6vw,3.1rem)]">Find your next favorite.</h2><p className="mt-4 max-w-135 text-[.88rem] text-neutral-600">Explore highly rated spots for your next delicious adventure.</p></div></RevealHeading>
            {error && <div role="alert" className="py-8.75 [&_p]:mt-3 [&_p]:text-neutral-600 [&_button]:mt-5"><h3>We couldn’t load the restaurants.</h3><p>{error.message}</p><button type="button" onClick={refetch} className={buttonStyles("primary")}>Try again</button></div>}
            {showSkeletons && <RestaurantSkeletons />}
            {!showSkeletons && data && (data.results.length ? <ul className={restaurantGridStyles}>{data.results.map((restaurant, index) => <li key={restaurant._id}><RestaurantCard restaurant={restaurant} index={index} /></li>)}</ul> : <div className="py-8.75 [&_p]:mt-3 [&_p]:text-neutral-600 [&_button]:mt-5">New discoveries are on their way. Check back soon.</div>)}
            <div className="mt-9.5 flex justify-center"><Link to="/restaurants" className={buttonStyles("primary")}>See all restaurants</Link></div>
            <p className="mt-6.5 text-center text-[.68rem] text-neutral-500">Photography is for inspiration and may not depict the listed restaurant.</p>
        </section>
        <section className="mt-12.5 flex flex-col items-start justify-between gap-6 border-t border-neutral-200 pt-8.75 md:mt-20 md:flex-row md:items-center md:gap-9 md:pt-16.25"><RevealHeading><h2 className="text-[clamp(2rem,3vw,2.7rem)]">A few places worth saving.</h2><p className="mt-4.5 max-w-137.5 text-[.85rem] text-neutral-600">Keep the restaurants you love close. Your next great meal starts here.</p></RevealHeading><Link to="/favorites" className={buttonStyles("primary", "whitespace-nowrap")}>Your favorites</Link></section>
    </main>;
}
