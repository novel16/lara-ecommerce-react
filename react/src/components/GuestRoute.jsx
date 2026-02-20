import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function GuestRoute() {
    const { user, authLoading } = useContext(AuthContext);

    if (authLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
                Loading...
            </div>
        );
    }

    return user ? <Navigate to="/" replace /> : <Outlet />;
}

export default GuestRoute;
