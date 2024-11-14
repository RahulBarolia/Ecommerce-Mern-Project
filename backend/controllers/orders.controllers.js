import { OrderPayment } from "../models/payment.model.js";

export const fetchUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const myOrders = await OrderPayment.find({ userId });
    return res.status(200).json({ success: true, myOrders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
