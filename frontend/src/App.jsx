import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./components/products/Product";
import { ProductProvider } from "./context/ProductProviderContext";
import ProductDetail from "./components/products/ProductDetail";
import Navbar from "./components/Navbar";
import SearchProducts from "./components/products/SearchProducts";
import { AuthProvider } from "./context/AuthProviderContext";
import Register from "./components/user/Register";
import Login from "./components/user/Login";
import { VerifyEmailOtp } from "./components/user/VerifyEmailOtp";
import ResetPassEmail from "./components/user/ResetPassEmail";
import { ResetPasswordOtp } from "./components/user/ResetPasswordOtp";
import ResetPassword from "./components/user/ResetPassword";
import Cart from "./components/Cart";
import { CartProvider } from "./context/CartProviderContext";
import DeliveryAddress from "./components/DeliveryAddress";
import { DeliveryAddressProvider } from "./context/DeliveryAddProviderContext";
import { WishlistProvider } from "./context/WishlistProviderContext";
import Wishlist from "./components/Wishlist";
import Checkout from "./components/Checkout";
import MyOrders from "./components/MyOrders";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <DeliveryAddressProvider>
                <Navbar />
                <Routes>
                  <Route path="/signup" element={<Register />} />
                  <Route
                    path="/verify-email-otp"
                    element={<VerifyEmailOtp />}
                  />
                  <Route
                    path="/verify-email-for-reset-password"
                    element={<ResetPassEmail />}
                  />
                  <Route
                    path="/reset-password-opt-verify"
                    element={<ResetPasswordOtp />}
                  />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-details" element={<MyOrders />} />
                  <Route
                    path="/delivery-address"
                    element={<DeliveryAddress />}
                  />
                  <Route path="/" element={<Product />} />
                  <Route
                    path="/product/:id/:category"
                    element={<ProductDetail />}
                  />
                  <Route
                    path="/product/search/:searchProduct"
                    element={<SearchProducts />}
                  />
                </Routes>
              </DeliveryAddressProvider>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
