import React from "react";
import { Link } from "react-router-dom";

function Contact() {
    return (
        <div className="bg-gray-800 text-white p-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* SECTION 1 - Contact Info */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Contact Info</h2>

                    {/* EMAIL */}
                    <div className="flex items-center gap-2 mb-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.906a2.25 2.25 0 01-1.07-1.916V6.75"
                            />
                        </svg>
                        <span>lapaychavez1996@gmail.com</span>
                    </div>

                    {/* PHONE */}
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102A1.125 1.125 0 006.027 2.25H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                            />
                        </svg>
                        <span>09924028116</span>
                    </div>
                </div>

                {/* SECTION 2 - Nav Links */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Navigation</h2>
                    <div className="flex flex-col space-y-2">
                        <Link to="/" className="hover:underline">
                            Home
                        </Link>
                        <Link to="/products" className="hover:underline">
                            Products
                        </Link>
                        <Link to="/categories" className="hover:underline">
                            Categories
                        </Link>
                        <Link to="/contact" className="hover:underline">
                            Contact Us
                        </Link>
                    </div>
                </div>

                {/* SECTION 3 - Message Form (WHITE CARD) */}
                <div className="bg-white text-black p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        Send a Message
                    </h2>

                    <form className="flex flex-col space-y-3">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="p-2 border border-gray-300 rounded"
                        />

                        <input
                            type="text"
                            placeholder="Subject"
                            className="p-2 border border-gray-300 rounded"
                        />

                        <textarea
                            placeholder="Your message"
                            rows="4"
                            className="p-2 border border-gray-300 rounded"
                        ></textarea>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white hover:bg-blue-700 p-2 rounded mt-2"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;
