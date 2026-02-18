import React from "react";
import { Link } from "react-router-dom";

function ThankYou() {

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-4 py-14 sm:px-6">
            <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-8 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

            <div className="relative mx-auto max-w-4xl">
                <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-10">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-10 w-10 text-emerald-600"
                            stroke="currentColor"
                            strokeWidth="2.4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                        Order Confirmed
                    </p>
                    <h1 className="mt-2 text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">
                        Thank you for your purchase
                    </h1>
                    <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600 sm:text-base">
                        Nareceive na namin ang order mo at pinoproseso na ito ngayon.
                        Magpapadala kami ng updates sa email mo habang
                        pinaprepare ang shipment.
                    </p>


                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                Status
                            </p>
                            <p className="mt-1 font-semibold text-slate-900">
                                Preparing Order
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                Estimated Delivery
                            </p>
                            <p className="mt-1 font-semibold text-slate-900">
                                1-5 Business Days
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                Support
                            </p>
                            <p className="mt-1 font-semibold text-slate-900">
                                Available 24/7
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            to="/myorders"
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                        >
                            View My Orders
                        </Link>
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ThankYou;
