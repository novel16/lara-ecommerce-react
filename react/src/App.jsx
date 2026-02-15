import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import BaseLayout from "./layouts/BaseLayout";
import MyOrders from "./pages/base/MyOrders";
import Register from "./auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Login from "./auth/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import Products from "./pages/base/Products";
import Categories from "./pages/base/Categories";
import Contact from "./components/Contact";
import Home from "./pages/base/Home";
import ViewProduct from "./pages/base/ViewProduct";
import Cart from "./pages/base/Cart";
import Checkout from "./pages/base/Checkout";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

function App() {
    const stripePromise = loadStripe(
        "pk_test_51RxTbdE7eVJgEcnfRaNqsWgDwrU0QgMEWHpTskdFhcuXPisreujDPLwQJf27OfApmFQzXvz0y5RgiDpn08kdVPN900N1JUVzvT",
    );
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BaseLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route
                        path="/products/:id/:slug"
                        element={<ViewProduct />}
                    />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/myorders" element={<MyOrders />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route
                            path="/checkout"
                            element={
                                <Elements stripe={stripePromise}>
                                    <Checkout />
                                </Elements>
                            }
                        />
                    </Route>

                    {/* Guest Layouts */}
                    <Route element={<GuestRoute />}>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                    </Route>
                </Route>

                <Route path="admin/" element={<AdminLayout />}>
                    <Route element={<AdminRoute />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route
                            path="products/create"
                            element={<AdminProductForm />}
                        />
                        <Route
                            path="products/edit/:id"
                            element={<AdminProductForm />}
                        />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
