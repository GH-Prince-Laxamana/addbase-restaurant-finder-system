import { Navigate, Outlet, useLocation } from "react-router-dom";
import { DiscoverySkeleton } from "../components/DiscoverySkeleton";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <DiscoverySkeleton favorites />;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
}