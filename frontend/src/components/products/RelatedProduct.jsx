import React, { useContext } from "react";
import ProductContext from "../../context/ProductProviderContext";
import { Link, useNavigate } from "react-router-dom";
import CartContext from "../../context/CartProviderContext";
import { toast } from "react-toastify";
import WishlistContext from "../../context/WishlistProviderContext";
import { MdOutlineFavoriteBorder, MdFavorite } from "react-icons/md";
import AuthContext from "../../context/AuthProviderContext";

const RelatedProduct = ({ category }) => {
  const { products } = useContext(ProductContext);
  const { user } = useContext(AuthContext);
  const { addCartItems, carts, fetchCartItems, isInCart } =
    useContext(CartContext);

  const { addWishlistItems, isInWishlist, removeItemFromWishlist } =
    useContext(WishlistContext);

  const navigate = useNavigate();

  async function addItemsIncart(product) {
    const response = await addCartItems(product);
    if (response?.data?.success) {
      await fetchCartItems();
    }
  }

  return (
    <div className="space-y-4 p-2">
      <h1 className="text-2xl font-bold">Related Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products?.map((product) =>
          product?.category === category ? (
            <div
              className="shadow-md relative bg-white rounded"
              key={product._id}
            >
              <div>
                {isInWishlist(product?._id) ? (
                  <button>
                    <MdFavorite
                      className="text-3xl text-red-500 right-0 absolute bg-gray-100 p-1 rounded-full mr-1"
                      onClick={() => {
                        removeItemFromWishlist(product?._id);
                      }}
                    />
                  </button>
                ) : (
                  <button>
                    <MdOutlineFavoriteBorder
                      className="text-3xl right-0 absolute bg-gray-100 p-1 rounded-full mr-1"
                      onClick={() =>
                        user ? addWishlistItems(product) : navigate("/login")
                      }
                    />
                  </button>
                )}
              </div>
              <Link to={`/product/${product._id}/${product.category}`}>
                <div className="p-2">
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="h-36 object-contain w-full"
                  />
                </div>
              </Link>
              <div className="p-2 space-y-2">
                <h1 className="truncate">{product.title}</h1>

                <h1 className="text-xl font-semibold">Rs. {product.price}</h1>
              </div>

              <div className="p-2">
                {isInCart(product._id) ? (
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
          ) : null
        )}
      </div>
    </div>
  );
};

export default RelatedProduct;
