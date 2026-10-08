import { Outlet } from "react-router-dom";

export function PublicLayout() {
    return (
        <div>
            <header>
                <nav>
                    <strong>Restaurant Explorer</strong>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}