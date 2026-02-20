import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminNavbar() {
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const adminLinks = [
        { to: "/admin", label: "Dashboard", end: true },
        { to: "/admin/products", label: "Products" },
        { to: "/admin/products/create", label: "Add Product" },
    ];

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        closeMobileMenu();
        navigate("/login");
    };

    const navLinkClassName = ({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-medium transition ${
            isActive
                ? "bg-cyan-400/20 text-cyan-100"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`;

    return (
        <header className="sticky top-0 z-50 border-b border-slate-700/80 bg-slate-950/95 text-slate-100 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <nav className="flex h-16 items-center justify-between">
                    <Link
                        to="/admin"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2"
                    >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/90 text-xs font-black text-slate-950">
                            AP
                        </span>
                        <div>
                            <p className="text-sm font-bold sm:text-base">
                                Admin Panel
                            </p>
                            <p className="hidden text-[11px] text-slate-400 sm:block">
                                {user?.name || "E-Commerce Control"}
                            </p>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-1 md:flex">
                        {adminLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={navLinkClassName}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        <Link
                            to="/"
                            className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                        >
                            View Store
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                        >
                            Logout
                        </button>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-700 p-2 text-slate-200 transition hover:bg-slate-800 md:hidden"
                        onClick={() =>
                            setIsMobileMenuOpen((previous) => !previous)
                        }
                        aria-label="Toggle admin menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                        )}
                    </button>
                </nav>

                {isMobileMenuOpen && (
                    <div className="border-t border-slate-700 py-4 md:hidden">
                        <div className="flex flex-col gap-1">
                            {adminLinks.map((link) => (
                                <NavLink
                                    key={`mobile-${link.to}`}
                                    to={link.to}
                                    end={link.end}
                                    className={navLinkClassName}
                                    onClick={closeMobileMenu}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-col gap-2">
                            <Link
                                to="/"
                                onClick={closeMobileMenu}
                                className="rounded-lg border border-slate-700 px-3 py-2 text-center text-sm font-medium text-slate-200"
                            >
                                View Store
                            </Link>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default AdminNavbar;
