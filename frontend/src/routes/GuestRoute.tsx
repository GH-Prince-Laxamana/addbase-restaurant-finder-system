import { AuthSkeleton } from "../components/LoadingSkeletons";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function GuestRoute() {
    const location = useLocation();
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <AuthSkeleton registration={location.pathname === "/register"} admin={location.pathname === "/admin/login"} />;
    }

    if (user) {
        return (
            <Navigate
                to={user.role === "admin" ? "/admin" : "/"}
                replace
            />
        );
    }

    return <Outlet />;
}