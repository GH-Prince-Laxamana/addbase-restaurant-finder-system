import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function PublicLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        const destination =
            user?.role === "admin" ? "/admin/login" : "/login";

        try {
            await logout();
        } catch {
            // AuthContext clears the local session even if the API fails.
        } finally {
            navigate(destination, { replace: true });
        }
    }

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        [
            "whitespace-nowrap text-sm font-medium transition-colors",
            isActive
                ? "text-neutral-950"
                : "text-neutral-500 hover:text-neutral-950",
        ].join(" ");

    return (
        <div className="min-h-screen bg-white text-neutral-950">
            <header className="border-b border-neutral-200">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                    <Link to="/" className="text-lg font-bold">
                        Restaurant Explorer
                    </Link>

                    <nav
                        aria-label="Main navigation"
                        className="flex flex-wrap items-center gap-5"
                    >
                        <NavLink to="/" end className={linkClass}>
                            Home
                        </NavLink>

                        <NavLink
                            to="/restaurants"
                            className={linkClass}
                        >
                            Restaurants
                        </NavLink>

                        {user?.role === "user" && (
                            <NavLink
                                to="/favorites"
                                className={linkClass}
                            >
                                Favorites
                            </NavLink>
                        )}

                        {user?.role === "admin" && (
                            <NavLink
                                to="/admin"
                                className={linkClass}
                            >
                                Admin dashboard
                            </NavLink>
                        )}
                    </nav>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <span className="hidden text-sm text-neutral-600 sm:inline">
                                    {user.name}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => void handleLogout()}
                                    className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-neutral-700 hover:text-neutral-950"
                                >
                                    Sign in
                                </Link>

                                <Link
                                    to="/register"
                                    className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <div>
                <Outlet />
            </div>
        </div>
    );
}