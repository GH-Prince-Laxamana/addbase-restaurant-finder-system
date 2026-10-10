import { createContext } from "react";
import { createFavoritesStore } from "../utils/favoritesStore";
export const FavoritesContext = createContext<ReturnType<typeof createFavoritesStore> | null>(null);
