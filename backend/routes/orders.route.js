import express from "express";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.js";
import { fetchUserOrders } from "../controllers/orders.controllers.js";

const router = express.Router();

router.get("/user", verifyJwtToken, fetchUserOrders);

export default router;
