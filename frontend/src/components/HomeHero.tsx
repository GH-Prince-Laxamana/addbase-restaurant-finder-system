import { ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { buttonStyles } from "./ui/styles";
import { RestaurantSearchForm } from "./RestaurantSearchForm";
import heroImage from "../assets/restaurants/cafebouloud_05.webp";

export function HomeHero() {
    const navigate = useNavigate();
    function handleSearch(query: string) {
        navigate(query ? `/restaurants?q=${encodeURIComponent(query)}` : "/restaurants");
    }
    return <section className="relative isolate grid h-svh min-h-[650px] place-items-center bg-[#342d23] px-[22px] pt-[180px] pb-[90px] md:min-h-[680px] md:px-6 md:pt-[155px] md:pb-[100px]" aria-label="Discover your next restaurant">
        <img className="absolute inset-0 -z-20 size-full object-cover object-[center_56%]" src={heroImage} alt="" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#20180f70,#20180f80_60%,#20180f90)]" />
        <div className="flex w-full max-w-[960px] flex-col items-center text-center motion-safe:animate-arrive">
            <h1 className="text-[clamp(2.1rem,9vw,2.7rem)] font-semibold leading-[1.14] tracking-[-.03em] text-background min-[481px]:text-[clamp(2.5rem,7vw,3.8rem)] md:text-[clamp(2.8rem,5.6vw,5rem)]">Find a Restaurant<br />Worth Craving</h1>
            <p className="mt-7 mb-9 max-w-[650px] text-[.85rem] leading-[1.9] text-background min-[481px]:text-[.9rem] md:text-base">Exceptional flavors. Memorable tables.<br className="hidden max-[480px]:block" /> Discover your next favorite place to dine.</p>
            <RestaurantSearchForm initialValue="" onSearch={handleSearch} clearSearchOnReset={false} className="max-w-[620px]" />
            <a href="#home-restaurants" className={buttonStyles("light", "mt-[26px] focus-visible:outline-background")} onClick={event => {
                const listings = document.getElementById("home-restaurants");
                if (!listings) return;
                event.preventDefault();
                listings.focus({ preventScroll: true });
                listings.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
            }}>Explore All <ArrowDown aria-hidden="true" size={18} strokeWidth={1.6} /></a>
        </div>
    </section>;
}

