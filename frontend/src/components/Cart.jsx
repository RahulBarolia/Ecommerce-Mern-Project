import React, { useState, useContext, useEffect } from "react";
import CartContext from "../context/CartProviderContext";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    carts,
    removeItemFromCart,
    fetchCartItems,
    increaseProductQuantity,
    decreaseProductQuantity,
    clearItemFromCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const [subtotal, setSubtotal] = useState(0);
  const shippingCharge = 50;
  const discount = 100;

  const products = carts[0]?.items;

  const calculateSubtotal = () => {
    const total = products?.reduce(
      (acc, item) => acc + item?.price * item?.quantity,
      0
    );
    setSubtotal(total);
  };

  const total = subtotal + shippingCharge + discount;

  useEffect(() => {
    calculateSubtotal();
  }, [carts]);

  return (
    <div className="container mx-auto p-4 mt-32 md:mt-20 lg:mt-20">
      {products?.length !== 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
            {products?.map((product, index) => (
              <div
                key={index}
                className="flex flex-row  sm:flex-row items-center sm:items-start justify-between p-4 border-b "
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-24 w-24 object-contain sm:mr-4 mb-2 sm:mb-0"
                />

                <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between w-full p-2">
                  <div className="flex-1">
                    <h2 className="font-semibold ">{product.title}</h2>
                    <p className="text-gray-600">Rs. {product.price}</p>
                  </div>

                  <div className="flex items-center mt-2 sm:mt-0">
                    <button
                      onClick={() => {
                        decreaseProductQuantity(product.productId);
                      }}
                      className="px-2 py-1 border border-gray-400 text-gray-700"
                    >
                      -
                    </button>
                    <span className="px-3">{product.quantity}</span>
                    <button
                      onClick={() => {
                        increaseProductQuantity(product.productId);
                      }}
                      className="px-2 py-1 border border-gray-400 text-gray-700"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItemFromCart(product.productId)}
                      className="ml-4 px-3 py-1 text-red-600 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="w-full max-w-md">
              <button
                className="py-2 px-2 w-full text-white font-semibold rounded bg-gray-800"
                onClick={() => {
                  clearItemFromCart();
                }}
              >
                Clear cart
              </button>
            </div>
          </div>

          <div className="p-4 border rounded-lg shadow-md max-h-[300px] bg-white">
            <h2 className="text-xl font-semibold mb-4">Price Details</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>Rs. {discount}</span>
              </div>
              <div className="flex justify-between pb-4 border-b-2 border-b-gray-100">
                <span>Shipping Charge:</span>
                <span>Rs. {shippingCharge}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>Rs. {total}</span>
              </div>
            </div>

            <button
              className="mt-6 w-full bg-[#FFD814] hover:bg-yellow-500 text-white font-semibold py-2 rounded transition duration-200"
              onClick={() => {
                navigate("/delivery-address");
              }}
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center mt-8">
          <p className="text-gray-600 text-lg">Your cart is empty!</p>
          <Link to="/" className="text-blue-500  mt-4 inline-block">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
