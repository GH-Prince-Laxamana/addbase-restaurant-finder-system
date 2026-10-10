import type { Favorite, FavoriteRecord, Restaurant } from "../types/api";

interface FavoritesApi {
    get: () => Promise<Favorite[]>;
    add: (id: string) => Promise<FavoriteRecord>;
    remove: (id: string) => Promise<void>;
}
export function createFavoritesStore(api: FavoritesApi) {
    let snapshot = { favorites: [] as Favorite[], isLoading: true, loadError: null as Error | null, mutationError: null as Error | null, pendingIds: new Set<string>(), selectedIds: new Set<string>() };
    const listeners = new Set<() => void>();
    let loadPromise: Promise<void> | undefined;
    let loaded = false;
    let version = 0;
    const errorOf = (error: unknown) => error instanceof Error ? error : new Error("Unable to update favorites.");
    function emit(patch: Partial<typeof snapshot>) {
        snapshot = { ...snapshot, ...patch };
        listeners.forEach(listener => listener());
    }
    function load(force = false): Promise<void> {
        if (loadPromise) return loadPromise;
        if (snapshot.pendingIds.size) return Promise.resolve();
        if (loaded && !force) return Promise.resolve();
        const startVersion = version;
        emit({ isLoading: !loaded, loadError: null });
        loadPromise = Promise.resolve().then(api.get).then(favorites => {
            loaded = true;
            if (version === startVersion) emit({ favorites, selectedIds: new Set(favorites.map(item => item.restaurant._id)) });
        }, error => { emit({ loadError: errorOf(error) }); }).finally(() => {
            loadPromise = undefined;
            emit({ isLoading: false });
        });
        return loadPromise;
    }
    async function mutate(id: string, saving: boolean, restaurant?: Restaurant) {
        if (snapshot.pendingIds.has(id)) return;
        if (!loaded) { await load(); if (!loaded) throw snapshot.loadError ?? new Error("Unable to load favorites."); }
        if (snapshot.selectedIds.has(id) === saving) return;
        version++;
        const original = snapshot.favorites.find(item => item.restaurant._id === id);
        const originalIndex = snapshot.favorites.findIndex(item => item.restaurant._id === id);
        const selectedIds = new Set(snapshot.selectedIds);
        const pendingIds = new Set(snapshot.pendingIds).add(id);
        if (saving) selectedIds.add(id); else selectedIds.delete(id);
        const optimistic: Favorite | undefined = restaurant ? { _id: `pending-${id}`, restaurant, createdAt: new Date().toISOString() } : undefined;
        emit({ selectedIds, pendingIds, mutationError: null, favorites: saving ? (optimistic ? [...snapshot.favorites, optimistic] : snapshot.favorites) : snapshot.favorites.filter(item => item.restaurant._id !== id) });
        try {
            if (saving) {
                const result = await api.add(id);
                emit({ favorites: snapshot.favorites.map(item => item._id === `pending-${id}` ? { ...item, _id: result._id, createdAt: result.createdAt } : item) });
            } else await api.remove(id);
        } catch (error) {
            const revertedIds = new Set(snapshot.selectedIds);
            if (saving) revertedIds.delete(id); else revertedIds.add(id);
            const favorites = snapshot.favorites.filter(item => item.restaurant._id !== id);
            if (original) favorites.splice(Math.min(originalIndex, favorites.length), 0, original);
            const nextError = errorOf(error);
            emit({ favorites, selectedIds: revertedIds, mutationError: nextError });
            throw nextError;
        } finally {
            const remaining = new Set(snapshot.pendingIds);
            remaining.delete(id);
            version++;
            emit({ pendingIds: remaining });
        }
        if (saving && !restaurant) await load(true);
    }
    return {
        getSnapshot: () => snapshot,
        subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
        load,
        updateRestaurant(restaurant: Restaurant) {
            if (!snapshot.favorites.some(item => item.restaurant._id === restaurant._id)) return;
            emit({ favorites: snapshot.favorites.map(item => item.restaurant._id === restaurant._id ? { ...item, restaurant: { ...item.restaurant, avgScore: restaurant.avgScore, scoreCount: restaurant.scoreCount } } : item) });
        },
        add: (id: string, restaurant?: Restaurant) => mutate(id, true, restaurant),
        remove: (id: string) => mutate(id, false),
    };
}
