import mongoose from "mongoose";

const userSelectedAddressSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    selectedAddressId: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const SelectedAddress = mongoose.model(
  "SelectedAddress",
  userSelectedAddressSchema
);
