import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navigation = [
    { label: "Dashboard", to: "/admin", end: true },
    { label: "Restaurants", to: "/admin/restaurants", end: false },
    { label: "Reviews", to: "/admin/reviews", end: false },
];

export function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
        } catch {
            // AuthContext clears the local session even if the API fails.
        } finally {
            navigate("/admin/login", { replace: true });
        }
    }

    return (
        <div className="min-h-screen bg-white text-neutral-950">
            <header className="border-b border-neutral-200">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                    <NavLink
                        to="/admin"
                        className="text-lg font-bold"
                    >
                        Restaurant Explorer
                        <span className="ml-2 text-sm font-medium text-neutral-500">
                            Admin
                        </span>
                    </NavLink>

                    <div className="flex flex-wrap items-center gap-4">
                        {user && (
                            <span className="hidden text-sm text-neutral-600 sm:inline">
                                {user.name}
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={() => void handleLogout()}
                            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100"
                        >
                            Sign out
                        </button>
                    </div>
                </div>

                <nav
                    aria-label="Admin navigation"
                    className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-6"
                >
                    {navigation.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                [
                                    "whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                                    isActive
                                        ? "border-neutral-950 text-neutral-950"
                                        : "border-transparent text-neutral-500 hover:text-neutral-950",
                                ].join(" ")
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </header>

            <div>
                <Outlet />
            </div>
        </div>
    );
}