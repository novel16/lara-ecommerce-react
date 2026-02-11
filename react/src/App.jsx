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

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BaseLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id/:slug" element={<ViewProduct />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/myorders" element={<MyOrders />} />
                        <Route path="/cart" element={<Cart />} />

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
