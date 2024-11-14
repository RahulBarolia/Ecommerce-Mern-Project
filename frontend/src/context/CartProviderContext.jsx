import { createContext, useContext, useEffect, useState } from "react";
import AuthContext, { apiClient } from "./AuthProviderContext";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carts, setCartItems] = useState([]);

  const { user } = useContext(AuthContext);

  const cart_products = carts[0]?.items;

  const fetchCartItems = async () => {
    try {
      const response = await apiClient.get("/cart/user");
      setCartItems(response?.data?.cartItems);
    } catch (error) {
      console.log(error);
    }
  };

  const addCartItems = async (product) => {
    try {
      const response = await apiClient.post("/cart/add", product);
      await fetchCartItems();
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const isInCart = (productId) => {
    const response = cart_products?.some(
      (item) => item.productId?.toString() === productId.toString()
    );
    return response;
  };

  const removeItemFromCart = async (productId) => {
    try {
      const response = await apiClient.delete(`/cart/${productId}`);

      if (response?.data?.success) {
        await fetchCartItems();
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const clearItemFromCart = async () => {
    try {
      const response = await apiClient.delete("/cart/clear-cart");
      if (response?.data?.success) {
        await fetchCartItems();
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const increaseProductQuantity = async (productId) => {
    try {
      const response = await apiClient.put("/cart/increase-product-quantity", {
        productId,
      });
      if (response?.data?.success) {
        await fetchCartItems();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseProductQuantity = async (productId) => {
    try {
      const response = await apiClient.put("/cart/decrease-product-quantity", {
        productId,
      });
      if (response?.data?.success) {
        await fetchCartItems();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const contextValue = {
    carts,
    addCartItems,
    fetchCartItems,
    isInCart,
    removeItemFromCart,
    increaseProductQuantity,
    decreaseProductQuantity,
    clearItemFromCart,
    setCartItems,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default CartContext;
