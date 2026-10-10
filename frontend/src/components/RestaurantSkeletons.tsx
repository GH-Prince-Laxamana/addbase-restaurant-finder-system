import { LoadingRegion, Skeleton } from "./ui/Skeleton";
import { restaurantAddressStyles, restaurantBottomStyles, restaurantCardStyles, restaurantContentStyles, restaurantGridStyles, restaurantMetaStyles, restaurantPhotoStyles, restaurantTitleStyles } from "./ui/styles";
export function RestaurantSkeletons({ count = 6 }: { count?: number }) {
    return <LoadingRegion label="Loading restaurants"><ul className={restaurantGridStyles}>
        {Array.from({ length: count }, (_, index) => <li key={index}><article className={restaurantCardStyles}>
            <div className={restaurantPhotoStyles}><Skeleton className="aspect-[1.45] w-full rounded-none" /></div>
            <div className={restaurantContentStyles}>
                <div className={restaurantMetaStyles}><Skeleton className="h-[1em] w-[65%]" /><Skeleton className="h-[1em] w-28 shrink-0" /></div>
                <h3 className={restaurantTitleStyles}><Skeleton className="h-[1.6em] w-[85%]" /></h3>
                <p className={restaurantAddressStyles}><Skeleton className="h-[2.6em] w-[80%]" /></p>
                <div className={restaurantBottomStyles}><Skeleton className="h-[1em] w-[85px]" /><Skeleton className="h-[1em] w-[55px]" /></div>
            </div>
        </article></li>)}
    </ul></LoadingRegion>;
}
