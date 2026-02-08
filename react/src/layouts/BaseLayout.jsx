import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Contact from "../components/Contact";

function BaseLayout() {
    return (
        <>
            <Navbar />

            <main className="bg-gray-100">
                <Outlet />
            </main>

            <Contact />
        </>
    );
}

export default BaseLayout;
