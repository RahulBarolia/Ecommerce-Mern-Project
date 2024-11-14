import axios from "axios";
import { useEffect, useState, createContext } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/product");
      setProducts(response.data.products);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const contextValue = {
    products,
    fetchProducts,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
