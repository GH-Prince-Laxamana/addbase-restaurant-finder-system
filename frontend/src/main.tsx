import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { FavoritesProvider } from "./context/FavoritesProvider";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
            <FavoritesProvider><App /></FavoritesProvider>
        </AuthProvider>
    </StrictMode>
);