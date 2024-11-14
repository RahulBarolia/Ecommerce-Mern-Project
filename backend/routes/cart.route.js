import express from "express";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.js";
import {
  addToCart,
  clearCart,
  decreaseProductQty,
  fetchCartItems,
  increaseProductQty,
  removeProductFromCart,
} from "../controllers/cart.controllers.js";

const router = express.Router();

router.post("/add", verifyJwtToken, addToCart);
router.get("/user", verifyJwtToken, fetchCartItems);

router.delete("/clear-cart", verifyJwtToken, clearCart);
router.delete("/:productId", verifyJwtToken, removeProductFromCart);
router.put("/decrease-product-quantity", verifyJwtToken, decreaseProductQty);
router.put("/increase-product-quantity", verifyJwtToken, increaseProductQty);

export default router;
