import React, { useContext } from "react";
import ProductContext from "../../context/ProductProviderContext";
import { useParams, useNavigate } from "react-router-dom";
import RelatedProduct from "./RelatedProduct";
import CartContext from "../../context/CartProviderContext";
import { toast } from "react-toastify";
import { MdOutlineFavoriteBorder, MdFavorite } from "react-icons/md";
import WishlistContext from "../../context/WishlistProviderContext";
import AuthContext from "../../context/AuthProviderContext";

const ProductDetail = () => {
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

  const { id, category } = useParams();

  return (
    <div className="w-full  mt-28 md:mt-20 lg:mt-20 p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
        {products?.map((product) =>
          product?._id === id ? (
            <div
              className="shadow-md flex flex-col md:flex-row justify-between bg-white rounded-lg overflow-hidden"
              key={product._id}
            >
              <div className="p-2 relative flex justify-center items-center md:w-1/3 lg:w-1/3">
                <div>
                  {isInWishlist(product?._id) ? (
                    <button>
                      <MdFavorite
                        className="text-3xl text-red-500 right-0 top-0 absolute bg-gray-100 p-1 rounded-full mr-1"
                        onClick={() => {
                          removeItemFromWishlist(product?._id);
                        }}
                      />
                    </button>
                  ) : (
                    <button>
                      <MdOutlineFavoriteBorder
                        className="text-3xl right-0 top-0 absolute bg-gray-100 p-1 rounded-full mr-1"
                        onClick={() =>
                          user ? addWishlistItems(product) : navigate("/login")
                        }
                      />
                    </button>
                  )}
                </div>
                <img
                  src={product.imageUrl}
                  alt=""
                  className="h-48 object-contain w-full"
                />
              </div>

              <div className="p-4 md:w-2/3 lg:w-2/3 space-y-2">
                <h1 className="text-justify font-bold text-lg md:text-xl lg:text-2xl">
                  {product.title}
                </h1>

                <p className="text-justify">{product.description}</p>

                <h1 className="text-xl font-semibold">Rs. {product.price}</h1>
                <div className="pt-2">
                  {isInCart(product._id) ? (
                    <div>
                      <button
                        className="px-4 py-2 border-none bg-green-500 rounded font-semibold hover:bg-green-400 transition duration-200 mr-4"
                        onClick={() => navigate("/cart")}
                      >
                        Go to Cart
                      </button>
                    </div>
                  ) : (
                    <button
                      className="px-4 py-2 border-none bg-[#FFD814] rounded font-semibold hover:bg-yellow-500 transition duration-200 "
                      onClick={() =>
                        user ? addItemsIncart(product) : navigate("/login")
                      }
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>

      <RelatedProduct category={category} />
    </div>
  );
};

export default ProductDetail;
