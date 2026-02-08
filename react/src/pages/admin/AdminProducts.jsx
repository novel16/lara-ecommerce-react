import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../components/config";
import { AuthContext } from "../../context/AuthContext";
import Pagination from "../../components/Pagination";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const { token } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const fetchProducts = async (page = 1) => {
        try {
            const response = await fetch(
                `/api/V1/admin/products?page=${page}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            setProducts(data.data);
            setCurrentPage(data.meta.current_page); // ✅ IMPORTANTE
            setLastPage(data.meta.last_page);
            console.log(data);
        } catch (error) {
            console.log("Something went wrong:", error.message);
        }
    };

    useEffect(() => {
        fetchProducts(1);
    }, []);

    const deleteProduct = async (productID) => {
        if (confirm("Are you sure? You want to delete.")) {
            try {
                const response = await fetch(
                    `/api/V1/admin/products/${productID}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                // const data = await response.json()
                if (response.ok) {
                    fetchProducts(currentPage);
                }
            } catch (error) {
                console.error("Something went wrong:", error.message);
            }
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                        Products
                    </h1>

                    <Link
                        to="/admin/products/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Add Product
                    </Link>
                </div>

                {/* Table Wrapper (scrollable on small screens) */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse hidden md:table">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left">Image</th>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Pcode</th>
                                <th className="p-3 text-left">Description</th>
                                <th className="p-3 text-left">Price</th>
                                <th className="p-3 text-left">Quantity</th>
                                <th className="p-3 text-left">Date Created</th>
                                <th className="p-3 text-left">Tools</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-3">
                                        {product.image ? (
                                            <img
                                                src={`${BASE_URL}/storage/${product.image}`}
                                                alt="product"
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <p className="text-xs text-red-500">
                                                No image
                                            </p>
                                        )}
                                    </td>
                                    <td className="p-3">{product.name}</td>
                                    <td className="p-3">{product.sku}</td>
                                    <td className="p-3">
                                        {product.description}
                                    </td>
                                    <td className="p-3">₱{product.price}</td>
                                    <td className="p-3">
                                        {product.stock_quantity}
                                    </td>
                                    <td className="p-3">
                                        {product.created_at}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/products/edit/${product.id}`}
                                                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteProduct(product.id)
                                                }
                                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={fetchProducts}
                    />
                </div>

                {/* 📱 MOBILE CARD VIEW */}
                <div className="md:hidden space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center gap-3 mb-3">
                            {/* <img
                                src="https://via.placeholder.com/70"
                                alt="product"
                                className="w-14 h-14 object-cover rounded-lg"
                            /> */}
                            <div>
                                <h2 className="font-semibold text-lg">
                                    Pancit Canton
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Sample Description
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <p>
                                <span className="font-semibold">Price:</span>{" "}
                                ₱120
                            </p>
                            <p>
                                <span className="font-semibold">Qty:</span> 10
                            </p>
                            <p>
                                <span className="font-semibold">Date:</span>{" "}
                                Feb. 03, 2026
                            </p>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Link
                                to="products/edit"
                                className="bg-green-500 text-white px-3 py-1 rounded-lg"
                            >
                                Edit
                            </Link>
                            <button className="bg-red-500 text-white px-3 py-1 rounded-lg">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProducts;
