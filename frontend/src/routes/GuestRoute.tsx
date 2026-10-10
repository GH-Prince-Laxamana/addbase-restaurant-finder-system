import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function GuestRoute() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
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