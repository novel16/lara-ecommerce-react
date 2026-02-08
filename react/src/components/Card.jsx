import React from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "./config";
import NoImage from "../assets/images/no-image.jpg"


function Card({ product }) {
    return (
        <Link
            to={`/products/${product.id}/${product.slug}`}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group"
        >
            {/* IMAGE */}
            <div className="w-full h-40 md:h-48 bg-gray-100 overflow-hidden">
                <img
                    src={product.image ? `${BASE_URL}/storage/${product.image}`: NoImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* CONTENT */}
            <div className="p-3 md:p-4">
                <h2 className="text-sm md:text-base font-semibold text-gray-800 truncate">
                    {product.name}
                </h2>

                <p className="text-gray-700 font-bold mt-1">₱{product.price}</p>

                <p className="text-xs text-gray-500 mt-1">
                    {product.stock_quantity > 0
                        ? `${product.stock_quantity} in stock`
                        : "Out of stock"}
                </p>
            </div>
        </Link>
    );
}

export default Card;
