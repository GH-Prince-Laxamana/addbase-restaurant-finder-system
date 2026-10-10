import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ScrollRestoration } from "../components/ScrollRestoration";
import { PageLoader } from "../components/PageLoader";
import { DiscoverySkeleton } from "../components/DiscoverySkeleton";
import { AdminContentSkeleton, AuthSkeleton, DetailSkeleton, PageSkeleton } from "../components/LoadingSkeletons";
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { AdminRoute } from "./AdminRoute";
const HomePage = lazy(() => import("../pages/public/HomePage").then(module => ({ default: module.HomePage })));
const RestaurantsPage = lazy(() => import("../pages/public/RestaurantsPage").then(module => ({ default: module.RestaurantsPage })));
const RestaurantDetailPage = lazy(() => import("../pages/public/RestaurantDetailPage").then(module => ({ default: module.RestaurantDetailPage })));
const FavoritesPage = lazy(() => import("../pages/public/FavoritesPage").then(module => ({ default: module.FavoritesPage })));
const LoginPage = lazy(() => import("../pages/auth/LoginPage").then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage").then(module => ({ default: module.AdminDashboardPage })));
const AdminRestaurantsPage = lazy(() => import("../pages/admin/AdminRestaurantsPage").then(module => ({ default: module.AdminRestaurantsPage })));
const AdminReviewsPage = lazy(() => import("../pages/admin/AdminReviewsPage").then(module => ({ default: module.AdminReviewsPage })));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage").then(module => ({ default: module.NotFoundPage })));
export function AppRoutes() {
    return <BrowserRouter><ScrollRestoration /><Routes>
        <Route element={<PublicLayout />}>
            <Route path="/" element={<PageLoader fallback={<DiscoverySkeleton home />}><HomePage /></PageLoader>} />
            <Route path="/restaurants" element={<PageLoader fallback={<DiscoverySkeleton />}><RestaurantsPage /></PageLoader>} />
            <Route path="/restaurants/:id" element={<PageLoader fallback={<DetailSkeleton />}><RestaurantDetailPage /></PageLoader>} />
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<PageLoader fallback={<AuthSkeleton />}><LoginPage /></PageLoader>} />
                <Route path="/register" element={<PageLoader fallback={<AuthSkeleton registration />}><RegisterPage /></PageLoader>} />
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path="/favorites" element={<PageLoader fallback={<DiscoverySkeleton favorites />}><FavoritesPage /></PageLoader>} />
            </Route>
        </Route>
        <Route element={<GuestRoute />}><Route path="/admin/login" element={<PageLoader fallback={<AuthSkeleton admin />}><LoginPage mode="admin" /></PageLoader>} /></Route>
        <Route element={<AdminRoute />}><Route element={<AdminLayout />}>
            <Route path="/admin" element={<PageLoader fallback={<AdminContentSkeleton page="/admin" />}><AdminDashboardPage /></PageLoader>} />
            <Route path="/admin/restaurants" element={<PageLoader fallback={<AdminContentSkeleton page="/admin/restaurants" />}><AdminRestaurantsPage /></PageLoader>} />
            <Route path="/admin/reviews" element={<PageLoader fallback={<AdminContentSkeleton page="/admin/reviews" />}><AdminReviewsPage /></PageLoader>} />
        </Route></Route>
        <Route path="/not-found" element={<PageLoader fallback={<PageSkeleton />}><NotFoundPage /></PageLoader>} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes></BrowserRouter>;
}
