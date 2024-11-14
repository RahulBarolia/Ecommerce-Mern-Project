import { Wishlist } from "../models/wishlist.model.js";

export const addToWishlist = async (req, res) => {
  const userId = req.userId;

  const { _id: productId, title, description, imageUrl, price } = req.body;

  try {
    let findItemByUserId = await Wishlist.findOne({ userId });

    if (!findItemByUserId) {
      findItemByUserId = new Wishlist({ userId, items: [] });
    }

    const itemIndex = findItemByUserId.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
    } else {
      findItemByUserId.items.push({
        productId,
        title,
        description,
        imageUrl,
        price,
      });
    }

    await findItemByUserId.save();

    return res.status(201).json({
      success: true,
      message: "Item added to wishlist",
      findItemByUserId,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchWishlistItems = async (req, res) => {
  const userId = req.userId;

  try {
    const wishlistItems = await Wishlist.find({ userId });
    if (!wishlistItems) {
      return res
        .status(400)
        .json({ success: false, message: "Items Not found" });
    }
    return res.status(200).json({ success: true, wishlistItems });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeProductFromWishlist = async (req, res) => {
  const userId = req.userId;
  const productId = req.params.productId;
  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.json({ success: false, message: "Item not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();

    return res
      .status(200)
      .json({ success: true, message: "Item removed from wishlist", wishlist });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const clearWishlist = async (req, res) => {
  const userId = req.userId;

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.json({ success: false, message: "Item not found" });
    }

    wishlist.items = [];

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "wishlist items successfully cleared",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
