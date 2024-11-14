import mongoose from "mongoose";

const OrderPaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderId: { type: String },
    razorpayPaymentId: { type: String },
    amount: { type: Number },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { strict: false }
);

export const OrderPayment = mongoose.model("OrderPayment", OrderPaymentSchema);
