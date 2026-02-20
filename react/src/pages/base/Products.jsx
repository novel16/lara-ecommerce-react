import React, { useCallback, useEffect, useMemo, useState } from "react";
import Card from "../../components/Card";
import Pagination from "../../components/Pagination";

function Products() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(false);
    const [requestError, setRequestError] = useState("");

    const fetchProducts = useCallback(async (page = 1) => {
        setLoading(true);
        setRequestError("");

        try {
            const response = await fetch(`/api/V1/products?page=${page}`, {
                method: "GET",
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load products.");
            }

            setProducts(Array.isArray(data.data) ? data.data : []);
            setCurrentPage(Number(data?.meta?.current_page) || 1);
            setLastPage(Number(data?.meta?.last_page) || 1);
            setTotalProducts(Number(data?.meta?.total) || 0);
        } catch (error) {
            setRequestError(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(1);
    }, [fetchProducts]);

    const stockSummary = useMemo(() => {
        const inStock = products.filter(
            (product) => Number(product.stock_quantity) > 0,
        ).length;

        return {
            inStock,
            outOfStock: products.length - inStock,
        };
    }, [products]);

    const handlePageChange = useCallback(
        (page) => {
            fetchProducts(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        [fetchProducts],
    );

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe,_#f8fafc_40%,_#e2e8f0)] px-4 py-8 md:px-8 md:py-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 p-6 text-white shadow-xl shadow-cyan-950/20 md:p-8">
                    <div className="absolute -left-10 top-0 h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
                    <div className="absolute -right-12 bottom-0 h-40 w-40 rounded-full bg-emerald-300/20 blur-2xl" />
                    <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
                                Product Catalog
                            </p>
                            <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                                Explore Our Products
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-200">
                                Find quality products curated for everyday essentials and best value.
                            </p>
                        </div>
                        <div className="rounded-xl bg-white/10 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/20">
                            Page {currentPage} of {lastPage}
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-cyan-100 bg-white/95 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Total Products
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {totalProducts}
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

                <section className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-900/5 md:p-6">
                    {requestError && (
                        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {requestError}
                        </div>
                    )}

                    {loading && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                <div
                                    key={item}
                                    className="h-64 animate-pulse rounded-2xl bg-slate-100"
                                />
                            ))}
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="py-14 text-center">
                            <p className="text-lg font-semibold text-slate-800">
                                No products available
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Please check back later for new items.
                            </p>
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
                                {products.map((product) => (
                                    <Card product={product} key={product.id} />
                                ))}
                            </div>
                            <div className="mt-6 border-t border-slate-200 pt-4">
                                <Pagination
                                    currentPage={currentPage}
                                    lastPage={lastPage}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Products;
