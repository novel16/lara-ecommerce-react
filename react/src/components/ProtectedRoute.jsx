import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute() {
    const { user, token, authLoading } = useContext(AuthContext);

    if (authLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
                Loading...
            </div>
        );
    }

    return user && token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
