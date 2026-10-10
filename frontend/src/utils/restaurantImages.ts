const imageModules = import.meta.glob<string>(
    "../assets/restaurants/*.{svg,jpg,jpeg,png,webp}",
    {
        eager: true,
        query: "?url",
        import: "default",
    }
);

const images = Object.entries(imageModules)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([, url]) => url);

const FALLBACK_IMAGE = "/images/restaurant-fallback.jpg";

function hashId(id: string): number {
    let hash = 2166136261;

    for (let i = 0; i < id.length; i++) {
        hash ^= id.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

export function getRestaurantImage(id: string): string {
    if (images.length === 0) {
        return FALLBACK_IMAGE;
    }

    return images[hashId(id) % images.length];
}