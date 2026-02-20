import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
    const { user, token, authLoading } = useContext(AuthContext);

    if (authLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
                Loading...
            </div>
        );
    }

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;
