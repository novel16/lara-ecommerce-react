import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const { logout, user } = useContext(AuthContext);

    return (
        <header className="bg-gray-800 text-white">
            <nav className="py-4 px-16 flex justify-between items-center">
                <h1 className="text-xl font-bold">E-Commerce App</h1>

                <div>
                    <Link to="/" className="mr-4 hover:underline">
                        Home
                    </Link>
                    <Link to="/products" className="mr-4 hover:underline">
                        Products
                    </Link>
                    <Link to="/categories" className="mr-4 hover:underline">
                        Categories
                    </Link>
                    <Link to="/contact" className="mr-4 hover:underline">
                        Contact Us
                    </Link>
                    {user && (
                        <Link to="/myorders" className="mr-4 hover:underline">
                            My Orders
                        </Link>
                    )}
                </div>

                <div>
                    {user ? (
                        <div className="flex items-center">
                            <Link
                                to="/cart"
                                className="mr-4 hover:text-blue-400"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 3h1.5l.744 3.72m0 0L5.25 12h13.5l1.257-6.28m-15.513.28L2.25 3m2.244 3.72h15.256M9 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z"
                                    />
                                </svg>
                            </Link>
                            <button
                                onClick={() => logout()}
                                className="bg-red-600 px-4 py-2 cursor-pointer rounded hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="">
                            <Link to="/login" className="mr-4 hover:underline">
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
