import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NoImage from "../../assets/images/no-image.jpg";
import { BASE_URL } from "../../components/config";
import { AuthContext } from "../../context/AuthContext";

function ViewProduct() {
    const [qty, setQty] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [feedbackMessage, setFeedbackMessage] = useState("");

    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const stockQuantity = Number(product?.stock_quantity || 0);
    const isOutOfStock = stockQuantity <= 0;

    const formatCurrency = (amount) =>
        `PHP ${Number(amount || 0).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const fetchProduct = async (productId) => {
        setLoadingProduct(true);

        try {
            const response = await fetch(`/api/V1/products/${productId}`, {
                method: "GET",
            });
            const data = await response.json();

            if (response.ok) {
                setProduct(data.data);
                setQty(1);
                return;
            }

            setProduct(null);
        } catch (error) {
            console.error("Something went wrong:", error.message);
            setProduct(null);
        } finally {
            setLoadingProduct(false);
        }
    };

    useEffect(() => {
        fetchProduct(id);
    }, [id]);

    const increaseQty = () => {
        if (qty < stockQuantity) {
            setQty((prev) => prev + 1);
        }
    };

    const decreaseQty = () => {
        if (qty > 1) {
            setQty((prev) => prev - 1);
        }
    };

    const addToCart = async () => {
        if (!token) {
            navigate("/login");
            return false;
        }

        if (!product || isOutOfStock) {
            return false;
        }

        setLoading(true);
        setFeedbackMessage("");

        try {
            const response = await fetch("/api/V1/addtocart", {
                method: "POST",
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: qty,
                    price: product.price,
                }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    navigate("/login");
                    return false;
                }

                setFeedbackMessage(
                    data.message || "Unable to add item to cart right now.",
                );
                return false;
            }

            setFeedbackMessage("Item added to cart.");
            return true;
        } catch (error) {
            console.error("Error:", error.message);
            setFeedbackMessage("Something went wrong. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        await addToCart();
    };

    const handleBuyNow = async () => {
        const added = await addToCart();
        if (added) {
            navigate("/checkout");
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50 px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                    >
                        Back to products
                    </Link>

                    <div className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {isOutOfStock ? "Currently unavailable" : "Ready to ship"}
                    </div>
                </div>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
                        <div className="relative h-[340px] w-full bg-slate-100 sm:h-[460px]">
                            <img
                                src={
                                    product?.image
                                        ? `${BASE_URL}/storage/${product.image}`
                                        : NoImage
                                }
                                alt={product?.name || "Product image"}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white/95 p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
                        {loadingProduct && (
                            <div className="space-y-4">
                                <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
                                <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
                                <div className="h-20 animate-pulse rounded bg-slate-100" />
                            </div>
                        )}

                        {!loadingProduct && !product && (
                            <div className="space-y-4">
                                <p className="text-lg font-semibold text-slate-900">
                                    Product not found.
                                </p>
                                <p className="text-sm text-slate-600">
                                    The item may have been removed or is currently unavailable.
                                </p>
                            </div>
                        )}

                        {!loadingProduct && product && (
                            <>
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                                    Product Details
                                </p>
                                <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                    {product.name}
                                </h1>

                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <p className="text-2xl font-bold text-slate-900">
                                        {formatCurrency(product.price)}
                                    </p>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            isOutOfStock
                                                ? "bg-red-100 text-red-700"
                                                : "bg-emerald-100 text-emerald-700"
                                        }`}
                                    >
                                        {isOutOfStock
                                            ? "Out of stock"
                                            : `${stockQuantity} in stock`}
                                    </span>
                                </div>

                                <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">
                                    {product.description || "No description available."}
                                </p>

                                <div className="mt-7 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Quantity
                                    </p>
                                    <div className="mt-3 flex items-center justify-between gap-4">
                                        <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-300 bg-white">
                                            <button
                                                type="button"
                                                onClick={decreaseQty}
                                                disabled={qty <= 1 || isOutOfStock}
                                                className="px-4 py-2 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center text-base font-bold text-slate-800">
                                                {qty}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={increaseQty}
                                                disabled={qty >= stockQuantity || isOutOfStock}
                                                className="px-4 py-2 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-slate-500">Subtotal</p>
                                            <p className="text-lg font-bold text-slate-900">
                                                {formatCurrency(product.price * qty)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={handleBuyNow}
                                        disabled={loading || isOutOfStock}
                                        className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading ? "Processing..." : "Buy Now"}
                                    </button>

                                    <button
                                        type="button"
                                        disabled={loading || isOutOfStock}
                                        onClick={handleAddToCart}
                                        className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading ? "Adding..." : "Add to Cart"}
                                    </button>
                                </div>

                                {feedbackMessage && (
                                    <p className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700">
                                        {feedbackMessage}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ViewProduct;
