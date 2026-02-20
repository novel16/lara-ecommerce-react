import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NoImage from "../../assets/images/no-image.jpg";
import { BASE_URL } from "../../components/config";
import { AuthContext } from "../../context/AuthContext";

function Cart() {
    const { token } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [requestError, setRequestError] = useState("");
    const [updatingItemIds, setUpdatingItemIds] = useState([]);

    const formatPHP = (value) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(Number(value || 0));

    const setItemUpdating = (itemId, isUpdating) => {
        setUpdatingItemIds((previous) => {
            if (isUpdating) {
                if (previous.includes(itemId)) {
                    return previous;
                }

                return [...previous, itemId];
            }

            return previous.filter((id) => id !== itemId);
        });
    };

    const isItemUpdating = (itemId) => updatingItemIds.includes(itemId);

    const fetchCart = useCallback(async () => {
        if (!token) {
            return;
        }

        setLoading(true);
        setRequestError("");

        try {
            const response = await fetch("/api/V1/viewcart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load cart.");
            }

            setCartItems(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            setRequestError(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const requestQuantityChange = async (itemId, endpoint) => {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to update quantity.");
        }

        return data;
    };

    const increaseCartQty = async (itemId) => {
        if (!token || isItemUpdating(itemId)) {
            return;
        }

        setRequestError("");
        setItemUpdating(itemId, true);

        try {
            const data = await requestQuantityChange(
                itemId,
                `/api/V1/addqty/${itemId}`,
            );

            setCartItems((previous) =>
                previous.map((item) =>
                    item.id === itemId
                        ? { ...item, quantity: Number(data.quantity) || item.quantity }
                        : item,
                ),
            );
        } catch (error) {
            setRequestError(error.message || "Something went wrong.");
        } finally {
            setItemUpdating(itemId, false);
        }
    };

    const decreaseCartQty = async (itemId) => {
        if (!token || isItemUpdating(itemId)) {
            return;
        }

        setRequestError("");
        setItemUpdating(itemId, true);

        try {
            const data = await requestQuantityChange(
                itemId,
                `/api/V1/minusqty/${itemId}`,
            );

            const nextQuantity = Number(data.quantity) || 0;

            setCartItems((previous) =>
                previous
                    .map((item) =>
                        item.id === itemId
                            ? { ...item, quantity: nextQuantity }
                            : item,
                    )
                    .filter((item) => item.quantity > 0),
            );
        } catch (error) {
            setRequestError(error.message || "Something went wrong.");
        } finally {
            setItemUpdating(itemId, false);
        }
    };

    const removeItem = async (itemId) => {
        if (!token || isItemUpdating(itemId)) {
            return;
        }

        const itemToRemove = cartItems.find((item) => item.id === itemId);

        if (!itemToRemove) {
            return;
        }

        if (!window.confirm("Remove this item from your cart?")) {
            return;
        }

        setRequestError("");
        setItemUpdating(itemId, true);

        try {
            let remainingQuantity = Number(itemToRemove.quantity) || 0;

            while (remainingQuantity > 0) {
                const data = await requestQuantityChange(
                    itemId,
                    `/api/V1/minusqty/${itemId}`,
                );

                remainingQuantity = Number(data.quantity) || 0;

                if (remainingQuantity <= 0) {
                    break;
                }
            }

            setCartItems((previous) =>
                previous.filter((item) => item.id !== itemId),
            );
        } catch (error) {
            setRequestError(error.message || "Something went wrong.");
        } finally {
            setItemUpdating(itemId, false);
        }
    };

    const cartSummary = useMemo(() => {
        const itemCount = cartItems.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0,
        );

        const subtotal = cartItems.reduce(
            (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
            0,
        );

        return {
            itemCount,
            subtotal,
        };
    }, [cartItems]);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe,_#f8fafc_45%,_#e2e8f0)] px-4 py-8 md:px-8 md:py-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 p-6 text-white shadow-xl shadow-cyan-950/20 md:p-8">
                    <div className="absolute -left-10 top-0 h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
                    <div className="absolute -right-12 bottom-0 h-40 w-40 rounded-full bg-emerald-300/20 blur-2xl" />

                    <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
                                Shopping Cart
                            </p>
                            <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                                My Cart
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-200">
                                Review items, update quantities, and continue to secure checkout.
                            </p>
                        </div>
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-50"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-cyan-100 bg-white/95 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Total Items
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {cartSummary.itemCount}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-100 bg-white/95 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Subtotal
                        </p>
                        <p className="mt-2 text-2xl font-bold text-emerald-700">
                            {formatPHP(cartSummary.subtotal)}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Checkout Status
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {cartItems.length > 0 ? "Ready" : "Empty"}
                        </p>
                    </div>
                </section>

                {requestError && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {requestError}
                    </div>
                )}

                {loading && (
                    <section className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-36 animate-pulse rounded-2xl bg-slate-100"
                            />
                        ))}
                    </section>
                )}

                {!loading && cartItems.length === 0 && (
                    <section className="rounded-3xl border border-slate-200 bg-white/95 px-6 py-14 text-center shadow-xl shadow-slate-900/5">
                        <h2 className="text-xl font-bold text-slate-900">
                            Your cart is empty
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Add products to your cart to continue checkout.
                        </p>
                        <Link
                            to="/products"
                            className="mt-4 inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Browse Products
                        </Link>
                    </section>
                )}

                {!loading && cartItems.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                        <section className="space-y-4">
                            {cartItems.map((item) => {
                                const lineSubtotal =
                                    Number(item.quantity || 0) * Number(item.price || 0);
                                const disabled = isItemUpdating(item.id);

                                return (
                                    <article
                                        key={item.id}
                                        className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-900/5 md:p-5"
                                    >
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[120px_1fr]">
                                            <div className="h-28 overflow-hidden rounded-2xl bg-slate-100 sm:h-32">
                                                <img
                                                    src={
                                                        item.product.image
                                                            ? `${BASE_URL}/storage/${item.product.image}`
                                                            : NoImage
                                                    }
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <h2 className="text-lg font-bold text-slate-900">
                                                            {item.product.name}
                                                        </h2>
                                                        <p className="text-sm text-slate-500">
                                                            SKU: {item.product.sku}
                                                        </p>
                                                    </div>
                                                    <p className="text-lg font-bold text-cyan-700">
                                                        {formatPHP(item.price)}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                                                        <button
                                                            type="button"
                                                            disabled={disabled}
                                                            className="h-9 w-9 rounded-lg text-lg font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                                                            onClick={() => decreaseCartQty(item.id)}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-10 text-center text-sm font-semibold text-slate-900">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            disabled={disabled}
                                                            className="h-9 w-9 rounded-lg text-lg font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                                                            onClick={() => increaseCartQty(item.id)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <p className="text-sm font-semibold text-slate-700">
                                                        Subtotal: {formatPHP(lineSubtotal)}
                                                    </p>
                                                </div>

                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        disabled={disabled}
                                                        onClick={() => removeItem(item.id)}
                                                        className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {disabled ? "Updating..." : "Remove"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>

                        <aside className="h-fit rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-900/5 lg:sticky lg:top-24 md:p-6">
                            <h3 className="text-lg font-bold text-slate-900">
                                Order Summary
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Review before checkout.
                            </p>

                            <div className="mt-5 space-y-3 text-sm">
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Items</span>
                                    <span>{cartSummary.itemCount}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>{formatPHP(cartSummary.subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="h-px bg-slate-200" />
                                <div className="flex items-center justify-between text-base font-bold text-slate-900">
                                    <span>Total</span>
                                    <span>{formatPHP(cartSummary.subtotal)}</span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Proceed to Checkout
                            </Link>
                            <Link
                                to="/products"
                                className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Add More Items
                            </Link>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
