import { useContext, useEffect } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

import WishlistContext from "../context/WishlistProviderContext";
import CartContext from "../context/CartProviderContext";
import AuthContext from "../context/AuthProviderContext";

const Wishlist = () => {
  const { user } = useContext(AuthContext);

  const { wishlist_products, removeItemFromWishlist } =
    useContext(WishlistContext);

  const { addCartItems, fetchCartItems, isInCart } = useContext(CartContext);

  const navigate = useNavigate();

  async function addItemsIncart(product) {
    const response = await addCartItems(product);
    if (response?.data?.success) {
      await fetchCartItems();
    }
  }

  return (
    <div className="w-full  p-4 mt-28 md:mt-20 lg:mt-20 space-y-2">
      {wishlist_products?.length !== 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {wishlist_products?.map((product, index) => (
            <div className="shadow-md relative bg-white rounded" key={index}>
              <button onClick={() => removeItemFromWishlist(product.productId)}>
                <MdDelete className="text-3xl text-red-500 right-0 absolute bg-gray-100 p-1 rounded-full mr-1" />
              </button>

              <div className="p-2">
                <img
                  src={product.imageUrl}
                  alt=""
                  className="h-36 object-contain w-full"
                />
              </div>

              <div className="p-2 space-y-2">
                <h1 className="truncate">{product.title}</h1>

                <h1 className="text-xl font-semibold">Rs. {product.price}</h1>
              </div>

              <div className="p-2">
                {isInCart(product?.productId) ? (
                  <div>
                    <button
                      className="px-4 py-2 border-none bg-green-500 rounded font-semibold hover:bg-green-400 transition duration-200 mr-4 w-full"
                      onClick={() => navigate("/cart")}
                    >
                      Go to Cart
                    </button>
                  </div>
                ) : (
                  <button
                    className="px-4 py-2 border-none bg-[#FFD814] rounded font-semibold hover:bg-yellow-500 transition duration-200 mr-4 w-full"
                    onClick={() =>
                      user ? addItemsIncart(product) : navigate("/login")
                    }
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-8">
          <p className="text-gray-600 text-lg">Your wishlist is empty!</p>
          <Link to="/" className="text-blue-500  mt-4 inline-block">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
