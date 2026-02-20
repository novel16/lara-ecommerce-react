import React from "react";
import { Link } from "react-router-dom";

function Contact() {
    const quickLinks = [
        { to: "/", label: "Home" },
        { to: "/products", label: "Products" },
        { to: "/categories", label: "Categories" },
        { to: "/contact", label: "Contact" },
    ];

    return (
        <section className="border-t border-slate-200 bg-[radial-gradient(circle_at_top_left,_#0f172a,_#082f49_45%,_#020617)] px-4 py-10 text-slate-100 md:px-8 md:py-14">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                    Need help with your order? Reach us anytime and we will get
                    back to you within 24 hours.
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.8fr_1.2fr]">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                            Contact Hub
                        </div>
                        <h2 className="text-2xl font-bold md:text-3xl">
                            Let's stay connected
                        </h2>
                        <p className="max-w-md text-sm leading-relaxed text-slate-300">
                            For product questions, delivery concerns, or order
                            updates, our support team is ready to assist you.
                        </p>

                        <div className="space-y-2 text-sm">
                            <p className="rounded-xl border border-slate-700/70 bg-slate-900/40 px-3 py-2">
                                Email: <span className="font-semibold">lapaychavez1996@gmail.com</span>
                            </p>
                            <p className="rounded-xl border border-slate-700/70 bg-slate-900/40 px-3 py-2">
                                Phone: <span className="font-semibold">09924028116</span>
                            </p>
                            <p className="rounded-xl border border-slate-700/70 bg-slate-900/40 px-3 py-2">
                                Hours: <span className="font-semibold">Mon-Sat, 8:00 AM - 7:00 PM</span>
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/40 p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-cyan-200">
                            Quick Navigation
                        </h3>
                        <div className="mt-3 flex flex-col gap-1">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-cyan-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-xl shadow-black/20 md:p-6">
                        <h3 className="text-lg font-bold text-slate-900">
                            Send us a message
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            We value your feedback. Fill this form and we will
                            contact you shortly.
                        </p>

                        <form className="mt-4 space-y-3">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                            />
                            <input
                                type="text"
                                placeholder="Subject"
                                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                            />
                            <textarea
                                placeholder="Write your message..."
                                rows="4"
                                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                            />

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Submit Message
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-700/80 pt-4 text-xs text-slate-400">
                    © {new Date().getFullYear()} E-Commerce App. All rights
                    reserved.
                </div>
            </div>
        </section>
    );
}

export default Contact;
