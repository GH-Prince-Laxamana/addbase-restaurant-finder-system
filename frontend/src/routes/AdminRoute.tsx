import { AdminRouteSkeleton } from "../components/LoadingSkeletons";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function AdminRoute() {
    const location = useLocation();
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <AdminRouteSkeleton page={location.pathname} />;
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}