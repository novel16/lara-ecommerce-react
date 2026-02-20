import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { BASE_URL } from "../../components/config";
import { AuthContext } from "../../context/AuthContext";

function AdminProducts() {
    const { token } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [requestError, setRequestError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const formatCurrency = (value) => {
        const amount = Number(value || 0);

        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const parsedDate = new Date(dateString);

        if (Number.isNaN(parsedDate.getTime())) {
            return dateString || "N/A";
        }

        return parsedDate.toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const fetchProducts = useCallback(
        async (page = 1) => {
            if (!token) {
                return;
            }

            setLoading(true);
            setRequestError("");

            try {
                const response = await fetch(`/api/V1/admin/products?page=${page}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to fetch products.");
                }

                setProducts(Array.isArray(data.data) ? data.data : []);
                setCurrentPage(Number(data?.meta?.current_page) || 1);
                setLastPage(Number(data?.meta?.last_page) || 1);
            } catch (error) {
                setRequestError(error.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        },
        [token],
    );

    useEffect(() => {
        fetchProducts(1);
    }, [fetchProducts]);

    const deleteProduct = async (productID) => {
        if (!token) {
            return;
        }

        if (!window.confirm("Delete this product? This action cannot be undone.")) {
            return;
        }

        setDeletingId(productID);

        try {
            const response = await fetch(`/api/V1/admin/products/${productID}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Unable to delete product.");
            }

            fetchProducts(currentPage);
        } catch (error) {
            setRequestError(error.message || "Something went wrong.");
        } finally {
            setDeletingId(null);
        }
    };

    const stockSummary = useMemo(() => {
        const inStockCount = products.filter(
            (product) => Number(product.stock_quantity) > 0,
        ).length;

        return {
            total: products.length,
            inStock: inStockCount,
            outOfStock: products.length - inStockCount,
        };
    }, [products]);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#cffafe,_#f8fafc_40%,_#e2e8f0)] p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 p-6 text-white shadow-xl shadow-cyan-950/20 md:p-8">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />
                    <div className="absolute -bottom-14 left-1/3 h-36 w-36 rounded-full bg-emerald-300/20 blur-2xl" />
                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">
                                Inventory Control
                            </p>
                            <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                                Admin Products
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-200">
                                Manage your catalog, monitor stock levels, and keep product details up to date.
                            </p>
                        </div>
                        <Link
                            to="/admin/products/create"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-50"
                        >
                            Add New Product
                        </Link>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-cyan-100 bg-white/95 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Total On Page
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {stockSummary.total}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-100 bg-white/95 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            In Stock
                        </p>
                        <p className="mt-2 text-2xl font-bold text-emerald-700">
                            {stockSummary.inStock}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-rose-100 bg-white/95 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Out Of Stock
                        </p>
                        <p className="mt-2 text-2xl font-bold text-rose-600">
                            {stockSummary.outOfStock}
                        </p>
                    </div>
                </section>

                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-900/5">
                    <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50/70 px-5 py-4 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-lg font-bold text-slate-900">
                            Product Listing
                        </h2>
                        <p className="text-sm text-slate-500">
                            Page {currentPage} of {lastPage}
                        </p>
                    </div>

                    {requestError && (
                        <div className="mx-5 mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {requestError}
                        </div>
                    )}

                    {loading && (
                        <div className="space-y-3 px-5 py-5">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="h-14 animate-pulse rounded-xl bg-slate-100"
                                />
                            ))}
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="px-5 py-12 text-center">
                            <p className="text-lg font-semibold text-slate-800">
                                No products found
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Add your first product to start building your catalog.
                            </p>
                            <Link
                                to="/admin/products/create"
                                className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Create Product
                            </Link>
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-full text-left text-sm text-slate-700">
                                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-5 py-3 font-semibold">
                                                Product
                                            </th>
                                            <th className="px-5 py-3 font-semibold">
                                                SKU
                                            </th>
                                            <th className="px-5 py-3 font-semibold">
                                                Price
                                            </th>
                                            <th className="px-5 py-3 font-semibold">
                                                Stock
                                            </th>
                                            <th className="px-5 py-3 font-semibold">
                                                Created
                                            </th>
                                            <th className="px-5 py-3 font-semibold text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {products.map((product) => (
                                            <tr
                                                key={product.id}
                                                className="transition hover:bg-cyan-50/40"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                                                            {product.image ? (
                                                                <img
                                                                    src={`${BASE_URL}/storage/${product.image}`}
                                                                    alt={product.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500">
                                                                    No Image
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-slate-900">
                                                                {product.name}
                                                            </p>
                                                            <p className="mt-0.5 truncate text-xs text-slate-500">
                                                                {product.description || "No description provided."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 font-medium text-slate-700">
                                                    {product.sku || "N/A"}
                                                </td>
                                                <td className="px-5 py-4 font-semibold text-slate-900">
                                                    {formatCurrency(product.price)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                            Number(product.stock_quantity) > 0
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-rose-100 text-rose-700"
                                                        }`}
                                                    >
                                                        {Number(product.stock_quantity) > 0
                                                            ? `${product.stock_quantity} available`
                                                            : "Out of stock"}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-slate-600">
                                                    {formatDate(product.created_at)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            to={`/admin/products/edit/${product.id}`}
                                                            className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteProduct(product.id)}
                                                            disabled={deletingId === product.id}
                                                            className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {deletingId === product.id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-3 p-4 md:hidden">
                                {products.map((product) => (
                                    <article
                                        key={product.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                                                {product.image ? (
                                                    <img
                                                        src={`${BASE_URL}/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-slate-500">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate font-semibold text-slate-900">
                                                    {product.name}
                                                </h3>
                                                <p className="mt-1 truncate text-xs text-slate-500">
                                                    {product.description || "No description provided."}
                                                </p>
                                                <span
                                                    className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${
                                                        Number(product.stock_quantity) > 0
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-rose-100 text-rose-700"
                                                    }`}
                                                >
                                                    Stock: {product.stock_quantity}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                            <p className="text-slate-600">
                                                <span className="font-semibold text-slate-900">
                                                    SKU:
                                                </span>{" "}
                                                {product.sku || "N/A"}
                                            </p>
                                            <p className="text-slate-600">
                                                <span className="font-semibold text-slate-900">
                                                    Price:
                                                </span>{" "}
                                                {formatCurrency(product.price)}
                                            </p>
                                            <p className="col-span-2 text-slate-600">
                                                <span className="font-semibold text-slate-900">
                                                    Created:
                                                </span>{" "}
                                                {formatDate(product.created_at)}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <Link
                                                to={`/admin/products/edit/${product.id}`}
                                                className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-emerald-600"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => deleteProduct(product.id)}
                                                disabled={deletingId === product.id}
                                                className="flex-1 rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {deletingId === product.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="border-t border-slate-200 bg-slate-50/60 px-4 py-4">
                        <Pagination
                            currentPage={currentPage}
                            lastPage={lastPage}
                            onPageChange={fetchProducts}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AdminProducts;
