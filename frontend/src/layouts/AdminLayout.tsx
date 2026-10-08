import { Outlet } from "react-router-dom";

export function AdminLayout() {
    return (
        <div>
            <header>
                <nav>
                    <strong>Admin</strong>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}