export interface QuerySnapshot<T> { data: T | null; error: Error | null; isLoading: boolean; }
export function createRequestCache<T>(ttl = 60_000, maxEntries = 40) {
    type Entry = { snapshot: QuerySnapshot<T>; updatedAt: number; version: number; listeners: Set<() => void>; pending?: Promise<void>; request?: () => Promise<T> };
    const entries = new Map<string, Entry>();
    function entry(key: string): Entry {
        let value = entries.get(key);
        if (!value) {
            value = { snapshot: { data: null, error: null, isLoading: true }, updatedAt: 0, version: 0, listeners: new Set() };
            entries.set(key, value);
            if (entries.size > maxEntries) {
                for (const [oldKey, old] of entries) {
                    if (oldKey !== key && !old.listeners.size && !old.pending) { entries.delete(oldKey); break; }
                }
            }
        }
        return value;
    }
    function emit(value: Entry, snapshot: QuerySnapshot<T>) { value.snapshot = snapshot; value.listeners.forEach(listener => listener()); }
    function fetch(key: string, request: () => Promise<T>, force = false): Promise<void> {
        const value = entry(key);
        value.request = request;
        if (value.pending) return value.pending;
        if (!force && value.snapshot.data && value.updatedAt > 0 && Date.now() - value.updatedAt < ttl) return Promise.resolve();
        const startVersion = value.version;
        emit(value, { ...value.snapshot, isLoading: true, error: null });
        value.pending = Promise.resolve().then(request).then(data => {
            if (startVersion !== value.version) return;
            value.updatedAt = Date.now();
            emit(value, { data, error: null, isLoading: false });
        }, error => {
            if (startVersion !== value.version) return;
            emit(value, { data: value.snapshot.data, error: error instanceof Error ? error : new Error("Unable to load restaurants."), isLoading: false });
        }).finally(() => {
            value.pending = undefined;
            if (startVersion !== value.version && value.listeners.size && value.request) return fetch(key, value.request, true);
        });
        return value.pending;
    }
    return {
        getSnapshot: (key: string) => entry(key).snapshot,
        subscribe(key: string, listener: () => void) { const value = entry(key); value.listeners.add(listener); return () => { value.listeners.delete(listener); }; },
        fetch,
        invalidate() {
            for (const [key, value] of entries) {
                value.updatedAt = 0;
                value.version++;
                if (value.listeners.size && value.request) void fetch(key, value.request, true);
            }
        },
        update(transform: (data: T) => T) {
            for (const value of entries.values()) {
                if (!value.snapshot.data) continue;
                const data = transform(value.snapshot.data);
                if (data !== value.snapshot.data) emit(value, { ...value.snapshot, data });
            }
        },
    };
}
