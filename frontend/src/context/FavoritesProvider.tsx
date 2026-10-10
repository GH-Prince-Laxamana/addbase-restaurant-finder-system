import { useEffect, useMemo, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { addFavorite, getFavorites, removeFavorite } from "../services/favorite.service";
import { subscribeRestaurantUpdates } from "../utils/restaurantCache";
import { createFavoritesStore } from "../utils/favoritesStore";
import { FavoritesContext } from "./favorites-context";

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const userId = user?.id;
    // A fresh store for each session prevents another account's favorites from leaking.
    const store = useMemo(() => createFavoritesStore({
        get: userId ? getFavorites : async () => [], add: addFavorite, remove: removeFavorite,
    }), [userId]);
    useEffect(() => subscribeRestaurantUpdates(store.updateRestaurant), [store]);
    useEffect(() => { if (!isLoading) void store.load(); }, [store, isLoading]);
    return <FavoritesContext.Provider value={store}>{children}</FavoritesContext.Provider>;
}
