import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
    return (
        <>
            <AdminNavbar />

            <main>
                <Outlet />
            </main>
        </>
    );
}

export default AdminLayout;
