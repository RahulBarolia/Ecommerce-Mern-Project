import express from "express";
import {
  addToWishlist,
  clearWishlist,
  fetchWishlistItems,
  removeProductFromWishlist,
} from "../controllers/wishlist.controllers.js";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.js";

const router = express.Router();

router.post("/add", verifyJwtToken, addToWishlist);
router.get("/user", verifyJwtToken, fetchWishlistItems);
router.delete("/clear-wishlist", verifyJwtToken, clearWishlist);
router.delete("/:productId", verifyJwtToken, removeProductFromWishlist);

export default router;
