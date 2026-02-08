import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../components/config";
import { AuthContext } from "../../context/AuthContext";

function AdminProductForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState(""); // 👈 change
    const [price, setPrice] = useState(""); // 👈 change
    const [stockQuantity, setStockQuantity] = useState(""); // 👈 change
    const [image, setImage] = useState(null);
    const [productImage, setProductImage] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getProductByID = async () => {
            try {
                if (id) {
                    const response = await fetch(
                        `/api/V1/admin/products/${id}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    );
                    const data = await response.json();
                    console.log(data);
                    setName(data.data.name);
                    setDescription(data.data.description);
                    setPrice(data.data.price);
                    setStockQuantity(data.data.stock_quantity);
                    setProductImage(data.data.image);
                }
            } catch (error) {
                console.error("Something went wrong");
            }
        };
        getProductByID();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (id) {
            formData.append("_method", "PUT");
        }
        formData.append("name", name);
        formData.append("price", price);
        formData.append("stock_quantity", stockQuantity);

        if (description) {
            formData.append("description", description);
        }
        if (image) {
            formData.append("image", image);
        }

        const url = id
            ? `/api/V1/admin/products/${id}`
            : "/api/V1/admin/products";

        setLoading(true);
        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
                 headers: {
                  Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.errors) {
                setErrors(data.errors);
            }

            if (response.ok) {
                navigate("/admin/products");
            }

            console.log(data);
        } catch (error) {
            console.error("Something went wrong:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-4 md:p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                        {id ? "Update" : "Create"} Product
                    </h1>

                    <Link
                        to="/admin/products"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        ← Back to Products
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Pancit Canton"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errors?.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name?.[0]}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Write product description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        ></textarea>
                        {errors?.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description?.[0]}
                            </p>
                        )}
                    </div>

                    {/* Price & Quantity (side by side on desktop) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Price (₱)
                            </label>
                            <input
                                type="number"
                                placeholder="120"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            {errors?.price && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.price?.[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                placeholder="10"
                                value={stockQuantity}
                                onChange={(e) =>
                                    setStockQuantity(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            {errors?.stock_quantity && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.stock_quantity?.[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Product Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Recommended: square image (500x500)
                        </p>
                        {errors?.image && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.image?.[0]}
                            </p>
                        )}

                        {productImage && (
                            <div className="mt-3">
                                <img
                                    src={`${BASE_URL}/storage/${productImage}`}
                                    width={100}
                                    alt=""
                                />
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Link
                            to="/admin/products"
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            {id ? "Update Product" : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminProductForm;
