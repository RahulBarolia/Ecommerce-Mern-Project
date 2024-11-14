import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOtp: String,
    verificationOtpExpiresAt: Date,

    resetPasswordOtp: String,
    resetPasswordOtpExpiresAt: Date,
    reset_token: String,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
