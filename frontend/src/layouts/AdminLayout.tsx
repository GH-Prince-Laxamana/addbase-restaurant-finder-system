import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal";
import { buttonStyles, iconStyles } from "../components/ui/styles";
import { useAuth } from "../hooks/useAuth";
const navigation = [{ label: "Dashboard", to: "/admin", end: true }, { label: "Restaurants", to: "/admin/restaurants", end: false }, { label: "Reviews", to: "/admin/reviews", end: false }];
export function AdminLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    async function handleLogout() {
        setMenuOpen(false);
        try { await logout(); } catch { /* Local session is cleared by AuthContext. */ }
        finally { navigate("/admin/login", { replace: true }); }
    }
    const navigationLinks = navigation.map(item => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMenuOpen(false)} className="rounded-full px-5 py-[14px] text-[15px] font-medium text-neutral-600 hover:bg-neutral-200/60 aria-[current=page]:bg-burgundy aria-[current=page]:text-white">{item.label}</NavLink>);
    return <div className="min-h-screen bg-background text-neutral-950 lg:grid lg:grid-cols-[245px_minmax(0,1fr)]">
        <a href="#admin-content" className="absolute -top-24 left-4 z-50 rounded-xl bg-background px-5 py-3 text-burgundy focus:top-3">Skip to content</a>
        <header className="bg-neutral-50 lg:sticky lg:top-0 lg:h-screen lg:py-[35px]">
            <div className="flex h-[88px] items-center justify-between gap-4 px-6 lg:h-auto lg:flex-col lg:items-start lg:gap-8 lg:px-[30px]">
                <NavLink to="/admin" className="font-display text-[32px] leading-none font-semibold tracking-[.02em] text-burgundy">Hapag<span className="ml-2 font-sans text-sm font-medium tracking-normal text-neutral-600 lg:mt-3 lg:ml-0 lg:block">Admin</span></NavLink>
                <button type="button" className={`${iconStyles} lg:hidden`} aria-label="Open admin navigation" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu aria-hidden="true" size={24} /></button>
                <div className="hidden w-full flex-col items-start gap-3 pb-6 lg:flex"><span className="text-sm text-neutral-600">{user?.name}</span><button type="button" onClick={() => void handleLogout()} className={buttonStyles("secondary")}>Sign out</button></div>
            </div>
            <nav aria-label="Admin navigation" className="mt-[26px] hidden flex-col gap-2 px-[18px] lg:flex">{navigationLinks}</nav>
            <NavLink to="/" className="mx-[30px] mt-[50px] hidden py-[14px] text-[14px] text-neutral-600 lg:block">View public site</NavLink>
            <p className="hidden px-[30px] py-[14px] font-display text-base leading-[1.6] text-neutral-500 italic lg:block">The art of a well-kept table.</p>
        </header>
        {menuOpen && <Modal title="Administration" compact onClose={() => setMenuOpen(false)}>
            <nav aria-label="Mobile admin navigation" className="flex flex-col gap-1">{navigationLinks}<NavLink to="/" onClick={() => setMenuOpen(false)} className="px-5 py-3 text-[15px]">View public site</NavLink></nav>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-5"><span>{user?.name}</span><button type="button" onClick={() => void handleLogout()} className={buttonStyles("secondary")}>Sign out</button></div>
        </Modal>}
        <div id="admin-content" tabIndex={-1} className="min-w-0 focus:outline-none [&_main]:min-h-[60vh]"><Outlet /></div>
    </div>;
}
