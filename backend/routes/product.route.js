import express from "express";
import { addProduct, fetchProducts } from "../controllers/product.controllers.js";

const router = express.Router();

router.post("/", addProduct);
router.get("/", fetchProducts);

export default router;
