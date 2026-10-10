import { useCallback, useContext, useSyncExternalStore } from "react";
import { FavoritesContext } from "../context/favorites-context";
export function useFavorites() {
    const store = useContext(FavoritesContext);
    if (!store) throw new Error("useFavorites must be used within FavoritesProvider.");
    const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);
    const refetch = useCallback(() => { void store.load(true); }, [store]);
    return { ...snapshot, error: snapshot.loadError ?? snapshot.mutationError, isMutating: snapshot.pendingIds.size > 0, refetch, add: store.add, remove: store.remove };
}
