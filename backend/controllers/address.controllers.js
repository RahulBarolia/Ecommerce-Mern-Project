import { Address } from "../models/address.model.js";

export const addUserAddress = async (req, res) => {
  const userId = req.userId;
  const { fullName, pincode, address, phoneNumber, country, state, city } =
    req.body;

  try {
    const userAddress = new Address({
      userId,
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
      message: "User address created successfully",
      userAddress,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserAddress = async (req, res) => {
  const { _id, fullName, pincode, address, phoneNumber, country, state, city } =
    req.body;

  try {
    const findAddress = await Address.findById({ _id });

    findAddress.fullName = fullName;
    findAddress.pincode = pincode;
    findAddress.address = address;
    findAddress.phoneNumber = phoneNumber;
    findAddress.country = country;
    findAddress.state = state;
    findAddress.city = city;

    findAddress.save();

    return res.status(201).json({
      success: true,
      message: "User address updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchUserAddress = async (req, res) => {
  const userId = req.userId;

  try {
    const address = await Address.find({ userId });

    return res.status(200).json({ success: true, address });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUserAddress = async (req, res) => {
  const userId = req.userId;
  const deleteaddressId = req.params.addressId;

  try {
    const deletedAddress = await Address.findByIdAndDelete({
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
