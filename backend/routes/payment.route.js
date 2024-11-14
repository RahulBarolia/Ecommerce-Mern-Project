import express from "express";
import { checkout, verifyPayment } from "../controllers/payment.controllers.js";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.js";

const router = express.Router();

router.post("/checkout", verifyJwtToken, checkout);

router.post("/verify-payment", verifyJwtToken, verifyPayment);

export default router;
