import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Modal } from "../components/Modal";
import { Skeleton } from "../components/ui/Skeleton";
import { buttonStyles, iconStyles } from "../components/ui/styles";
import { HomeHero } from "../components/HomeHero";
import { useAuth } from "../hooks/useAuth";

const navigation = [{ to: "/", label: "Home" }, { to: "/restaurants", label: "Restaurants" }, { to: "/favorites", label: "Favorites" }];
export function PublicLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const isHome = useLocation().pathname === "/";
    async function handleLogout() {
        setMenuOpen(false);
        const destination = user?.role === "admin" ? "/admin/login" : "/login";
        try { await logout(); } catch { /* AuthContext clears the local session if the API fails. */ }
        finally { navigate(destination, { replace: true }); }
    }
    function renderNavigation(mobile = false) {
        const link = mobile ? "block min-h-12 rounded-xl px-4 py-3 text-[15px] font-medium aria-[current=page]:bg-neutral-100 aria-[current=page]:text-burgundy" : `relative py-3 text-[14px] font-medium whitespace-nowrap after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:rounded-full aria-[current=page]:after:bg-current ${isHome ? "text-background hover:text-white" : "text-neutral-600 hover:text-burgundy aria-[current=page]:text-burgundy"}`;
        return <>{navigation.map(item => <NavLink key={item.to} to={item.to} end={item.to === "/"} onClick={() => setMenuOpen(false)} className={link}>{item.label}</NavLink>)}
            <span className={mobile ? "block" : "flex w-[145px] shrink-0 items-center"}>{!authLoading && user?.role === "admin" && <NavLink to="/admin" onClick={() => setMenuOpen(false)} className={link}>Admin dashboard</NavLink>}</span>
        </>;
    }
    function renderAccount(mobile = false) {
        return authLoading ? <><span className="sr-only" role="status">Loading account</span><Skeleton className={`h-4 w-[65px] ${isHome && !mobile ? "bg-white/20" : ""}`} /><Skeleton className={`h-12 w-[138px] rounded-full ${isHome && !mobile ? "bg-white/20" : ""}`} /></> : user ? <>
            <span className={`truncate text-sm ${isHome && !mobile ? "text-background" : "text-neutral-600"}`} title={user.name}>{user.name}</span>
            <button type="button" onClick={() => void handleLogout()} className={buttonStyles(isHome && !mobile ? "inverse" : "secondary")}>Sign out</button>
        </> : <>
            <Link to="/login" onClick={() => setMenuOpen(false)} className={`text-center text-[15px] font-medium ${isHome && !mobile ? "text-background hover:text-white" : "text-neutral-700"}`}>Sign in</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className={buttonStyles("primary", "whitespace-nowrap px-4")}>Join the table</Link>
        </>;
    }
    return <div className="min-h-screen bg-background text-neutral-950">
        <a href="#main-content" className="absolute -top-24 left-4 z-50 rounded-xl bg-background px-5 py-3 text-burgundy focus:top-3">Skip to content</a>
        <header className={isHome ? "absolute inset-x-0 top-0 z-10 bg-transparent" : "bg-background"}>
            <div className="mx-auto grid h-[88px] max-w-[1280px] grid-cols-[1fr_auto] items-center gap-6 px-6 md:px-10 min-[1101px]:h-[100px] min-[1101px]:grid-cols-[auto_minmax(0,1fr)_228px]">
                <Link to="/" className={`font-display text-[29px] leading-none font-semibold tracking-[.02em] md:text-[33px] ${isHome ? "text-background hover:text-white" : "text-burgundy"}`}>HAPAG</Link>
                <button type="button" className={`${iconStyles} min-[1101px]:hidden ${isHome ? "text-background! hover:bg-white/10! hover:text-white!" : ""}`} aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu aria-hidden="true" size={24} /></button>
                <nav aria-label="Main navigation" className="hidden min-w-0 items-center justify-center gap-6 min-[1101px]:flex">{renderNavigation()}</nav>
                <div className="hidden h-12 grid-cols-[78px_138px] items-center gap-3 min-[1101px]:grid" aria-busy={authLoading}>{renderAccount()}</div>
            </div>
        </header>
        {menuOpen && <Modal title="Navigation" compact onClose={() => setMenuOpen(false)}>
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">{renderNavigation(true)}</nav>
            <div className="mt-6 flex min-h-16 flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-5" aria-busy={authLoading}>{renderAccount(true)}</div>
        </Modal>}
        <div id="main-content" tabIndex={-1} className="focus:outline-none [&_main]:min-h-[60vh]">{isHome && <HomeHero />}<Outlet /></div>
        <footer className="bg-neutral-100 px-[22px] pt-[45px] pb-[25px] md:px-[max(40px,calc((100vw-1200px)/2))] md:pt-[65px] md:pb-7">
            <div className="grid grid-cols-2 gap-[30px] pb-[35px] md:grid-cols-[2fr_1fr_1fr] md:gap-[55px] md:pb-[55px]">
                <div className="col-span-2 md:col-span-1"><Link to="/" className="font-display text-5xl text-burgundy">Hapag</Link><p className="mt-3 text-[.88rem] text-neutral-600 md:mt-5">A place for good food.<br />And your next great discovery.</p></div>
                <nav aria-label="Footer discovery" className="flex flex-col items-start gap-1.5 text-[14px] [&_a]:py-[7px]"><h2 className="mt-[13px] mb-4 font-sans text-[15px] font-semibold tracking-normal">Discover</h2><Link to="/">Home</Link><Link to="/restaurants">Restaurants</Link><Link to="/favorites">Your favorites</Link>{user?.role === "admin" && <Link to="/admin">Admin dashboard</Link>}</nav>
                <nav aria-label="Footer account" className="flex flex-col items-start gap-1.5 text-[14px] [&_a]:py-[7px]"><h2 className="mt-[13px] mb-4 font-sans text-[15px] font-semibold tracking-normal">Your table</h2>{user ? <><span className="py-[7px] text-neutral-600 [overflow-wrap:anywhere]">{user.name}</span><button type="button" onClick={() => void handleLogout()} className="py-[7px]">Sign out</button></> : <><Link to="/login">Sign in</Link><Link to="/register">Create an account</Link></>}</nav>
            </div>
            <div className="flex flex-wrap justify-between gap-[18px] border-t border-neutral-300/40 pt-[25px] text-[.72rem] text-neutral-600"><span>© {new Date().getFullYear()} Hapag</span><p>Made for the love of food.</p><a href="#main-content">Back to top</a></div>
        </footer>
    </div>;
}
