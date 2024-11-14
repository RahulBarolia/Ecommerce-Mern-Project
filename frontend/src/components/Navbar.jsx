import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProviderContext";
import { FaCartShopping } from "react-icons/fa6";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import CartContext from "../context/CartProviderContext";
import { FaSearch } from "react-icons/fa";
import WishlistContext from "../context/WishlistProviderContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { carts, setCartItems } = useContext(CartContext);
  const { setWishlistItems } = useContext(WishlistContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");
  const navigate = useNavigate();

  const products = carts[0]?.items;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchProduct !== "") {
      navigate(`/product/search/${searchProduct}`);
      setSearchProduct("");
    } else {
      navigate("/");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="w-full fixed top-0 left-0 flex justify-between items-center shadow-md p-4 bg-gray-100 z-10">
      <nav className="flex flex-wrap items-center w-full gap-4 md:justify-between">
        <div className="left w-full md:w-auto font-semibold text-2xl text-blue-900 flex items-center justify-between md:justify-start">
          <Link to="/" className="flex items-center space-x-2">
            <h1>Ecommerce</h1>
          </Link>

          <div className="flex items-center space-x-4 md:hidden">
            <div
              className="cursor-pointer"
              onClick={() => {
                user ? navigate("/wishlist") : navigate("login");
              }}
            >
              <MdOutlineFavoriteBorder className="text-3xl" />{" "}
            </div>

            <div
              className="relative cursor-pointer"
              onClick={() => {
                user ? navigate("/cart") : navigate("login");
              }}
            >
              <FaCartShopping className="text-2xl" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {products?.length || 0}
              </span>
            </div>

            <button onClick={toggleMenu} className="text-3xl md:hidden ml-2">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <div className="middle w-full md:w-[400px]">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <FaSearch className="absolute left-3 text-gray-500" />
            <input
              value={searchProduct}
              type="text"
              className="pl-10 pr-2 py-2 border rounded w-full"
              placeholder="Search products..."
              onChange={(e) => setSearchProduct(e.target.value)}
            />
          </form>
        </div>

        <div className="right w-full md:w-auto hidden md:flex items-center justify-center space-x-6 font-semibold text-xl mt-4 md:mt-0">
          <div
            className="cursor-pointer"
            onClick={() => {
              user ? navigate("/wishlist") : navigate("login");
            }}
          >
            <MdOutlineFavoriteBorder className="text-2xl" />{" "}
          </div>

          <div
            className="relative cursor-pointer"
            onClick={() => {
              user ? navigate("/cart") : navigate("login");
            }}
          >
            <FaCartShopping className="text-2xl" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {products?.length || 0}
            </span>
          </div>
          {user ? (
            <button
              onClick={async () => {
                setCartItems([]);
                setWishlistItems([]);
                await logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          )}
          <button onClick={() => navigate("/order-details")}>My Orders</button>
        </div>

        {menuOpen && (
          <div className="w-full md:hidden flex flex-col items-center space-y-4 font-semibold text-xl mt-4">
            {user ? (
              <button
                onClick={async function closeToggle() {
                  await logout();
                  setMenuOpen(!menuOpen);
                  setCartItems([]);
                  setWishlistItems([]);
                  navigate("/");
                }}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={function closeToggle() {
                  navigate("/login");
                  setMenuOpen(!menuOpen);
                }}
              >
                Login
              </button>
            )}

            <button
              onClick={function closeToggle() {
                navigate("/order-details");
                setMenuOpen(!menuOpen);
              }}
            >
              My Orders
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
