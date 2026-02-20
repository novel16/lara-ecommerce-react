import {
    CardCvcElement,
    CardExpiryElement,
    CardNumberElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SHIPPING_FEE = 15;

function Checkout() {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("order");
    const [payment, setPayment] = useState("");
    const [carts, setCarts] = useState([]);
    const { token } = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [cardZipCode, setCardZipCode] = useState("");
    const [orderDetails, setOrderDetails] = useState({
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        shipping_address: "",
    });

    const formatPHP = (value) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(value);

    const stripeElementOptions = {
        style: {
            base: {
                color: "#0f172a",
                fontSize: "14px",
                "::placeholder": {
                    color: "#94a3b8",
                },
            },
            invalid: {
                color: "#ef4444",
            },
        },
    };

    const handleOrderFieldChange = (field) => (event) => {
        const value = event.target.value;
        setOrderDetails((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: undefined,
        }));
    };

    const handlePaymentChange = (event) => {
        const selectedPaymentMethod = event.target.value;
        setPayment(selectedPaymentMethod);

        if (selectedPaymentMethod !== "card") {
            setCardZipCode("");
        }

        setErrors((prev) => ({
            ...prev,
            payment_method: undefined,
            card: undefined,
            card_zip: undefined,
        }));
    };

    const handleCardZipCodeChange = (event) => {
        setCardZipCode(event.target.value);
        setErrors((prev) => ({
            ...prev,
            card: undefined,
            card_zip: undefined,
        }));
    };

    const fetchCart = async () => {
        if (!token) {
            return;
        }

        try {
            const response = await fetch("/api/V1/viewcart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setCarts(data.data);
            }
        } catch (error) {
            console.error("Error fetching cart:", error.message);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    const handlePlaceOrder = async () => {
        if (loading || carts.length === 0) {
            return;
        }

        setErrors({});

        if (!payment) {
            setErrors({
                payment_method: ["Please select a payment method."],
            });
            setActiveTab("payment");
            return;
        }

        if (payment === "card" && (!stripe || !elements)) {
            setErrors({
                payment_method: [
                    "Card payment is still loading. Please try again in a moment.",
                ],
            });
            setActiveTab("payment");
            return;
        }

        if (payment === "card" && !cardZipCode.trim()) {
            setErrors({
                card_zip: ["Please enter your ZIP or postal code."],
            });
            setActiveTab("payment");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/V1/order", {
                method: "POST",
                body: JSON.stringify({
                    ...orderDetails,
                    payment_method: payment,
                }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (data.errors) {
                setErrors(data.errors);

                if (
                    data.errors.payment_method ||
                    data.errors.card ||
                    data.errors.clientSecret
                ) {
                    setActiveTab("payment");
                } else {
                    setActiveTab("order");
                }

                return;
            }

            if (!response.ok) {
                alert(data.message || "Unable to place order. Please try again.");
                return;
            }

            if (payment === "card") {
                if (!data.clientSecret) {
                    alert("Missing payment details. Please try again.");
                    return;
                }

                const cardNumberElement = elements.getElement(CardNumberElement);

                if (!cardNumberElement) {
                    setErrors({
                        card: [
                            "Card details are not ready yet. Please refresh and try again.",
                        ],
                    });
                    setActiveTab("payment");
                    return;
                }

                const { error, paymentIntent } =
                    await stripe.confirmCardPayment(data.clientSecret, {
                        payment_method: {
                            card: cardNumberElement,
                            billing_details: {
                                name: orderDetails.guest_name || undefined,
                                email: orderDetails.guest_email || undefined,
                                phone: orderDetails.guest_phone || undefined,
                                address: {
                                    postal_code: cardZipCode.trim(),
                                },
                            },
                        },
                    });

                if (error) {
                    setErrors({
                        card: [error.message || "Card payment failed."],
                    });
                    setActiveTab("payment");
                    return;
                }

                if (paymentIntent?.status !== "succeeded") {
                    alert("Card payment did not complete. Please try again.");
                    return;
                }

                await fetch(`/api/V1/payment-confirm/${data.order_id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            }

            navigate("/thank-you");
        } catch (error) {
            console.error("Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const subtotal = carts.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0,
    );
    const total = subtotal + (carts.length > 0 ? SHIPPING_FEE : 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-amber-700">
                            Secure Checkout
                        </p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Finish your order
                        </h1>
                        <p className="text-sm text-slate-600">
                            Fast delivery, easy returns, and real-time
                            confirmation.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs text-slate-600 shadow-sm ring-1 ring-slate-200">
                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        Encrypted payments and verified sellers
                    </div>
                </div>

                {/* TABS HEADER */}
                <div className="mb-8 flex w-full max-w-md rounded-full bg-white/70 p-1 ring-1 ring-slate-200 shadow-sm">
                    <button
                        onClick={() => setActiveTab("order")}
                        className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                            activeTab === "order"
                                ? "bg-slate-900 text-white shadow"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Order Details
                    </button>

                    <button
                        onClick={() => setActiveTab("payment")}
                        className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                            activeTab === "payment"
                                ? "bg-slate-900 text-white shadow"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Payment
                    </button>
                </div>

                {/* TAB CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8">
                    {/* LEFT COLUMN (MAIN CONTENT) */}
                    <div className="rounded-2xl bg-white/90 p-6 sm:p-8 shadow-xl ring-1 ring-slate-200">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">
                                {activeTab === "order"
                                    ? "Shipping and Contact"
                                    : "Payment Details"}
                            </h2>
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                                {activeTab === "order"
                                    ? "Step 1 of 2"
                                    : "Step 2 of 2"}
                            </span>
                        </div>

                        {activeTab === "order" && (
                            <div className="space-y-5 text-slate-700">
                                <div>
                                    <p className="text-sm font-semibold">
                                        Shipping Address
                                    </p>
                                    <textarea
                                        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                                        rows="3"
                                        value={orderDetails.shipping_address}
                                        onChange={handleOrderFieldChange(
                                            "shipping_address",
                                        )}
                                        placeholder="Enter your shipping address"
                                    />
                                    {errors?.shipping_address && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.shipping_address?.[0]}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-semibold">
                                            Full Name
                                        </p>
                                        <input
                                            type="text"
                                            value={orderDetails.guest_name}
                                            onChange={handleOrderFieldChange(
                                                "guest_name",
                                            )}
                                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                                            placeholder="Juan Dela Cruz"
                                        />
                                        {errors?.guest_name && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.guest_name?.[0]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">
                                            Phone
                                        </p>
                                        <input
                                            type="text"
                                            value={orderDetails.guest_phone}
                                            onChange={handleOrderFieldChange(
                                                "guest_phone",
                                            )}
                                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                                            placeholder="0917-123-4567"
                                        />
                                        {errors?.guest_phone && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.guest_phone?.[0]}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">
                                        Email
                                    </p>
                                    <input
                                        type="email"
                                        value={orderDetails.guest_email}
                                        onChange={handleOrderFieldChange(
                                            "guest_email",
                                        )}
                                        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                                        placeholder="juan@example.com"
                                    />
                                    {errors?.guest_email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.guest_email?.[0]}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/70 p-4 text-sm text-amber-900">
                                    <p className="font-semibold">
                                        Delivery estimate
                                    </p>
                                    <p className="mt-1 text-amber-800">
                                        Metro Manila: 1-2 days. Provincial: 3-5
                                        days.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === "payment" && (
                            <div className="space-y-5 text-slate-700">
                                <div>
                                    <p className="text-sm font-semibold">
                                        Select Payment Method
                                    </p>
                                    <select
                                        onChange={handlePaymentChange}
                                        value={payment}
                                        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                                    >
                                        <option value="">
                                            - Select payment -
                                        </option>
                                        <option value="cod">
                                            Cash on Delivery
                                        </option>
                                        <option value="card">
                                            Credit Card
                                        </option>
                                    </select>
                                    {errors?.payment_method && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.payment_method?.[0]}
                                        </p>
                                    )}
                                </div>

                                {payment === "card" && (
                                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Credit card
                                        </h3>
                                        <div className="mt-3 space-y-4">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                                    Card Number
                                                </p>
                                                <div className="mt-1 rounded-md border border-slate-200 px-3 py-3">
                                                    <CardNumberElement
                                                        options={
                                                            stripeElementOptions
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                                        Expiration
                                                    </p>
                                                    <div className="mt-1 rounded-md border border-slate-200 px-3 py-3">
                                                        <CardExpiryElement
                                                            options={
                                                                stripeElementOptions
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                                        CVC
                                                    </p>
                                                    <div className="mt-1 rounded-md border border-slate-200 px-3 py-3">
                                                        <CardCvcElement
                                                            options={
                                                                stripeElementOptions
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                                    ZIP / Postal Code
                                                </p>
                                                <input
                                                    type="text"
                                                    value={cardZipCode}
                                                    onChange={
                                                        handleCardZipCodeChange
                                                    }
                                                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                                                    placeholder="1000"
                                                />
                                            </div>

                                            {errors?.card && (
                                                <p className="text-red-500 text-sm">
                                                    {Array.isArray(errors.card)
                                                        ? errors.card[0]
                                                        : errors.card}
                                                </p>
                                            )}
                                            {errors?.card_zip && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.card_zip?.[0]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
                                        <p className="font-semibold text-slate-900">
                                            Wallets
                                        </p>
                                        <p className="mt-1 text-slate-600">
                                            GCash and PayPal supported.
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
                                        <p className="font-semibold text-slate-900">
                                            Cards
                                        </p>
                                        <p className="mt-1 text-slate-600">
                                            Visa, Mastercard, Amex.
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200">
                                    <p className="font-semibold mb-2 text-slate-700">
                                        Payment Notes
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-100">
                                            <p className="font-semibold text-slate-800">
                                                COD
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Pay on delivery
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-100">
                                            <p className="font-semibold text-slate-800">
                                                GCash
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Instant confirm
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-100">
                                            <p className="font-semibold text-slate-800">
                                                Card
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Secure gateway
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN (SUMMARY) */}
                    <div className="h-fit rounded-2xl bg-slate-900 p-6 sm:p-8 text-white shadow-xl ring-1 ring-slate-900/20 lg:sticky lg:top-6">
                        <h2 className="text-xl font-bold">Order Summary</h2>
                        <p className="mt-1 text-sm text-slate-300">
                            Review your items before placing the order.
                        </p>

                        <div className="mt-6 space-y-4 text-sm">
                            {carts.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between text-slate-200"
                                >
                                    <span>
                                        {item.product.name} x {item.quantity}
                                    </span>
                                    <span>
                                        {formatPHP(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}

                            <div className="h-px bg-slate-700" />

                            <div className="flex justify-between font-semibold text-slate-100">
                                <span>Subtotal</span>
                                <span>{formatPHP(subtotal)}</span>
                            </div>

                            <div className="flex justify-between text-slate-200">
                                <span>Shipping</span>
                                <span>{formatPHP(carts.length > 0 ? SHIPPING_FEE : 0)}</span>
                            </div>

                            <div className="rounded-lg bg-slate-800/70 p-3">
                                <p className="text-xs text-slate-300">
                                    Have a promo code?
                                </p>
                                <div className="mt-2 flex gap-2">
                                    <input
                                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-400"
                                        placeholder="ENTER CODE"
                                    />
                                    <button className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-slate-900">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-slate-700" />

                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{formatPHP(total)}</span>
                            </div>

                            {errors?.out_of_stock && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.out_of_stock?.[0]}
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={() => handlePlaceOrder()}
                                disabled={loading || carts.length === 0}
                                className="mt-2 cursor-pointer w-full rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/30 transition hover:bg-amber-300"
                            >
                                {loading ? "Placing Order..." : "Place Order"}
                            </button>

                            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                                <span>Free returns within 7 days</span>
                                <span>Support 24/7</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
