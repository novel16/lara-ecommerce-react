import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
    const { user } = useContext(AuthContext);

    if (!user && user) {
        return <Navigate to="/login" replace />;
    }

    if (user && user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}

export default AdminRoute;
