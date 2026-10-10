import { useCallback } from "react";
import { getRestaurantById } from "../services/restaurant.service";
import { useResource } from "./useResource";
export function useRestaurant(id: string | undefined) {
    const request = useCallback(() => {
        if (!id) return Promise.reject(new Error("Restaurant ID is required."));
        return getRestaurantById(id);
    }, [id]);
    return useResource(id ?? "", request);
}
