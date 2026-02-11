import React, { useEffect, useState, useContext } from "react";
import { BASE_URL } from "../../components/config";
import NoImage from "../../assets/images/no-image.jpg";
import { AuthContext } from "../../context/AuthContext";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AuthContext);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/V1/viewcart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setCartItems(data.data);
            }
        } catch (error) {
            console.error("Error fetching cart:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const increaseCartQty = async (id) => {
        try {
            const response = await fetch(`/api/V1/addqty/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }
            setCartItems((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, quantity: data.quantity }
                        : item,
                ),
            );
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const decreaseCartQty = async (id) => {
        try {
            const response = await fetch(`/api/V1/minusqty/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            // Update UI locally (same pattern as increase)
            setCartItems((prev) =>
                prev
                    .map((item) =>
                        item.id === id
                            ? { ...item, quantity: data.quantity }
                            : item,
                    )
                    // Optional: remove item kung 0 na quantity
                    .filter((item) => item.quantity > 0),
            );
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0,
    );

    return (
        <div className="bg-gray-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl text-gray-700 font-bold mb-6">
                    My Cart
                </h1>

                {loading && <p className="text-gray-600">Loading cart...</p>}

                {cartItems.length === 0 && !loading && (
                    <p className="text-gray-600">Your cart is empty.</p>
                )}

                <div className="space-y-6">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-white p-5 rounded-xl"
                        >
                            {/* IMAGE */}
                            <div className="w-full h-[200px] bg-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src={
                                        item.product.image
                                            ? `${BASE_URL}/storage/${item.product.image}`
                                            : NoImage
                                    }
                                    alt={item.product.name}
                                    className="w-full h-full  object-cover"
                                />
                            </div>

                            {/* PRODUCT DETAILS */}
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-gray-700">
                                    {item.product.name}
                                </h2>
                                <p className="text-gray-600">₱{item.price}</p>
                                <p className="text-sm text-gray-500">
                                    SKU: {item.product.sku}
                                </p>
                            </div>

                            {/* QUANTITY & SUBTOTAL */}
                            <div className="text-right space-y-3">
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        className="px-3 py-2 bg-gray-200 rounded cursor-pointer"
                                        onClick={() => decreaseCartQty(item.id)}
                                    >
                                        −
                                    </button>

                                    <span className="text-lg border border-gray-400 rounded p-1 font-semibold w-8 text-center">
                                        {item.quantity}
                                    </span>

                                    <button
                                        type="button"
                                        className="px-3 py-2 bg-gray-200 rounded cursor-pointer"
                                        onClick={() => increaseCartQty(item.id)}
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="text-lg font-bold text-gray-700">
                                    Subtotal: ₱{item.quantity * item.price}
                                </p>

                                <button className="bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TOTAL & CHECKOUT */}
                {cartItems.length > 0 && (
                    <div className="mt-8 text-right space-y-4">
                        <p className="text-2xl font-bold text-gray-700">
                            Total: ₱{totalPrice}
                        </p>

                        <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg">
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
