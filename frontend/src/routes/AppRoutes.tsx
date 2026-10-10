import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { PublicLayout } from "../layouts/PublicLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";

import { HomePage } from "../pages/public/HomePage";
import { RestaurantsPage } from "../pages/public/RestaurantsPage";
import { RestaurantDetailPage } from "../pages/public/RestaurantDetailPage";
import { FavoritesPage } from "../pages/public/FavoritesPage";

import { LoginPage } from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/admin/login"
                    element={<LoginPage mode="admin" />}
                />

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
                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />
                    <Route path="/register"
                        element={<RegisterPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/favorites"
                            element={<FavoritesPage />}
                        />
                    </Route>
                </Route>

                <Route element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route
                            path="/admin"
                            element={
                                <AdminDashboardPage />
                            }
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