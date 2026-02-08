import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NoImage from "../../assets/images/no-image.jpg"
import { BASE_URL } from "../../components/config";

function ViewProduct() {
    const [qty, setQty] = useState(1);
    const [product, setProduct] = useState({});
    const { id } = useParams();

    const fetchProduct = async (id) => {
        try {
            const response = await fetch(`/api/V1/products/${id}`, {
                method: "GET",
            });
            const data = await response.json();
            if (response.ok) {
                setProduct(data.data);
            }
        } catch (error) {
            console.error("Somethong went wrong:", error.message);
        }
    };

    useEffect(() => {
        fetchProduct(id);
    }, [id]);

    const increaseQty = () => {
        if (qty < product.stock_quantity) setQty(qty + 1);
    };

    const decreaseQty = () => {
        if (qty > 1) setQty(qty - 1);
    };

    return (
        <div className="bg-gray-50 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                {/* LEFT - IMAGE */}
                <div className="w-full h-[420px] bg-gray-100 rounded-xl overflow-hidden">
                    <img
                        src={product.image ? `${BASE_URL}/storage/${product.image}`: NoImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* RIGHT - DETAILS (NO BOX, NO SHADOW) */}
                <div className="space-y-5">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        {product.name}
                    </h1>

                    <p className="text-2xl font-bold text-gray-700">
                        ₱{product.price}
                    </p>

                    <p className="text-sm text-gray-600">
                        {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                        {product.description}
                    </p>

                    {/* QUANTITY SELECTOR */}
                    <div>
                        <p className="font-semibold mb-2">Quantity</p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={decreaseQty}
                                className="px-3 py-2 bg-gray-200 rounded cursor-pointer"
                            >
                                −
                            </button>

                            <span className="text-lg border border-gray-400 rounded p-1 font-semibold w-8 text-center">
                                {qty}
                            </span>

                            <button
                                onClick={increaseQty}
                                className="px-3 py-2 bg-gray-200 rounded cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-4 pt-4">
                        <button className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 py-3 rounded-lg w-full">
                            Buy Now
                        </button>

                        <button className="bg-gray-700 hover:bg-gray-800 cursor-pointer text-white px-6 py-3 rounded-lg w-full">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;
