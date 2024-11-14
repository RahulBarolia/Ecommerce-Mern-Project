import { OrderPayment } from "../models/payment.model.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

export const checkout = async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);
    const orderId = order.id;

    res.json({
      success: true,
      orderId: orderId,
      key_id: process.env.key_id,
      amount: order.amount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      razorpayPaymentId,
      razorpay_order_id,
      razorpay_signature,
      carts,
      customerAddress,
      total,
    } = req.body;

    let orderConfirm = await OrderPayment.create({
      userId,
      razorpayPaymentId,
      razorpay_order_id,
      razorpay_signature,
      carts,
      customerAddress,
      total,
      status: "Paid",
    });
    await orderConfirm.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
