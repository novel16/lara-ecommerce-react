import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const { logout, user } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigationLinks = [
        { to: "/", label: "Home", end: true },
        { to: "/products", label: "Products" },
        { to: "/categories", label: "Categories" },
        { to: "/contact", label: "Contact" },
        ...(user ? [{ to: "/myorders", label: "My Orders" }] : []),
    ];

    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const navLinkClassName = ({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-medium transition ${
            isActive
                ? "bg-cyan-100 text-cyan-900"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
        }`;

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <nav className="flex h-16 items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-slate-900"
                        onClick={closeMobileMenu}
                    >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                            EC
                        </span>
                        <span className="text-sm font-bold tracking-wide sm:text-base">
                            E-Commerce App
                        </span>
                    </Link>

                    <div className="hidden items-center gap-1 md:flex">
                        {navigationLinks.map((link) => (
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
                        {user ? (
                            <>
                                <Link
                                    to="/cart"
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 3h1.5l.744 3.72m0 0L5.25 12h13.5l1.257-6.28m-15.513.28L2.25 3m2.244 3.72h15.256M9 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z"
                                        />
                                    </svg>
                                    Cart
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
                        onClick={() =>
                            setIsMobileMenuOpen((previous) => !previous)
                        }
                        aria-label="Toggle menu"
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
                    <div className="border-t border-slate-200 py-4 md:hidden">
                        <div className="flex flex-col gap-1">
                            {navigationLinks.map((link) => (
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
                            {user ? (
                                <>
                                    <Link
                                        to="/cart"
                                        onClick={closeMobileMenu}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-700"
                                    >
                                        Go to Cart
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={closeMobileMenu}
                                    className="rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;
