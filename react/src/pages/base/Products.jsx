import React, { useEffect, useState } from "react";
import Card from "../../components/Card";

function Products() {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/V1/products", {
                method: "GET",
            });

            const data = await response.json();
            if (response.ok) {
                setProducts(data.data);
                console.log(data);
            }
        } catch (error) {
            console.error("Something went wrong:", error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6 text-center">
                Our Products
            </h1>

            {/* PRODUCT GRID */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                    <Card product={product} key={product.id} />
                ))}
            </div>
        </div>
    );
}

export default Products;
