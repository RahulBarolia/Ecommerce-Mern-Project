import { createContext, useContext, useEffect, useState } from "react";
import AuthContext, { apiClient } from "./AuthProviderContext";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const wishlist_products = wishlistItems[0]?.items;

  const { user } = useContext(AuthContext);

  const fetchWishlistItems = async () => {
    try {
      const response = await apiClient.get("/wishlist/user");
      setWishlistItems(response?.data?.wishlistItems);
    } catch (error) {
      console.log(error);
    }
  };

  const addWishlistItems = async (product) => {
    try {
      const response = await apiClient.post("/wishlist/add", product);
      if (response?.data?.success) {
        fetchWishlistItems();
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const isInWishlist = (productId) => {
    const response = wishlist_products?.some(
      (item) => item.productId?.toString() === productId.toString()
    );
    return response;
  };

  const removeItemFromWishlist = async (productId) => {
    try {
      const response = await apiClient.delete(`/wishlist/${productId}`);

      if (response?.data?.success) {
        fetchWishlistItems();
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const clearItemFromWishlist = async () => {
    try {
      const response = await apiClient.delete("/wishlist/clear-cart");
      if (response?.data?.success) {
        fetchWishlistItems();
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    }
  }, [user]);

  const contextValue = {
    addWishlistItems,
    wishlist_products,
    removeItemFromWishlist,
    clearItemFromWishlist,
    isInWishlist,
    setWishlistItems,
    fetchWishlistItems,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
