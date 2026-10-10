import { api } from "./api";
import type {
    Favorite,
    FavoriteRecord,
} from "../types/api";

interface FavoritesResponse {
    favorites: Favorite[];
}

interface FavoriteResponse {
    favorite: FavoriteRecord;
}

export async function getFavorites(): Promise<Favorite[]> {
    const response = await api.get<FavoritesResponse>(
        "/favorites"
    );

    return response.favorites;
}

export async function addFavorite(
    restaurantId: string
): Promise<FavoriteRecord> {
    const response = await api.post<FavoriteResponse>(
        `/restaurants/${encodeURIComponent(restaurantId)}/favorite`
    );

    return response.favorite;
}

export async function removeFavorite(
    restaurantId: string
): Promise<void> {
    return api.delete<void>(
        `/restaurants/${encodeURIComponent(restaurantId)}/favorite`
    );
}