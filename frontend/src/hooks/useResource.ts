import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createRequestCache } from "../utils/requestCache";
// Each mounted resource owns its cache; account-specific admin data is never shared between sessions.
export function useResource<T>(key: string, request: () => Promise<T>) {
    const [cache] = useState(() => createRequestCache<T>());
    const subscribe = useCallback((listener: () => void) => cache.subscribe(key, listener), [cache, key]);
    const getSnapshot = useCallback(() => cache.getSnapshot(key), [cache, key]);
    const snapshot = useSyncExternalStore(subscribe, getSnapshot);
    useEffect(() => { void cache.fetch(key, request); }, [cache, key, request]);
    const refetch = useCallback(() => { cache.invalidate(); }, [cache]);
    const update = useCallback((transform: (data: T) => T) => { cache.update(transform); }, [cache]);
    return { ...snapshot, showSkeletons: snapshot.isLoading && snapshot.data === null, refetch, update };
}
