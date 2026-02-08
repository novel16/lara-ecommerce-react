import React from "react";
import HomeBanner from "../../assets/images/home.png";
import Products from "./Products";

function Home() {
    return (
        <>
            <div className="relative w-full h-screen">
                {/* ACTUAL IMAGE */}
                <img
                    src={HomeBanner}
                    alt="Home Banner"
                    className="w-full h-full object-cover absolute top-0 left-0"
                />

                {/* DARK OVERLAY (para readable ang text) */}
                {/* <div className="absolute inset-0 bg-black bg-opacity-10"></div> */}

                {/* TEXT ON TOP */}
                <div className="relative z-10 flex flex-col items-start justify-center h-full text-left px-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-gray-700 drop-shadow-lg">
                        Welcome to Our Store
                    </h1>

                    <p className="max-w-xl text-lg md:text-xl text-gray-700 drop-shadow-md mb-6">
                        Discover amazing products, exclusive deals, and
                        top-quality service all in one place. Shop with
                        confidence and style.
                    </p>

                    <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg shadow-lg">
                        Explore Products
                    </button>
                </div>
            </div>
            <Products />
        </>
    );
}

export default Home;
