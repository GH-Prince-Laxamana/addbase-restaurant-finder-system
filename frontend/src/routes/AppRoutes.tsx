import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { PublicLayout } from "../layouts/PublicLayout";
import { AdminLayout } from "../layouts/AdminLayout";

import { HomePage } from "../pages/public/HomePage";
import { RestaurantsPage } from "../pages/public/RestaurantsPage";
import { RestaurantDetailPage } from "../pages/public/RestaurantDetailPage";
import { FavoritesPage } from "../pages/public/FavoritesPage";

import { ProtectedRoute } from "./ProtectedRoute";
import RegisterPage from "../pages/auth/RegisterPage";
import { GuestRoute } from "./GuestRoute";
import { LoginPage } from "../pages/auth/LoginPage";

import { AdminRoute } from "./AdminRoute";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminRestaurantsPage } from "../pages/admin/AdminRestaurantsPage";

import { NotFoundPage } from "../pages/NotFoundPage";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/restaurants"
                        element={<RestaurantsPage />}
                    />
                    <Route
                        path="/restaurants/:id"
                        element={<RestaurantDetailPage />}
                    />
                    <Route element={<GuestRoute />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/favorites"
                            element={<FavoritesPage />}
                        />
                    </Route>
                </Route>

                <Route element={<GuestRoute />}>
                    <Route
                        path="/admin/login"
                        element={<LoginPage mode="admin" />}
                    />
                </Route>

                <Route element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route
                            path="/admin"
                            element={<AdminDashboardPage />}
                        />
                        <Route
                            path="/admin/restaurants"
                            element={<AdminRestaurantsPage />}
                        />
                    </Route>
                </Route>

                <Route
                    path="/not-found"
                    element={<NotFoundPage />}
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/not-found"
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}