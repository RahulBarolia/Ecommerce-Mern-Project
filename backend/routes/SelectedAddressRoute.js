import express, { Router } from "express";

const router = express.Router();

import {
  addUserSelectedAddress,
  deleteAllUserSelectedAddresses,
  deleteUserSelectedAddress,
  fetchUserSelectedAddress,
} from "../controllers/SelectedAddressController.js";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.js";

// selected address routes

router.post("/user", verifyJwtToken, addUserSelectedAddress);
router.get("/user", verifyJwtToken, fetchUserSelectedAddress);
router.delete(
  "/user/deleted/all",
  verifyJwtToken,
  deleteAllUserSelectedAddresses
);
router.delete("/user/deleted/:id", verifyJwtToken, deleteUserSelectedAddress);

export default router;
