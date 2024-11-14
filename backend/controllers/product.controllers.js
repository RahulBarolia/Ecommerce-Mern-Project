import { Product } from "../models/product.model.js";

export const addProduct = async (req, res) => {
  const { title, description, imageUrl, price, category } = req.body;

  try {
    const product = await new Product({
      title,
      description,
      imageUrl,
      price,
      category,
    });
    product.save();
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: fasle, message: error.message });
  }
};

export const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
