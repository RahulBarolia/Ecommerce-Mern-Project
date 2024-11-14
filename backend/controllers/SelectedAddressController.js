import { SelectedAddress } from "../models/UserSelectedAddress.model.js";

export const addUserSelectedAddress = async (req, res) => {
  const userId = req.userId;
  const {
    _id: selectedAddressId,
    fullName,
    pincode,
    address,
    phoneNumber,
    country,
    state,
    city,
  } = req.body;

  try {
    const userAddress = new SelectedAddress({
      userId,
      selectedAddressId,
      fullName,
      pincode,
      address,
      phoneNumber,
      country,
      state,
      city,
    });

    await userAddress.save();

    return res.status(201).json({
      success: true,
      message: "User address selected successfully add",
      userAddress,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchUserSelectedAddress = async (req, res) => {
  const userId = req.userId;

  try {
    const address = await SelectedAddress.find({ userId });

    return res.status(200).json({ success: true, address });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUserSelectedAddress = async (req, res) => {
  const deleteaddressId = req.params.id;

  try {
    const deletedAddress = await SelectedAddress.findByIdAndDelete({
      _id: deleteaddressId,
    });

    if (!deletedAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      deletedAddress,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAllUserSelectedAddresses = async (req, res) => {
  const userId = req.userId;
  try {
    const deletedAddresses = await SelectedAddress.deleteMany({ userId });

    if (!deletedAddresses) {
      return res
        .status(404)
        .json({ success: false, message: "No addresses found to delete" });
    }

    return res.status(200).json({
      success: true,
      message: "All selected addresses deleted successfully",
      deletedAddresses,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
