import React from "react";
import { Link } from "react-router-dom";
import NoImage from "../assets/images/no-image.jpg";
import { BASE_URL } from "./config";

function Card({ product }) {
    const formattedPrice = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(Number(product.price || 0));

    const isInStock = Number(product.stock_quantity) > 0;

    return (
        <Link
            to={`/products/${product.id}/${product.slug}`}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/10"
        >
            <div className="h-40 w-full overflow-hidden bg-slate-100 md:h-48">
                <img
                    src={
                        product.image
                            ? `${BASE_URL}/storage/${product.image}`
                            : NoImage
                    }
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            <div className="space-y-2 p-3 md:p-4">
                <h2 className="truncate text-sm font-semibold text-slate-900 md:text-base">
                    {product.name}
                </h2>

                <p className="text-base font-bold text-cyan-700 md:text-lg">
                    {formattedPrice}
                </p>

                <p
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isInStock
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                    }`}
                >
                    {isInStock
                        ? `${product.stock_quantity} in stock`
                        : "Out of stock"}
                </p>
            </div>
        </Link>
    );
}

export default Card;
