import React, { useState, useContext, useEffect } from "react";
import CartContext from "../context/CartProviderContext";
import { Link, useNavigate } from "react-router-dom";
import DeliveryAddressContext from "../context/DeliveryAddProviderContext";
import {
  MdOutlineRadioButtonChecked,
  MdOutlineRadioButtonUnchecked,
} from "react-icons/md";

import { apiClient } from "../context/AuthProviderContext";
import { toast } from "react-toastify";

const Checkout = () => {
  const { carts, clearItemFromCart } = useContext(CartContext);

  const { selectedAddress, deleteAllUserSelectedAddresses } = useContext(
    DeliveryAddressContext
  );

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

  const proceedToPayment = async () => {
    try {
      const responseData = await apiClient.post("/payment/checkout", {
        amount: total,
      });

      const orderId = responseData?.data?.orderId;

      const options = {
        key: responseData?.data?.key_id,
        amount: total,
        currency: "INR",
        name: "Ecommerce",
        description: "Order Payment",
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyResponse = await apiClient.post(
              "/payment/verify-payment",

              {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                carts: carts[0]?.items,
                customerAddress: selectedAddress,
                total,
              }
            );

            if (verifyResponse?.data?.success) {
              navigate("/order-details");
              await clearItemFromCart();
              await deleteAllUserSelectedAddresses();
            } else {
              toast.error("Payment verification failed");
            }
          } catch (verifyError) {
            toast.error("An error occurred during payment verification.");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment error:", error.message);
      toast.error("An error occurred while initiating payment.");
    }
  };

  useEffect(() => {
    calculateSubtotal();
  }, [carts]);

  return (
    <div className="container mx-auto p-4 mt-32 md:mt-20 lg:mt-20">
      <div>
        <h1 className="text-xl font-semibold mb-4 text-center text-blue-900">
          Review Your Order & Proceed to pay
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:flex lg:flex-row gap-6">
        <div className="lg:w-1/3 space-y-4">
          {products?.map((product, index) => (
            <div
              key={index}
              className="flex flex-row lg:flex-row items-center justify-between p-4 border-b"
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-24 w-24 object-contain mb-2 lg:mb-0 lg:mr-4"
              />
              <div className="flex flex-1 flex-col lg:flex-row lg:items-center justify-between w-full p-2">
                <div className="flex-1">
                  <h2 className="font-semibold">{product.title}</h2>
                  <p className="text-gray-600">Rs. {product.price}</p>
                  <h2 className="font-semibold">Qty : {product.quantity}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-1/3 p-4 border rounded-lg shadow-md max-h-[220px] bg-white">
          <h1 className="text-xl font-semibold mb-4">Price Details</h1>
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
        </div>

        <div className="lg:w-1/3 space-y-4">
          <div className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg">
            <div className="flex justify-end space-x-4">
              {selectedAddress?.selectedAddressId ? (
                <MdOutlineRadioButtonChecked className="text-lg cursor-pointer text-blue-500" />
              ) : (
                <MdOutlineRadioButtonUnchecked className="text-lg text-blue-500 cursor-pointer" />
              )}
            </div>
            <h1 className="font-semibold">
              Full Name:{" "}
              <span className="font-normal">{selectedAddress?.fullName}</span>
            </h1>
            <h1 className="font-semibold">
              Address:{" "}
              <span className="font-normal">{selectedAddress?.address}</span>
            </h1>
            <h1 className="font-semibold">
              Country:{" "}
              <span className="font-normal">{selectedAddress?.country}</span>
            </h1>
            <h1 className="font-semibold">
              State:{" "}
              <span className="font-normal">{selectedAddress?.state}</span>
            </h1>
            <h1 className="font-semibold">
              City: <span className="font-normal">{selectedAddress?.city}</span>
            </h1>
            <h1 className="font-semibold">
              Pincode:{" "}
              <span className="font-normal">{selectedAddress?.pincode}</span>
            </h1>
            <h1 className="font-semibold">
              Phone Number:{" "}
              <span className="font-normal">
                {selectedAddress?.phoneNumber}
              </span>
            </h1>
          </div>
          <div>
            <button
              className="w-full py-2 rounded bg-indigo-400 font-semibold"
              onClick={() => proceedToPayment()}
            >
              Procced To Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
