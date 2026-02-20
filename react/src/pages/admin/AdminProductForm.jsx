import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../components/config";
import { AuthContext } from "../../context/AuthContext";

function AdminProductForm() {
    const { token } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditMode = Boolean(id);
    const [formValues, setFormValues] = useState({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
    });
    const [image, setImage] = useState(null);
    const [productImage, setProductImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [errors, setErrors] = useState({});
    const [requestError, setRequestError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(false);

    const pageTitle = isEditMode ? "Update Product" : "Create Product";

    const previewImageUrl = useMemo(() => {
        if (imagePreview) {
            return imagePreview;
        }

        if (productImage) {
            return `${BASE_URL}/storage/${productImage}`;
        }

        return "";
    }, [imagePreview, productImage]);

    const getFieldError = (field) => {
        const fieldError = errors?.[field];

        if (Array.isArray(fieldError)) {
            return fieldError[0];
        }

        return fieldError;
    };

    const handleFieldChange = (field) => (event) => {
        const value = event.target.value;

        setFormValues((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: undefined,
        }));

        setRequestError("");
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setImage(file);

        setImagePreview((previousPreview) => {
            if (previousPreview) {
                URL.revokeObjectURL(previousPreview);
            }

            return URL.createObjectURL(file);
        });

        setErrors((previous) => ({
            ...previous,
            image: undefined,
        }));

        setRequestError("");
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const getProductByID = useCallback(async () => {
        if (!isEditMode || !token) {
            return;
        }

        setLoadingProduct(true);
        setRequestError("");

        try {
            const response = await fetch(`/api/V1/admin/products/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load product details.");
            }

            setFormValues({
                name: data?.data?.name || "",
                description: data?.data?.description || "",
                price: data?.data?.price || "",
                stockQuantity: data?.data?.stock_quantity || "",
            });
            setProductImage(data?.data?.image || "");
        } catch (error) {
            setRequestError(error.message || "Something went wrong.");
        } finally {
            setLoadingProduct(false);
        }
    }, [id, isEditMode, token]);

    useEffect(() => {
        getProductByID();
    }, [getProductByID]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!token) {
            return;
        }

        const formData = new FormData();

        if (isEditMode) {
            formData.append("_method", "PUT");
        }

        formData.append("name", formValues.name);
        formData.append("description", formValues.description);
        formData.append("price", formValues.price);
        formData.append("stock_quantity", formValues.stockQuantity);

        if (image) {
            formData.append("image", image);
        }

        const url = isEditMode
            ? `/api/V1/admin/products/${id}`
            : "/api/V1/admin/products";

        setLoading(true);
        setErrors({});
        setRequestError("");

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.errors) {
                setErrors(data.errors);
                return;
            }

            if (!response.ok) {
                setRequestError(data.message || "Unable to save product.");
                return;
            }

            navigate("/admin/products");
        } catch (error) {
            setRequestError(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const stockValue = Number(formValues.stockQuantity || 0);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#cffafe,_#f8fafc_45%,_#e2e8f0)] p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 p-6 text-white shadow-xl shadow-cyan-950/20 md:p-8">
                    <div className="absolute -left-16 top-0 h-36 w-36 rounded-full bg-emerald-300/20 blur-3xl" />
                    <div className="absolute -right-12 bottom-0 h-40 w-40 rounded-full bg-cyan-200/20 blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">
                                Product Workspace
                            </p>
                            <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                                {pageTitle}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-200">
                                Fill in product details and keep your store inventory accurate and updated.
                            </p>
                        </div>
                        <Link
                            to="/admin/products"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-50"
                        >
                            Back to Products
                        </Link>
                    </div>
                </section>

                {requestError && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {requestError}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-900/5 md:p-6">
                        {loadingProduct ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="h-12 animate-pulse rounded-xl bg-slate-100"
                                    />
                                ))}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Product Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="e.g. Pancit Canton"
                                        value={formValues.name}
                                        onChange={handleFieldChange("name")}
                                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                    />
                                    {getFieldError("name") && (
                                        <p className="mt-1 text-sm text-rose-600">
                                            {getFieldError("name")}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows="4"
                                        placeholder="Write product description..."
                                        value={formValues.description}
                                        onChange={handleFieldChange("description")}
                                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                    />
                                    {getFieldError("description") && (
                                        <p className="mt-1 text-sm text-rose-600">
                                            {getFieldError("description")}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Price (PHP)
                                        </label>
                                        <input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="120"
                                            value={formValues.price}
                                            onChange={handleFieldChange("price")}
                                            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                        />
                                        {getFieldError("price") && (
                                            <p className="mt-1 text-sm text-rose-600">
                                                {getFieldError("price")}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="stockQuantity"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Quantity
                                        </label>
                                        <input
                                            id="stockQuantity"
                                            type="number"
                                            min="0"
                                            placeholder="10"
                                            value={formValues.stockQuantity}
                                            onChange={handleFieldChange("stockQuantity")}
                                            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                        />
                                        {getFieldError("stock_quantity") && (
                                            <p className="mt-1 text-sm text-rose-600">
                                                {getFieldError("stock_quantity")}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-700">
                                        Product Image
                                    </p>
                                    <label
                                        htmlFor="productImage"
                                        className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-cyan-400 hover:bg-cyan-50"
                                    >
                                        <span className="text-sm font-medium text-slate-700">
                                            Click to upload image
                                        </span>
                                        <span className="mt-1 text-xs text-slate-500">
                                            Recommended 500 x 500 (PNG or JPG)
                                        </span>
                                    </label>
                                    <input
                                        id="productImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    {image && (
                                        <p className="mt-2 text-xs text-slate-500">
                                            Selected file: {image.name}
                                        </p>
                                    )}
                                    {getFieldError("image") && (
                                        <p className="mt-1 text-sm text-rose-600">
                                            {getFieldError("image")}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                                    <Link
                                        to="/admin/products"
                                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading
                                            ? isEditMode
                                                ? "Updating..."
                                                : "Saving..."
                                            : isEditMode
                                              ? "Update Product"
                                              : "Save Product"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </section>

                    <aside className="space-y-4">
                        <div className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-900/5 md:p-6">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Mode
                            </p>
                            <p className="mt-2 text-lg font-bold text-slate-900">
                                {isEditMode ? "Editing Existing Product" : "Creating New Product"}
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                                {isEditMode
                                    ? "Changes will update the selected product in your inventory."
                                    : "New product will be added to your catalog once saved."}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-900/5 md:p-6">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Live Preview
                            </p>

                            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                {previewImageUrl ? (
                                    <img
                                        src={previewImageUrl}
                                        alt="Product preview"
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400">
                                        No image selected
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 space-y-2 text-sm">
                                <p className="font-semibold text-slate-900">
                                    {formValues.name || "Product name preview"}
                                </p>
                                <p className="text-slate-600">
                                    {formValues.description || "Description will appear here."}
                                </p>
                                <p className="font-semibold text-cyan-700">
                                    Price: {formValues.price || "0.00"}
                                </p>
                                <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                        stockValue > 0
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-rose-100 text-rose-700"
                                    }`}
                                >
                                    Stock: {formValues.stockQuantity || 0}
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default AdminProductForm;
