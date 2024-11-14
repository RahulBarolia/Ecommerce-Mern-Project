import React, { useState, useContext, useEffect } from "react";
import AuthContext, { apiClient } from "../context/AuthProviderContext";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FadeLoader } from "react-spinners";

const MyOrders = () => {
  const [orderItems, setOrderItems] = useState([]);

  const { user } = useContext(AuthContext);

  const fetchOrderItems = async () => {
    try {
      const response = await apiClient.get("/orders/user");
      if (response?.data?.success) {
        setOrderItems(response?.data?.myOrders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrderItems();
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4 mt-32 md:mt-20 lg:mt-20">
      {user ? (
        orderItems.length !== 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>
              {orderItems.map((order) => (
                <div key={order._id} className="p-4 border mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-gray-700">
                        <span className="font-semibold">Order ID:</span>{" "}
                        {order.razorpay_order_id}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Order Date:</span>{" "}
                        {format(new Date(order.createdAt), "MMMM dd, yyyy")}
                      </p>
                      <p
                        className={`${
                          order.status === "Paid"
                            ? "text-green-600"
                            : "text-red-600"
                        } font-semibold`}
                      >
                        Payment Status: {order.status}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.carts.map((cart, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border-b"
                      >
                        <img
                          src={cart.imageUrl}
                          alt={cart.title}
                          className="h-24 w-24 object-contain"
                        />
                        <div className="flex-1 px-4">
                          <h2 className="font-semibold">{cart.title}</h2>
                          <p className="text-gray-600">Qty: {cart.quantity}</p>
                          <p className="text-gray-600">Price: ₹{cart.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <p className="text-right font-semibold text-lg">
                      Total: ₹{order.total}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center flex-col">
            <h1 className="font-bold text-xl">No orders found.</h1>
          </div>
        )
      ) : (
        <div className="flex items-center flex-col">
          <h1 className="font-bold text-xl">
            Please log in to view your orders.
          </h1>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
