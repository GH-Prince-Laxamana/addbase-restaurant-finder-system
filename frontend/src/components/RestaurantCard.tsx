import { restaurantAddressStyles, restaurantBottomStyles, restaurantCardStyles, restaurantContentStyles, restaurantMetaStyles, restaurantPhotoStyles, restaurantTitleStyles } from "./ui/styles";
import { StarRating } from "./StarRating";
import { CardFavoriteToggle } from "./CardFavoriteToggle";
import { useReveal } from "../hooks/useReveal";
import { Link, useLocation } from "react-router-dom";
import type { Restaurant } from "../types/api";
import { getRestaurantImage } from "../utils/restaurantImages";

export function RestaurantCard({ restaurant, index = 0 }: { restaurant: Restaurant; index?: number }) {
    const ref = useReveal<HTMLElement>(Math.min(index * 50, 250));
    const location = useLocation();
    const linkState = { listLocation: { pathname: location.pathname, search: location.search } };
    return <article ref={ref} className={restaurantCardStyles}>
        <div className="relative"><Link to={`/restaurants/${restaurant._id}`} state={linkState} className={restaurantPhotoStyles} aria-label={`Explore ${restaurant.name}`}>
            <img className="aspect-[1.45] w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.025]" src={getRestaurantImage(restaurant._id)} alt={`${restaurant.cuisine} restaurant inspiration`} loading="lazy" />
        </Link><CardFavoriteToggle restaurant={restaurant} />{!restaurant.isActive && <p className="absolute bottom-3 left-[14px] rounded-md bg-background px-2.5 py-[5px] text-[.7rem] text-amber-700">Currently unavailable</p>}</div>
        <div className={restaurantContentStyles}>
            <div className={restaurantMetaStyles}><span className="min-w-0">{restaurant.cuisine} · {restaurant.borough}</span><span className="whitespace-nowrap"><StarRating value={Number(restaurant.avgScore)} showValue unrated={restaurant.scoreCount === 0} /></span></div>
            <h3 className={restaurantTitleStyles}><Link to={`/restaurants/${restaurant._id}`} state={linkState}>{restaurant.name}</Link></h3>
            <p className={restaurantAddressStyles}>{restaurant.address.street}{restaurant.address.zipcode ? `, ${restaurant.address.zipcode}` : ""}</p>
            <div className={restaurantBottomStyles}><span className="text-neutral-500">{restaurant.scoreCount} reviews</span><Link to={`/restaurants/${restaurant._id}`} state={linkState} className="py-2 text-burgundy">Explore </Link></div>
        </div>
    </article>;
}
