import { Cart } from "../models/cart.model.js";

export const addToCart = async (req, res) => {
  const userId = req.userId;
  let { _id, productId, title, description, imageUrl, price } = req.body;

  if (_id && productId) {
    productId = productId;
  } else {
    productId = _id;
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
    } else {
      cart.items.push({
        productId,
        title,
        description,
        imageUrl,
        price,
      });
    }
    await cart.save();
    return res
      .status(201)
      .json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchCartItems = async (req, res) => {
  const userId = req.userId;

  try {
    const cartItems = await Cart.find({ userId });
    if (!cartItems) {
      return res
        .status(400)
        .json({ success: false, message: "Items Not found" });
    }
    return res.status(200).json({ success: true, cartItems });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeProductFromCart = async (req, res) => {
  const userId = req.userId;
  const productId = req.params.productId;
  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({ success: false, message: "Item not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    return res
      .status(200)
      .json({ success: true, message: "Item deleted successfully", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  const userId = req.userId;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({ success: false, message: "Item not found" });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart successfully cleared",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const decreaseProductQty = async (req, res) => {
  const userId = req.userId;

  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      }
    } else {
      return res.json({ message: "Invalid product id" });
    }

    await cart.save();

    return res.json({
      success: true,
      message: "Item quantity decreased successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const increaseProductQty = async (req, res) => {
  const userId = req.userId;

  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity >= 5) {
        cart.items[itemIndex].quantity = 5;
      } else {
        cart.items[itemIndex].quantity += 1;
      }
    }

    await cart.save();

    return res.json({
      success: true,
      message: "Item quantity increased successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
